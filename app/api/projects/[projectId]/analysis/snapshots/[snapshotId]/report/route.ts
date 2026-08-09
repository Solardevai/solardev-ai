import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  releaseUsage,
  reserveUsage,
  UsageLimitError,
} from "@/lib/billing/usage";
import { getOwnedAnalysisSnapshot } from "@/lib/gis/analysis-snapshots";
import {
  generateScreeningReport,
  screeningReportFilename,
} from "@/lib/gis/screening-report";
import { getSatelliteExhibit } from "@/lib/gis/satellite-exhibit";
import { getIndicativeSolarYield } from "@/lib/pvgis/indicative-yield";
import { getOwnedProject } from "@/lib/projects/data";

type ReportRouteContext = {
  params: Promise<{ projectId: string; snapshotId: string }>;
};

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
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

  let usageReservation: Awaited<ReturnType<typeof reserveUsage>> | null = null;
  try {
    usageReservation = await reserveUsage(userId, "screening-report", {
      projectId,
      snapshotId,
      idempotencyKey: `screening-report:${userId}:${snapshotId}`,
    });
    const ring = (project.site.geometry.coordinates[0] ?? []).filter(
      (coordinate) =>
        Number.isFinite(coordinate[0]) && Number.isFinite(coordinate[1]),
    );
    const [indicativeYield, satelliteExhibit] = await Promise.all([
      getIndicativeSolarYield(
        project.site.centroid[1],
        project.site.centroid[0],
      ).catch((yieldError) => {
        console.warn("[Screening report] indicative PVGIS yield unavailable", {
          projectId,
          snapshotId,
          yieldError,
        });
        return null;
      }),
      getSatelliteExhibit(ring, 499.28 / 390).catch((satelliteError) => {
        console.warn("[Screening report] satellite imagery unavailable", {
          projectId,
          snapshotId,
          satelliteError,
        });
        return null;
      }),
    ]);
    const bytes = await generateScreeningReport(project, snapshot, {
      indicativeSpecificYield: indicativeYield?.specificYield ?? null,
      satelliteExhibit,
    });
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
    if (error instanceof UsageLimitError) {
      if (request.headers.get("accept")?.includes("text/html")) {
        return NextResponse.redirect(
          new URL("/dashboard?billing=report-limit", request.url),
          303,
        );
      }
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 429 },
      );
    }
    if (usageReservation?.newlyConsumed) {
      await releaseUsage(usageReservation.eventId).catch((releaseError) => {
        console.error("[Screening report] usage release failed", {
          eventId: usageReservation?.eventId,
          releaseError,
        });
      });
    }
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
