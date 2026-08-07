import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { listOwnedAnalysisSnapshots } from "@/lib/gis/analysis-snapshots";

type SnapshotRouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(
  _request: NextRequest,
  context: SnapshotRouteContext,
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { projectId } = await context.params;
  const snapshots = await listOwnedAnalysisSnapshots(userId, projectId);
  return NextResponse.json(
    { snapshots },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
