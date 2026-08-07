import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { analyzePreliminarySiteScore } from "@/lib/gis/site-score";
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
    const score = await analyzePreliminarySiteScore(
      projectId,
      project.site.geometry,
    );
    return NextResponse.json(
      { score },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("[Preliminary site score] unexpected failure", {
      projectId,
      error,
    });
    return NextResponse.json(
      { error: "The preliminary site score could not be completed." },
      { status: 502 },
    );
  }
}
