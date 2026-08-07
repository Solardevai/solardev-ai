import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  analyzeSurfaceWater,
  SurfaceWaterSourceError,
} from "@/lib/gis/surface-water-service";
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
    const analysis = await analyzeSurfaceWater(
      projectId,
      project.site.geometry,
    );
    return NextResponse.json(
      { analysis },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    if (error instanceof SurfaceWaterSourceError) {
      console.error("[Surface water analysis] Overpass failed", {
        projectId,
        failures: error.failures,
      });
      return NextResponse.json(
        { error: error.message },
        { status: 503, headers: { "Retry-After": "20" } },
      );
    }
    console.error("[Surface water analysis] unexpected failure", {
      projectId,
      error,
    });
    return NextResponse.json(
      { error: "Surface-water screening could not be completed." },
      { status: 502 },
    );
  }
}
