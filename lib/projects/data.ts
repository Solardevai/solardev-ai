import "server-only";

import type { Project } from "@prisma/client";
import { infrastructureLayers } from "@/lib/gis/layers";
import { prisma } from "@/lib/prisma";
import {
  isProjectStatus,
  isProjectTechnology,
  parseVisibleLayers,
} from "@/lib/projects/project-values";
import type { PreliminarySiteScore } from "@/types/gis";
import type {
  PortfolioProjectSummary,
  ProjectSummary,
  SolarDevProject,
} from "@/types/project";

function defaultVisibleLayers() {
  return infrastructureLayers
    .filter((layer) => layer.defaultVisible)
    .map((layer) => layer.id);
}

export function serializeProject(project: Project): SolarDevProject {
  const boundary = project.boundary as unknown as GeoJSON.Polygon;
  const visibleLayers = parseVisibleLayers(project.visibleLayers);
  const centroid: [number, number] = [
    project.centroidLon ?? 0,
    project.centroidLat ?? 0,
  ];

  return {
    id: project.id,
    name: project.name,
    technology: isProjectTechnology(project.technology)
      ? project.technology
      : "solar",
    country: project.country,
    status: isProjectStatus(project.status) ? project.status : "screening",
    site: {
      geometry: boundary,
      areaSqm: project.areaSqm ?? 0,
      perimeterM: project.perimeterM ?? 0,
      centroid,
    },
    map: {
      center: [
        project.mapCenterLon ?? centroid[0],
        project.mapCenterLat ?? centroid[1],
      ],
      zoom: project.mapZoom ?? 13,
      visibleLayers: visibleLayers.length
        ? visibleLayers
        : defaultVisibleLayers(),
    },
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export function serializeProjectSummary(project: Project): ProjectSummary {
  const fullProject = serializeProject(project);
  return {
    id: fullProject.id,
    name: fullProject.name,
    technology: fullProject.technology,
    country: fullProject.country,
    status: fullProject.status,
    areaSqm: fullProject.site.areaSqm,
    createdAt: fullProject.createdAt,
    updatedAt: fullProject.updatedAt,
  };
}

export async function getOwnedProject(ownerId: string, projectId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId },
  });
  return project ? serializeProject(project) : null;
}

export async function listOwnedProjects(ownerId: string) {
  const projects = await prisma.project.findMany({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
  });
  return projects.map(serializeProjectSummary);
}

function criterionCounts(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("criteria" in payload)) {
    return { materialConstraintCount: 0, cautionCount: 0 };
  }
  const criteria = (payload as { criteria?: unknown }).criteria;
  if (!Array.isArray(criteria)) {
    return { materialConstraintCount: 0, cautionCount: 0 };
  }
  let materialConstraintCount = 0;
  let cautionCount = 0;
  for (const criterion of criteria) {
    if (!criterion || typeof criterion !== "object" || !("status" in criterion)) {
      continue;
    }
    if (criterion.status === "constraint") materialConstraintCount += 1;
    if (criterion.status === "caution") cautionCount += 1;
  }
  return { materialConstraintCount, cautionCount };
}

export async function listOwnedPortfolioProjects(
  ownerId: string,
): Promise<PortfolioProjectSummary[]> {
  const projects = await prisma.project.findMany({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      technology: true,
      country: true,
      status: true,
      areaSqm: true,
      createdAt: true,
      updatedAt: true,
      analysisSnapshots: {
        where: { analysisType: "preliminary-site-score" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          score: true,
          coveragePercent: true,
          confidence: true,
          band: true,
          methodologyVersion: true,
          payload: true,
          createdAt: true,
        },
      },
    },
  });

  return projects.map((project) => {
    const snapshot = project.analysisSnapshots[0];
    const counts = snapshot ? criterionCounts(snapshot.payload) : null;
    return {
      id: project.id,
      name: project.name,
      technology: isProjectTechnology(project.technology)
        ? project.technology
        : "solar",
      country: project.country,
      status: isProjectStatus(project.status) ? project.status : "screening",
      areaSqm: project.areaSqm ?? 0,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      latestAnalysis: snapshot
        ? {
            snapshotId: snapshot.id,
            score: snapshot.score,
            coveragePercent: snapshot.coveragePercent,
            confidence:
              snapshot.confidence as PreliminarySiteScore["confidence"],
            band: snapshot.band as PreliminarySiteScore["band"],
            methodologyVersion: snapshot.methodologyVersion,
            materialConstraintCount: counts?.materialConstraintCount ?? 0,
            cautionCount: counts?.cautionCount ?? 0,
            createdAt: snapshot.createdAt.toISOString(),
          }
        : null,
    };
  });
}
