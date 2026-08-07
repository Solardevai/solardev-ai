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
