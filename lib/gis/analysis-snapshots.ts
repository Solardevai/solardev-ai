import "server-only";

import type { AnalysisSnapshot, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  AnalysisSnapshotDetail,
  AnalysisSnapshotSummary,
  PreliminarySiteScore,
} from "@/types/gis";

const ANALYSIS_TYPE = "preliminary-site-score" as const;

function serializeSummary(
  snapshot: AnalysisSnapshot,
): AnalysisSnapshotSummary {
  return {
    id: snapshot.id,
    analysisType: ANALYSIS_TYPE,
    methodologyVersion: snapshot.methodologyVersion,
    score: snapshot.score,
    coveragePercent: snapshot.coveragePercent,
    confidence: snapshot.confidence as PreliminarySiteScore["confidence"],
    band: snapshot.band as PreliminarySiteScore["band"],
    createdAt: snapshot.createdAt.toISOString(),
  };
}

function serializeDetail(snapshot: AnalysisSnapshot): AnalysisSnapshotDetail {
  return {
    ...serializeSummary(snapshot),
    projectId: snapshot.projectId,
    payload: snapshot.payload as unknown as PreliminarySiteScore,
  };
}

export async function createAnalysisSnapshot(
  projectId: string,
  score: PreliminarySiteScore,
) {
  const snapshot = await prisma.analysisSnapshot.create({
    data: {
      projectId,
      analysisType: ANALYSIS_TYPE,
      methodologyVersion: score.methodology.version,
      score: score.score,
      coveragePercent: Math.round(score.coveragePercent),
      confidence: score.confidence,
      band: score.band,
      payload: score as unknown as Prisma.InputJsonValue,
    },
  });
  return serializeSummary(snapshot);
}

export async function listOwnedAnalysisSnapshots(
  ownerId: string,
  projectId: string,
  limit = 20,
) {
  const snapshots = await prisma.analysisSnapshot.findMany({
    where: {
      projectId,
      analysisType: ANALYSIS_TYPE,
      project: { ownerId },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return snapshots.map(serializeSummary);
}

export async function getOwnedAnalysisSnapshot(
  ownerId: string,
  projectId: string,
  snapshotId: string,
) {
  const snapshot = await prisma.analysisSnapshot.findFirst({
    where: {
      id: snapshotId,
      projectId,
      analysisType: ANALYSIS_TYPE,
      project: { ownerId },
    },
  });
  return snapshot ? serializeDetail(snapshot) : null;
}
