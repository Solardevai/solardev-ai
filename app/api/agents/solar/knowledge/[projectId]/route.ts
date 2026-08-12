import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { documentMetadataSchema, ingestProjectDocument, listProjectDocuments } from "@/lib/knowledge/project-knowledge";

export const runtime = "nodejs";

const jsonSchema = z.object({ title: z.string().trim().min(1).max(240), content: z.string().trim().min(10), metadata: documentMetadataSchema.default({ documentType: "project" }) });
const allowedExtensions = new Set(["txt", "md", "csv", "json"]);

type KnowledgeRouteContext = { params: Promise<{ projectId: string }> };

export async function GET(_request: Request, context: KnowledgeRouteContext) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const { projectId } = await context.params;
  try {
    const documents = await listProjectDocuments(userId, projectId);
    return Response.json({ documents, provider: process.env.SOLARDEV_RAG_API_URL ? "external" : "postgres" });
  } catch { return Response.json({ error: "Project not found." }, { status: 404 }); }
}

export async function POST(request: Request, context: KnowledgeRouteContext) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const { projectId } = await context.params;
  const maxBytes = Number(process.env.SOLARDEV_MAX_DOCUMENT_BYTES || 1_048_576);
  let title: string;
  let content: string;
  let metadata: z.infer<typeof documentMetadataSchema>;
  try {
    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) return Response.json({ error: "Choose a text, Markdown, CSV or JSON file." }, { status: 400 });
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!allowedExtensions.has(extension)) return Response.json({ error: "Phase 1 accepts TXT, Markdown, CSV and JSON files. PDF/DOCX extraction is planned for Phase 2." }, { status: 415 });
      if (file.size > maxBytes) return Response.json({ error: `Document exceeds ${maxBytes} bytes.` }, { status: 413 });
      title = String(form.get("title") || file.name).trim().slice(0, 240);
      content = (await file.text()).trim();
      metadata = documentMetadataSchema.parse({ documentType: String(form.get("documentType") || "project"), filename: file.name });
    } else {
      const declaredLength = Number(request.headers.get("content-length") || 0);
      if (declaredLength > maxBytes) return Response.json({ error: `Document exceeds ${maxBytes} bytes.` }, { status: 413 });
      const parsed = jsonSchema.parse(await request.json());
      ({ title, content, metadata } = parsed);
    }
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Invalid document." }, { status: 400 });
  }
  if (!title || content.length < 10) return Response.json({ error: "Document title and content are required." }, { status: 400 });
  if (Buffer.byteLength(content, "utf8") > maxBytes) return Response.json({ error: `Document exceeds ${maxBytes} bytes.` }, { status: 413 });
  try {
    const result = await ingestProjectDocument({ ownerId: userId, projectId, title, content, metadata });
    return Response.json({ document: { id: result.documentId, name: title, chunkCount: result.chunks }, status: "indexed", sourceLabel: `[SOURCE: ${title}]` }, { status: 201 });
  } catch (error) {
    console.error("Agent document ingestion failed", error);
    return Response.json({ error: error instanceof Error ? error.message : "Document ingestion failed." }, { status: 502 });
  }
}
