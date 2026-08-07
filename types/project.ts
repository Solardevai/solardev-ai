import type { ConstraintResult, MapView } from "@/types/gis";
import type { PreliminarySiteScore } from "@/types/gis";

export type ProjectTechnology = "solar" | "bess" | "hybrid";
export type ProjectStatus = "screening" | "development" | "due-diligence";

export type ProjectSite = {
  geometry: GeoJSON.Polygon;
  areaSqm: number;
  perimeterM: number;
  centroid: [longitude: number, latitude: number];
};

export type SolarDevProject = {
  id: string;
  name: string;
  technology: ProjectTechnology;
  country: string;
  status: ProjectStatus;
  site: ProjectSite;
  map: MapView;
  screening?: {
    score: number;
    constraints: ConstraintResult[];
  };
  createdAt: string;
  updatedAt: string;
};

export type ProjectSummary = Pick<
  SolarDevProject,
  "id" | "name" | "technology" | "country" | "status" | "createdAt" | "updatedAt"
> & {
  areaSqm: number;
};

export type PortfolioProjectSummary = ProjectSummary & {
  latestAnalysis: null | {
    snapshotId: string;
    score: number | null;
    coveragePercent: number;
    confidence: PreliminarySiteScore["confidence"];
    band: PreliminarySiteScore["band"];
    methodologyVersion: string;
    materialConstraintCount: number;
    cautionCount: number;
    createdAt: string;
  };
};

/** Current Site Assessment persistence contract. Expand alongside the database model. */
export type SaveProjectPayload = {
  name: string;
  technology?: ProjectTechnology;
  country?: string;
  boundary: GeoJSON.Polygon;
  areaSqm: number;
  perimeterM: number;
  centroidLat: number;
  centroidLon: number;
  map?: MapView;
};

export type UpdateProjectPayload = {
  name?: string;
  technology?: ProjectTechnology;
  country?: string;
  status?: ProjectStatus;
  map?: MapView;
};
