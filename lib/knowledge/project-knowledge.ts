import "server-only";

import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const documentMetadataSchema = z.object({
  country: z.string().trim().max(100).optional(),
  technology: z.enum(["solar", "bess", "hybrid", "grid", "other"]).optional(),
  discipline: z.string().trim().max(100).optional(),
  documentType: z.enum(["project", "standard", "regulation", "datasheet", "methodology", "manual", "other"]).default("project"),
  authority: z.string().trim().max(160).optional(),
  version: z.string().trim().max(80).optional(),
  effectiveDate: z.string().trim().max(40).optional(),
  filename: z.string().trim().max(255).optional(),
});

export type KnowledgeHit = {
  id: string;
  title: string;
  excerpt: string;
  score: number;
  citation: string;
  metadata: z.infer<typeof documentMetadataSchema>;
};

function chunkText(text: string, size = 1_000, overlap = 150) {
  const chunks: string[] = [];
  for (let start = 0; start < text.length; start += size - overlap) {
    const chunk = text.slice(start, start + size).trim();
    if (chunk) chunks.push(chunk);
    if (start + size >= text.length) break;
  }
  return chunks;
}

function queryTerms(query: string) {
  return [...new Set(query.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) ?? [])];
}

async function assertOwnedProject(ownerId: string, projectId: string) {
  const project = await prisma.project.findFirst({ where: { id: projectId, ownerId }, select: { id: true } });
  if (!project) throw new Error("Project not found.");
}

function externalHeaders() {
  return { "content-type": "application/json", ...(process.env.SOLARDEV_RAG_API_TOKEN ? { authorization: `Bearer ${process.env.SOLARDEV_RAG_API_TOKEN}` } : {}) };
}

export async function ingestProjectDocument(input: {
  ownerId: string;
  projectId: string;
  title: string;
  content: string;
  metadata: z.infer<typeof documentMetadataSchema>;
}) {
  await assertOwnedProject(input.ownerId, input.projectId);
  const chunks = chunkText(input.content);
  if (process.env.SOLARDEV_RAG_API_URL) {
    const response = await fetch(`${process.env.SOLARDEV_RAG_API_URL.replace(/\/$/, "")}/ingest`, {
      method: "POST",
      headers: externalHeaders(),
      body: JSON.stringify({ projectId: input.projectId, title: input.title, content: input.content, metadata: input.metadata }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error(`Knowledge service returned ${response.status}.`);
    return response.json() as Promise<{ documentId: string; chunks: number }>;
  }
  const document = await prisma.agentDocument.create({
    data: {
      projectId: input.projectId,
      title: input.title,
      metadata: input.metadata as Prisma.InputJsonValue,
      chunks: { create: chunks.map((content, ordinal) => ({ content, ordinal })) },
    },
    select: { id: true },
  });
  return { documentId: document.id, chunks: chunks.length };
}

export async function searchProjectKnowledge(ownerId: string, projectId: string, query: string, limit = 5): Promise<KnowledgeHit[]> {
  await assertOwnedProject(ownerId, projectId);
  if (process.env.SOLARDEV_RAG_API_URL) {
    const response = await fetch(`${process.env.SOLARDEV_RAG_API_URL.replace(/\/$/, "")}/search`, {
      method: "POST",
      headers: externalHeaders(),
      body: JSON.stringify({ projectId, query, limit }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`Knowledge service returned ${response.status}.`);
    return response.json() as Promise<KnowledgeHit[]>;
  }
  const terms = queryTerms(query);
  if (!terms.length) return [];
  const chunks = await prisma.agentDocumentChunk.findMany({
    where: { document: { projectId, project: { ownerId } } },
    include: { document: { select: { title: true, metadata: true } } },
    orderBy: [{ document: { createdAt: "desc" } }, { ordinal: "asc" }],
    take: 250,
  });
  return chunks
    .map((chunk) => {
      const normalized = chunk.content.toLowerCase();
      const score = terms.reduce((total, term) => total + (normalized.includes(term) ? 1 : 0), 0) / terms.length;
      const metadata = documentMetadataSchema.parse(chunk.document.metadata ?? {});
      return { id: chunk.id, title: chunk.document.title, excerpt: chunk.content, score, metadata, citation: `[SOURCE: ${chunk.document.title}, chunk ${chunk.ordinal + 1}${metadata.version ? `, ${metadata.version}` : ""}]` };
    })
    .filter((hit) => hit.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

export async function listProjectDocuments(ownerId: string, projectId: string) {
  await assertOwnedProject(ownerId, projectId);
  if (process.env.SOLARDEV_RAG_API_URL) return [];
  return prisma.agentDocument.findMany({
    where: { projectId, project: { ownerId } },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, metadata: true, createdAt: true, _count: { select: { chunks: true } } },
    take: 25,
  });
}
