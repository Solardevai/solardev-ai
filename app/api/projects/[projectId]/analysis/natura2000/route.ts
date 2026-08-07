import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  analyzeNatura2000,
  Natura2000SourceError,
} from "@/lib/gis/natura2000-service";
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
    const analysis = await analyzeNatura2000(
      projectId,
      project.site.geometry,
    );
    return NextResponse.json(
      { analysis },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    if (error instanceof Natura2000SourceError) {
      console.error("[Natura 2000 analysis] EEA service failed", {
        projectId,
        error: error.message,
      });
      return NextResponse.json(
        { error: "The EEA Natura 2000 service is temporarily unavailable." },
        { status: 503, headers: { "Retry-After": "30" } },
      );
    }
    console.error("[Natura 2000 analysis] unexpected failure", {
      projectId,
      error,
    });
    return NextResponse.json(
      { error: "Natura 2000 screening could not be completed." },
      { status: 502 },
    );
  }
}
