import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  constraintRegisterFilename,
  generateConstraintRegisterCsv,
} from "@/lib/gis/constraint-register";
import { getOwnedAnalysisSnapshot } from "@/lib/gis/analysis-snapshots";
import { getOwnedProject } from "@/lib/projects/data";

type ConstraintRegisterRouteContext = {
  params: Promise<{ projectId: string; snapshotId: string }>;
};

export async function GET(
  _request: NextRequest,
  context: ConstraintRegisterRouteContext,
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { projectId, snapshotId } = await context.params;
  const [project, snapshot] = await Promise.all([
    getOwnedProject(userId, projectId),
    getOwnedAnalysisSnapshot(userId, projectId, snapshotId),
  ]);
  if (!project || !snapshot) {
    return NextResponse.json(
      { error: "Constraint-register evidence not found." },
      { status: 404 },
    );
  }

  const csv = generateConstraintRegisterCsv(project, snapshot);
  return new Response(csv, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="${constraintRegisterFilename(project)}"`,
      "Content-Type": "text/csv; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
