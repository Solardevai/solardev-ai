import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getOwnedAnalysisSnapshot } from "@/lib/gis/analysis-snapshots";

type SnapshotRouteContext = {
  params: Promise<{ projectId: string; snapshotId: string }>;
};

export async function GET(
  _request: NextRequest,
  context: SnapshotRouteContext,
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { projectId, snapshotId } = await context.params;
  const snapshot = await getOwnedAnalysisSnapshot(
    userId,
    projectId,
    snapshotId,
  );
  if (!snapshot) {
    return NextResponse.json({ error: "Snapshot not found." }, { status: 404 });
  }

  return NextResponse.json(
    { snapshot },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
