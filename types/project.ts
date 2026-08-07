import type { ConstraintResult, MapView } from "@/types/gis";

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

/** Current Site Check persistence contract. Expand alongside the database model. */
export type SaveProjectPayload = {
  name: string;
  boundary: GeoJSON.Polygon;
  areaSqm: number;
  perimeterM: number;
  centroidLat: number;
  centroidLon: number;
};
