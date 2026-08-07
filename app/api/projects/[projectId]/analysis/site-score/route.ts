import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  attachUsageSnapshot,
  releaseUsage,
  reserveUsage,
  UsageLimitError,
} from "@/lib/billing/usage";
import { createAnalysisSnapshot } from "@/lib/gis/analysis-snapshots";
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

  let usageReservation: Awaited<ReturnType<typeof reserveUsage>> | null = null;
  try {
    usageReservation = await reserveUsage(userId, "site-score", { projectId });
    const score = await analyzePreliminarySiteScore(
      projectId,
      project.site.geometry,
    );
    const snapshot = await createAnalysisSnapshot(projectId, score);
    await attachUsageSnapshot(usageReservation.eventId, snapshot.id).catch(
      (attachError) => {
        console.error("[Preliminary site score] usage audit link failed", {
          eventId: usageReservation?.eventId,
          snapshotId: snapshot.id,
          attachError,
        });
      },
    );
    return NextResponse.json(
      { score, snapshot },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    if (error instanceof UsageLimitError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 429 },
      );
    }
    if (usageReservation?.newlyConsumed) {
      await releaseUsage(usageReservation.eventId).catch((releaseError) => {
        console.error("[Preliminary site score] usage release failed", {
          eventId: usageReservation?.eventId,
          releaseError,
        });
      });
    }
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
