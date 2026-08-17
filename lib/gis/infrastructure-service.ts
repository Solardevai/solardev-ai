import "server-only";

import type { InfrastructureLayerId } from "@/lib/gis/layers";

type OverpassTags = Record<string, string>;
type OverpassPoint = { lat: number; lon: number };
type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  geometry?: OverpassPoint[];
  center?: OverpassPoint;
  tags?: OverpassTags;
};

type OverpassResponse = {
  osm3s?: { timestamp_osm_base?: string };
  elements?: OverpassElement[];
};

export type InfrastructureBounds = {
  south: number;
  west: number;
  north: number;
  east: number;
};

export type InfrastructureFeatureProperties = {
  kind: "road" | "substation" | "mv" | "hv" | "ehv" | "power-unknown";
  osmType: OverpassElement["type"];
  osmId: number;
  voltage: number | null;
  voltageRaw: string | null;
  operator: string | null;
  name: string | null;
  roadClass: string | null;
  powerType: string | null;
  location: string | null;
  marker: boolean;
};

export type InfrastructureFeature = GeoJSON.Feature<
  GeoJSON.Point | GeoJSON.LineString | GeoJSON.Polygon,
  InfrastructureFeatureProperties
>;

export type InfrastructureFeatureCollection = GeoJSON.FeatureCollection<
  InfrastructureFeature["geometry"],
  InfrastructureFeatureProperties
> & {
  metadata: {
    source: string;
    sourceEndpoint: string | null;
    sourceTimestamp: string | null;
    retrievedAt: string;
    classification: string;
  };
};

export class InfrastructureSourceError extends Error {
  readonly failures: string[];

  constructor(message: string, failures: string[]) {
    super(message);
    this.name = "InfrastructureSourceError";
    this.failures = failures;
  }
}

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

const MINIMUM_SUBSTATION_VOLTAGE = 20_000;

function parseVoltage(value?: string) {
  if (!value) return null;
  const voltages = value
    .split(";")
    .map((entry) => Number(entry.trim()))
    .filter((entry) => Number.isFinite(entry) && entry > 0);
  return voltages.length ? Math.max(...voltages) : null;
}

function classifyPower(tags: OverpassTags) {
  if (tags.power === "substation") return "substation" as const;
  const voltage = parseVoltage(tags.voltage);
  if (!voltage) return "power-unknown" as const;
  if (voltage >= 220_000) return "ehv" as const;
  if (voltage >= 45_000) return "hv" as const;
  if (voltage >= 1_000) return "mv" as const;
  return "power-unknown" as const;
}

function geometryFor(element: OverpassElement) {
  if (element.type === "node" && element.lon != null && element.lat != null) {
    return {
      type: "Point" as const,
      coordinates: [element.lon, element.lat] as [number, number],
    };
  }

  if (element.geometry?.length) {
    const coordinates = element.geometry.map(
      (point) => [point.lon, point.lat] as [number, number],
    );
    if (
      element.tags?.power === "substation" &&
      coordinates.length >= 4 &&
      coordinates[0][0] === coordinates.at(-1)?.[0] &&
      coordinates[0][1] === coordinates.at(-1)?.[1]
    ) {
      return { type: "Polygon" as const, coordinates: [coordinates] };
    }
    return { type: "LineString" as const, coordinates };
  }

  if (element.center) {
    return {
      type: "Point" as const,
      coordinates: [element.center.lon, element.center.lat] as [number, number],
    };
  }
  return null;
}

function representativePoint(
  geometry: NonNullable<ReturnType<typeof geometryFor>>,
) {
  if (geometry.type === "Point") return geometry.coordinates;
  const coordinates =
    geometry.type === "Polygon" ? geometry.coordinates[0] : geometry.coordinates;
  if (!coordinates.length) return null;

  if (geometry.type === "Polygon") {
    const uniqueCoordinates = coordinates.slice(
      0,
      coordinates.length > 1 ? -1 : undefined,
    );
    const total = uniqueCoordinates.reduce(
      (sum, coordinate) => [sum[0] + coordinate[0], sum[1] + coordinate[1]],
      [0, 0],
    );
    return [
      total[0] / uniqueCoordinates.length,
      total[1] / uniqueCoordinates.length,
    ] as [number, number];
  }

  return coordinates[Math.floor((coordinates.length - 1) / 2)];
}

function buildQuery(
  bounds: InfrastructureBounds,
  requestedLayers: ReadonlySet<InfrastructureLayerId>,
) {
  const { south, west, north, east } = bounds;
  const latitudeSpan = north - south;
  const longitudeSpan = east - west;
  const isSubstationsOnly =
    requestedLayers.size === 1 && requestedLayers.has("substations");
  const isCoarseSubstationQuery =
    isSubstationsOnly && (latitudeSpan > 2.5 || longitudeSpan > 3.5);
  const bbox = `${south},${west},${north},${east}`;
  const clauses = [
    requestedLayers.has("roads")
      ? `way["highway"~"^(motorway|trunk|primary|secondary)$"](${bbox});`
      : "",
    (["mv", "hv", "ehv", "unknown"] as const).some((layer) =>
      requestedLayers.has(layer),
    )
      ? `way["power"~"^(line|minor_line|cable)$"](${bbox});`
      : "",
    requestedLayers.has("substations")
      ? isCoarseSubstationQuery
        ? `nwr["power"="substation"]["voltage"](${bbox});`
        : `nwr["power"="substation"](${bbox});`
      : "",
  ]
    .filter(Boolean)
    .join("\n  ");

  return {
    isCoarseSubstationQuery,
    query: `[out:json][timeout:15];
(
  ${clauses}
);
${isCoarseSubstationQuery ? "out center qt;" : "out body geom qt;"}`,
  };
}

export async function fetchInfrastructure(
  bounds: InfrastructureBounds,
  requestedLayers: ReadonlySet<InfrastructureLayerId>,
): Promise<InfrastructureFeatureCollection> {
  const retrievedAt = new Date().toISOString();
  if (!requestedLayers.size) {
    return {
      type: "FeatureCollection",
      features: [],
      metadata: {
        source: "OpenStreetMap contributors via Overpass API",
        sourceEndpoint: null,
        sourceTimestamp: null,
        retrievedAt,
        classification:
          "MV 1–<45 kV; HV 45–<220 kV; EHV ≥220 kV; substations with mapped voltage below 20 kV excluded.",
      },
    };
  }

  const { query, isCoarseSubstationQuery } = buildQuery(
    bounds,
    requestedLayers,
  );
  let data: OverpassResponse | null = null;
  let successfulEndpoint: string | null = null;
  const failures: string[] = [];

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "User-Agent": "SolarDev.ai GIS infrastructure screening",
        },
        body: new URLSearchParams({ data: query }),
        cache: "no-store",
        signal: AbortSignal.timeout(18_000),
      });
      if (!response.ok) {
        failures.push(`${new URL(endpoint).hostname}: HTTP ${response.status}`);
        continue;
      }
      data = (await response.json()) as OverpassResponse;
      successfulEndpoint = new URL(endpoint).hostname;
      break;
    } catch (error) {
      failures.push(
        `${new URL(endpoint).hostname}: ${
          error instanceof Error ? error.name : "request failed"
        }`,
      );
    }
  }

  if (!data) {
    throw new InfrastructureSourceError(
      "Live infrastructure sources are busy. Wait a moment and retry.",
      failures,
    );
  }

  const features: InfrastructureFeature[] = [];
  for (const element of data.elements ?? []) {
    const tags = element.tags ?? {};
    const voltage = parseVoltage(tags.voltage);
    if (
      tags.power === "substation" &&
      voltage != null &&
      voltage < MINIMUM_SUBSTATION_VOLTAGE
    ) {
      continue;
    }
    if (isCoarseSubstationQuery) {
      if (!voltage || voltage < 45_000) continue;
    }
    const geometry = geometryFor(element);
    if (!geometry) continue;

    const isRoad = Boolean(tags.highway);
    const kind = isRoad ? "road" : classifyPower(tags);
    const requestedKind =
      kind === "road"
        ? requestedLayers.has("roads")
        : kind === "substation"
          ? requestedLayers.has("substations")
          : kind === "power-unknown"
            ? requestedLayers.has("unknown")
            : requestedLayers.has(kind);
    if (!requestedKind) continue;

    const properties: InfrastructureFeatureProperties = {
      kind,
      osmType: element.type,
      osmId: element.id,
      voltage,
      voltageRaw: tags.voltage ?? null,
      operator: tags.operator ?? null,
      name: tags.name ?? tags.ref ?? null,
      roadClass: tags.highway ?? null,
      powerType: tags.power ?? null,
      location: tags.location ?? null,
      marker: geometry.type === "Point",
    };
    features.push({ type: "Feature", geometry, properties });

    const point = representativePoint(geometry);
    if (point && geometry.type !== "Point") {
      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: point },
        properties: { ...properties, marker: true },
      });
    }
  }

  return {
    type: "FeatureCollection",
    features,
    metadata: {
      source: "OpenStreetMap contributors via Overpass API",
      sourceEndpoint: successfulEndpoint,
      sourceTimestamp: data.osm3s?.timestamp_osm_base ?? null,
      retrievedAt,
      classification:
        "MV 1–<45 kV; HV 45–<220 kV; EHV ≥220 kV; substations with mapped voltage below 20 kV excluded.",
    },
  };
}
