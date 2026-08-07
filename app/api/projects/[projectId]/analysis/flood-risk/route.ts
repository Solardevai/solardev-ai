import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  analyzeFloodRiskAreas,
  FloodRiskSourceError,
} from "@/lib/gis/flood-risk-service";
import { getOwnedProject } from "@/lib/projects/data";

type AnalysisRouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function POST(
  _request: NextRequest,
  context: AnalysisRouteContext,
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { projectId } = await context.params;
  const project = await getOwnedProject(userId, projectId);
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  try {
    const analysis = await analyzeFloodRiskAreas(
      projectId,
      project.site.geometry,
    );
    return NextResponse.json(
      { analysis },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    if (error instanceof FloodRiskSourceError) {
      console.error("[Flood risk analysis] EEA service failed", {
        projectId,
        error: error.message,
      });
      return NextResponse.json(
        { error: "The EEA Floods Directive service is temporarily unavailable." },
        { status: 503, headers: { "Retry-After": "30" } },
      );
    }
    console.error("[Flood risk analysis] unexpected failure", {
      projectId,
      error,
    });
    return NextResponse.json(
      { error: "Flood risk-area screening could not be completed." },
      { status: 502 },
    );
  }
}
