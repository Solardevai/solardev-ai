import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  analyzeTerrain,
  TerrainConfigurationError,
  TerrainSourceError,
} from "@/lib/gis/terrain-service";
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
    const analysis = await analyzeTerrain(projectId, project.site.geometry);
    return NextResponse.json(
      { analysis },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    if (error instanceof TerrainConfigurationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 503, headers: { "Retry-After": "3600" } },
      );
    }
    if (error instanceof TerrainSourceError) {
      console.error("[Terrain analysis] elevation service failed", {
        projectId,
        error: error.message,
      });
      return NextResponse.json(
        { error: "The terrain elevation service is temporarily unavailable." },
        { status: 503, headers: { "Retry-After": "30" } },
      );
    }
    console.error("[Terrain analysis] unexpected failure", {
      projectId,
      error,
    });
    return NextResponse.json(
      { error: "Terrain screening could not be completed." },
      { status: 502 },
    );
  }
}
