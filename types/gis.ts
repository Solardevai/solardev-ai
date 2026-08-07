import type { Coordinate } from "@/lib/geo/types";
import type { InfrastructureLayerId } from "@/lib/gis/layers";

export type MapView = {
  center: Coordinate;
  zoom: number;
  visibleLayers: InfrastructureLayerId[];
};

export type ConstraintRisk = "low" | "medium" | "high";

export type ConstraintResult = {
  layerId: string;
  intersects: boolean;
  affectedAreaSqm?: number;
  affectedSitePercent?: number;
  distanceM?: number;
  risk: ConstraintRisk;
  sourceDate?: string;
  confidence?: "low" | "medium" | "high";
  recommendedAction?: string;
};

export type ProximityClassification =
  | "on-site"
  | "near"
  | "moderate"
  | "remote"
  | "not-found";

export type InfrastructureProximityResult = {
  id: "main-road" | "transmission-line" | "substation";
  label: string;
  distanceM: number | null;
  classification: ProximityClassification;
  asset: null | {
    osmType: "node" | "way" | "relation";
    osmId: number;
    name: string | null;
    operator: string | null;
    voltage: number | null;
    roadClass: string | null;
  };
  recommendedAction: string;
};

export type InfrastructureAnalysis = {
  projectId: string;
  generatedAt: string;
  searchRadiusKm: number;
  assetsScanned: number;
  results: InfrastructureProximityResult[];
  source: {
    provider: string;
    endpoint: string | null;
    datasetTimestamp: string | null;
    retrievedAt: string;
    licence: string;
  };
  limitations: string[];
};

export type Natura2000Site = {
  code: string;
  name: string;
  designation: "Habitats" | "Birds" | "Habitats and Birds";
  memberState: string;
  releaseDate: string | null;
};

export type Natura2000ConstraintAnalysis = {
  projectId: string;
  generatedAt: string;
  result: ConstraintResult & {
    layerId: "natura-2000";
    label: "Natura 2000";
    affectedAreaSqm: number;
    affectedSitePercent: number;
    sites: Natura2000Site[];
  };
  source: {
    provider: "European Environment Agency";
    datasetVersion: "2024";
    copyright: "EEA, Copenhagen, 2025";
    licence: "CC BY 4.0";
    serviceUrl: string;
    metadataUrl: string;
    retrievedAt: string;
  };
  limitations: string[];
};

export type NationallyDesignatedArea = {
  cddaId: number;
  countryCode: string;
  name: string;
  nationalId: string | null;
  designationTypeCode: string | null;
  iucnCategory: string | null;
};

export type NationallyDesignatedAreasAnalysis = {
  projectId: string;
  generatedAt: string;
  result: ConstraintResult & {
    layerId: "nationally-designated-areas";
    label: "Nationally designated areas";
    affectedAreaSqm: number;
    affectedSitePercent: number;
    areas: NationallyDesignatedArea[];
  };
  source: {
    provider: "European Environment Agency";
    datasetVersion: "23";
    reportingPeriod: "through May 2025";
    licence: "EEA standard re-use policy";
    serviceUrl: string;
    metadataUrl: string;
    retrievedAt: string;
  };
  limitations: string[];
};

export type FloodRiskArea = {
  id: string;
  name: string;
  countryCode: string;
  reportingYear: string | null;
  hazardCategory: string | null;
  representation: "point" | "line" | "polygon";
};

export type FloodRiskAreaAnalysis = {
  projectId: string;
  generatedAt: string;
  result: ConstraintResult & {
    layerId: "flood-risk-areas";
    label: "Floods Directive risk areas";
    areas: FloodRiskArea[];
  };
  source: {
    provider: "European Environment Agency";
    serviceDataset: "2019 reporting service";
    latestReferenceDataset: "version 3.0, March 2025";
    licence: "EEA standard re-use policy";
    serviceUrl: string;
    metadataUrl: string;
    retrievedAt: string;
  };
  limitations: string[];
};
