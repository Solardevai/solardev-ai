import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getOwnedAnalysisSnapshot } from "@/lib/gis/analysis-snapshots";
import {
  generateScreeningReport,
  screeningReportFilename,
} from "@/lib/gis/screening-report";
import { getOwnedProject } from "@/lib/projects/data";

type ReportRouteContext = {
  params: Promise<{ projectId: string; snapshotId: string }>;
};

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: ReportRouteContext,
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
    return NextResponse.json({ error: "Report evidence not found." }, { status: 404 });
  }

  try {
    const bytes = await generateScreeningReport(project, snapshot);
    const body = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer;
    return new Response(body, {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename="${screeningReportFilename(project)}"`,
        "Content-Length": String(bytes.byteLength),
        "Content-Type": "application/pdf",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[Screening report] generation failed", {
      projectId,
      snapshotId,
      error,
    });
    return NextResponse.json(
      { error: "The screening report could not be generated." },
      { status: 500 },
    );
  }
}
