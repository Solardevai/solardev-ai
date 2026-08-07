export type GisLayerGroup =
  | "basemap"
  | "infrastructure"
  | "environment"
  | "terrain";
export type GisLayerSourceType = "raster-tiles" | "api-geojson" | "arcgis-rest";
export type GisLayerAnalysis = "context" | "distance" | "intersection";

export type GisLayerDefinition = {
  id: string;
  name: string;
  group: GisLayerGroup;
  sourceType: GisLayerSourceType;
  defaultVisible: boolean;
  minimumZoom: number;
  color?: string;
  metadata: {
    provider: string;
    licence: string;
    attribution?: string;
  };
  screening: {
    enabled: boolean;
    analysis: GisLayerAnalysis;
  };
};

export const INFRASTRUCTURE_LAYER_IDS = [
  "roads",
  "mv",
  "hv",
  "ehv",
  "substations",
  "unknown",
] as const;

export type InfrastructureLayerId =
  (typeof INFRASTRUCTURE_LAYER_IDS)[number];

export const satelliteBasemap = {
  id: "satellite",
  name: "Satellite",
  group: "basemap",
  sourceType: "raster-tiles",
  defaultVisible: true,
  minimumZoom: 0,
  tileUrl:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  tileSize: 256,
  metadata: {
    provider: "Esri World Imagery",
    licence: "Esri service terms",
    attribution:
      "Sources: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
  },
  screening: { enabled: false, analysis: "context" },
} as const satisfies GisLayerDefinition & {
  tileUrl: string;
  tileSize: number;
};

export const infrastructureLayers = [
  {
    id: "roads",
    name: "Main roads",
    color: "#f8fafc",
    minimumZoom: 9,
    defaultVisible: false,
    screening: { enabled: true, analysis: "distance" },
  },
  {
    id: "mv",
    name: "MV 1–<45 kV",
    color: "#fb923c",
    minimumZoom: 8,
    defaultVisible: false,
    screening: { enabled: true, analysis: "distance" },
  },
  {
    id: "hv",
    name: "HV 45–<220 kV",
    color: "#ef4444",
    minimumZoom: 7,
    defaultVisible: false,
    screening: { enabled: true, analysis: "distance" },
  },
  {
    id: "ehv",
    name: "EHV ≥220 kV",
    color: "#a855f7",
    minimumZoom: 6,
    defaultVisible: false,
    screening: { enabled: true, analysis: "distance" },
  },
  {
    id: "substations",
    name: "Substations",
    color: "#22d3ee",
    minimumZoom: 5,
    defaultVisible: true,
    screening: { enabled: true, analysis: "distance" },
  },
  {
    id: "unknown",
    name: "Voltage unknown",
    color: "#94a3b8",
    minimumZoom: 8,
    defaultVisible: false,
    screening: { enabled: false, analysis: "context" },
  },
] as const satisfies ReadonlyArray<
  Omit<GisLayerDefinition, "group" | "sourceType" | "metadata"> & {
    id: InfrastructureLayerId;
    color: string;
  }
>;

export const constraintLayers = [
  {
    id: "natura-2000",
    name: "Natura 2000",
    group: "environment",
    sourceType: "arcgis-rest",
    defaultVisible: false,
    minimumZoom: 7,
    color: "#f43f5e",
    metadata: {
      provider: "European Environment Agency",
      licence: "CC BY 4.0",
      attribution: "EEA, Copenhagen, 2025 · Natura 2000 dataset version 2024",
    },
    screening: { enabled: true, analysis: "intersection" },
  },
  {
    id: "nationally-designated-areas",
    name: "Nationally designated areas",
    group: "environment",
    sourceType: "arcgis-rest",
    defaultVisible: false,
    minimumZoom: 7,
    color: "#f59e0b",
    metadata: {
      provider: "European Environment Agency",
      licence: "EEA standard re-use policy",
      attribution: "EEA NatDA query service v23 · reporting through May 2025",
    },
    screening: { enabled: true, analysis: "intersection" },
  },
  {
    id: "flood-risk-areas",
    name: "Floods Directive risk areas",
    group: "environment",
    sourceType: "arcgis-rest",
    defaultVisible: false,
    minimumZoom: 7,
    color: "#38bdf8",
    metadata: {
      provider: "European Environment Agency",
      licence: "EEA standard re-use policy",
      attribution: "EEA · Floods Directive 2019 operational reporting service",
    },
    screening: { enabled: true, analysis: "intersection" },
  },
  {
    id: "surface-water",
    name: "Surface water and wetlands",
    group: "environment",
    sourceType: "api-geojson",
    defaultVisible: false,
    minimumZoom: 10,
    color: "#22d3ee",
    metadata: {
      provider: "OpenStreetMap contributors via Overpass API",
      licence: "Open Database License (ODbL)",
    },
    screening: { enabled: true, analysis: "distance" },
  },
  {
    id: "terrain-slope",
    name: "Terrain elevation and slope",
    group: "terrain",
    sourceType: "api-geojson",
    defaultVisible: false,
    minimumZoom: 10,
    color: "#a3e635",
    metadata: {
      provider: "Copernicus DEM via Open-Meteo Elevation API",
      licence: "Copernicus data attribution requirements",
    },
    screening: { enabled: true, analysis: "context" },
  },
] as const satisfies ReadonlyArray<GisLayerDefinition>;

export const gisLayers: ReadonlyArray<GisLayerDefinition> = [
  satelliteBasemap,
  ...infrastructureLayers.map((layer) => ({
    ...layer,
    group: "infrastructure" as const,
    sourceType: "api-geojson" as const,
    metadata: {
      provider: "OpenStreetMap contributors via Overpass API",
      licence: "Open Database License (ODbL)",
    },
  })),
  ...constraintLayers,
];

const infrastructureLayerById = Object.fromEntries(
  infrastructureLayers.map((layer) => [layer.id, layer]),
) as Record<InfrastructureLayerId, (typeof infrastructureLayers)[number]>;

export function createInfrastructureVisibility(): Record<
  InfrastructureLayerId,
  boolean
> {
  return Object.fromEntries(
    infrastructureLayers.map((layer) => [layer.id, layer.defaultVisible]),
  ) as Record<InfrastructureLayerId, boolean>;
}

export function getInfrastructureLayer(id: InfrastructureLayerId) {
  return infrastructureLayerById[id];
}
