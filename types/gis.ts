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

export type ConstraintMapGeometry =
  | GeoJSON.Point
  | GeoJSON.LineString
  | GeoJSON.MultiLineString
  | GeoJSON.Polygon
  | GeoJSON.MultiPolygon;

export type ConstraintMapFeatureProperties = {
  criterionId: SiteScoreCriterionId;
  label: string;
  featureId: string;
  featureName: string | null;
};

export type ConstraintMapFeatureCollection = GeoJSON.FeatureCollection<
  ConstraintMapGeometry,
  ConstraintMapFeatureProperties
>;

export type InfrastructureAnalysis = {
  projectId: string;
  generatedAt: string;
  searchRadiusKm: number;
  assetsScanned: number;
  results: InfrastructureProximityResult[];
  mapFeatures: ConstraintMapFeatureCollection;
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
  mapFeatures: ConstraintMapFeatureCollection;
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
  mapFeatures: ConstraintMapFeatureCollection;
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
  mapFeatures: ConstraintMapFeatureCollection;
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

export type SurfaceWaterCategory =
  | "watercourse"
  | "standing-water"
  | "wetland";

export type SurfaceWaterProximityResult = {
  id: SurfaceWaterCategory;
  label: string;
  distanceM: number | null;
  classification: ProximityClassification;
  risk: ConstraintRisk;
  feature: null | {
    osmType: "way" | "relation";
    osmId: number;
    name: string | null;
    waterType: string;
    intermittent: boolean | null;
  };
  recommendedAction: string;
};

export type SurfaceWaterAnalysis = {
  projectId: string;
  generatedAt: string;
  searchRadiusKm: number;
  featuresScanned: number;
  results: SurfaceWaterProximityResult[];
  mapFeatures: ConstraintMapFeatureCollection;
  source: {
    provider: "OpenStreetMap contributors via Overpass API";
    endpoint: string;
    datasetTimestamp: string | null;
    retrievedAt: string;
    licence: "Open Database License (ODbL) 1.0";
  };
  limitations: string[];
};

export type TerrainAnalysis = {
  projectId: string;
  generatedAt: string;
  result: {
    layerId: "terrain-slope";
    label: "Terrain elevation and slope";
    sampleCount: number;
    minimumElevationM: number;
    maximumElevationM: number;
    meanElevationM: number;
    elevationRangeM: number;
    averageSlopeDeg: number;
    p90SlopeDeg: number;
    maximumSampledSlopeDeg: number;
    nonUsableNorthSlopeAreaSqm: number;
    nonUsableNorthSlopePercent: number;
    nonUsableCellCount: number;
    risk: ConstraintRisk;
    confidence: "medium";
    recommendedAction: string;
  };
  source: {
    provider: "Mapzen Terrain Tiles on AWS";
    dataset: "Global bare-earth Terrain Tiles DEM mosaic";
    resolutionM: 30;
    reference: "AWS Open Data terrain-tiles registry";
    serviceUrl: string;
    metadataUrl: "https://registry.opendata.aws/terrain-tiles/";
    retrievedAt: string;
    licence: "Source-specific open-data attribution requirements";
  };
  methodology: {
    sampling: "10 × 10 elevation-node grid producing clipped 9 × 9 terrain cells";
    slope: "central cell gradient from corner elevations";
    aspect: "downslope azimuth; north-facing sector 315°–45°";
    nonUsableRule: "slope >5° and north-facing";
  };
  nonUsableAreas: GeoJSON.FeatureCollection<
    GeoJSON.Polygon | GeoJSON.MultiPolygon,
    { slopeDeg: number; aspectDeg: number; areaSqm: number }
  >;
  limitations: string[];
};

export type SiteScoreCriterionId =
  | "natura-2000"
  | "national-designations"
  | "flood-risk-areas"
  | "surface-water"
  | "main-road"
  | "transmission-line"
  | "substation"
  | "terrain";

export type SiteScoreCriterion = {
  id: SiteScoreCriterionId;
  label: string;
  group: "environment" | "water" | "infrastructure" | "terrain";
  weight: number;
  score: number | null;
  deductionPoints: number | null;
  status: "favourable" | "caution" | "constraint" | "unavailable";
  evidence: string;
};

export type SiteScoreSource = {
  id: string;
  label: string;
  provider: string;
  dataset: string;
  version: string | null;
  licence: string;
  retrievedAt: string;
  serviceUrl: string | null;
  metadataUrl: string | null;
  limitations: string[];
};

export type ConstraintRegisterFeature = {
  identifier: string;
  name: string | null;
  jurisdiction: string | null;
  classification: string | null;
};

export type ConstraintRegisterRow = {
  criterionId: SiteScoreCriterionId;
  label: string;
  group: SiteScoreCriterion["group"];
  status: SiteScoreCriterion["status"];
  score: number | null;
  finding: string;
  intersects: boolean | null;
  affectedAreaSqm: number | null;
  affectedSitePercent: number | null;
  distanceM: number | null;
  sourceId: string;
  sourceRetrievedAt: string | null;
  features: ConstraintRegisterFeature[];
  recommendedActions: string[];
};

export type PreliminarySiteScore = {
  projectId: string;
  generatedAt: string;
  score: number | null;
  coveragePercent: number;
  confidence: "low" | "medium" | "high";
  band:
    | "favourable-screening"
    | "further-review"
    | "material-constraints"
    | "unavailable";
  criteria: SiteScoreCriterion[];
  unavailableSources: Array<{ id: string; label: string; reason: string }>;
  /** Added in methodology v1.1. Optional for backward-compatible v1.0 snapshots. */
  sources?: SiteScoreSource[];
  /** Added in methodology v1.2. Optional for backward-compatible snapshots. */
  constraintRegister?: ConstraintRegisterRow[];
  /** Added in methodology v1.3 for map display and usable-area screening. */
  terrainNonUsableAreas?: TerrainAnalysis["nonUsableAreas"];
  /** Saved intersecting geometries used by the project map and its legend. */
  constraintMapFeatures?: ConstraintMapFeatureCollection;
  methodology: {
    version: "1.0" | "1.1" | "1.2" | "1.3";
    totalWeight: 100;
    normalization: "available-weight normalized";
  };
  disclaimer: string;
};

export type AnalysisSnapshotSummary = {
  id: string;
  analysisType: "preliminary-site-score";
  methodologyVersion: string;
  score: number | null;
  coveragePercent: number;
  confidence: PreliminarySiteScore["confidence"];
  band: PreliminarySiteScore["band"];
  createdAt: string;
};

export type AnalysisSnapshotDetail = AnalysisSnapshotSummary & {
  projectId: string;
  payload: PreliminarySiteScore;
};
