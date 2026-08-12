import { auth } from "@clerk/nextjs/server";
import { createAgentUIStreamResponse } from "ai";
import { z } from "zod";
import { createSolarAgent } from "@/lib/agent/solar-agent";
import { getLatestOwnedAnalysisSnapshot } from "@/lib/gis/analysis-snapshots";
import { getOwnedProject } from "@/lib/projects/data";

export const runtime = "nodejs";
export const maxDuration = 60;

const manualInputsSchema = z.object({
  pvDcMw: z.number().positive().max(100_000).optional(),
  pvAcMw: z.number().positive().max(100_000).optional(),
  bessPowerMw: z.number().positive().max(100_000).optional(),
  bessEnergyMwh: z.number().positive().max(1_000_000).optional(),
  notes: z.string().trim().max(4_000).optional(),
}).default({});

const requestSchema = z.object({
  messages: z.array(z.unknown()).min(1).max(100),
  projectId: z.string().trim().min(1).max(100).optional(),
  manualInputs: manualInputsSchema,
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Sign in to use the SolarDev Engineering Copilot." }, { status: 401 });
  let payload: unknown;
  try { payload = await request.json(); } catch { return Response.json({ error: "Request body must be valid JSON." }, { status: 400 }); }
  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) return Response.json({ error: "Invalid agent request.", details: parsed.error.flatten() }, { status: 400 });
  const { projectId, manualInputs, messages } = parsed.data;
  const [project, latestAnalysis] = projectId ? await Promise.all([getOwnedProject(userId, projectId), getLatestOwnedAnalysisSnapshot(userId, projectId)]) : [null, null];
  if (projectId && !project) return Response.json({ error: "Project not found." }, { status: 404 });
  try {
    return createAgentUIStreamResponse({ agent: createSolarAgent(userId, { project, latestAnalysis: latestAnalysis?.payload ?? null, manualInputs }), uiMessages: messages, abortSignal: request.signal, timeout: { totalMs: 55_000 } });
  } catch (error) {
    console.error("SolarDev agent failed", error);
    return Response.json({ error: "The SolarDev agent could not start." }, { status: 500 });
  }
}
