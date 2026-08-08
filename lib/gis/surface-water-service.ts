import "server-only";

import {
  constraintFeature,
  constraintFeatureCollection,
} from "@/lib/gis/constraint-map";
import { boundsAroundSite, createSiteDistanceCalculator } from "@/lib/gis/proximity";
import type {
  ProximityClassification,
  SurfaceWaterAnalysis,
  SurfaceWaterCategory,
  SurfaceWaterProximityResult,
} from "@/types/gis";

type OverpassPoint = { lat: number; lon: number };
type OverpassTags = Record<string, string>;
type OverpassElement = {
  type: "way" | "relation";
  id: number;
  geometry?: OverpassPoint[];
  members?: Array<{ role?: string; geometry?: OverpassPoint[] }>;
  tags?: OverpassTags;
};

type OverpassResponse = {
  osm3s?: { timestamp_osm_base?: string };
  elements?: OverpassElement[];
};

type SurfaceWaterFeature = {
  geometry: GeoJSON.LineString | GeoJSON.Polygon;
  properties: {
    category: SurfaceWaterCategory;
    osmType: OverpassElement["type"];
    osmId: number;
    name: string | null;
    waterType: string;
    intermittent: boolean | null;
  };
};

export class SurfaceWaterSourceError extends Error {
  readonly failures: string[];

  constructor(message: string, failures: string[]) {
    super(message);
    this.name = "SurfaceWaterSourceError";
    this.failures = failures;
  }
}

const SEARCH_RADIUS_KM = 5;
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

function categoryFor(tags: OverpassTags): SurfaceWaterCategory {
  if (tags.natural === "wetland") return "wetland";
  if (tags.waterway && tags.waterway !== "riverbank") return "watercourse";
  return "standing-water";
}

function waterTypeFor(tags: OverpassTags) {
  return (
    tags.waterway ||
    tags.water ||
    (tags.landuse === "reservoir" ? "reservoir" : null) ||
    tags.wetland ||
    tags.natural ||
    "water"
  );
}

function intermittentValue(value?: string) {
  if (!value) return null;
  if (["yes", "seasonal"].includes(value)) return true;
  if (value === "no") return false;
  return null;
}

function coordinates(points: OverpassPoint[]) {
  return points.map((point) => [point.lon, point.lat] as [number, number]);
}

function geometryFromPoints(
  points: OverpassPoint[],
  category: SurfaceWaterCategory,
) {
  const line = coordinates(points);
  if (line.length < 2) return null;
  const first = line[0];
  const last = line.at(-1)!;
  const closed =
    line.length >= 4 && first[0] === last[0] && first[1] === last[1];
  if (closed && category !== "watercourse") {
    return { type: "Polygon" as const, coordinates: [line] };
  }
  return { type: "LineString" as const, coordinates: line };
}

function featuresForElement(element: OverpassElement) {
  const tags = element.tags ?? {};
  const category = categoryFor(tags);
  const properties: SurfaceWaterFeature["properties"] = {
    category,
    osmType: element.type,
    osmId: element.id,
    name: tags.name ?? tags.ref ?? null,
    waterType: waterTypeFor(tags),
    intermittent: intermittentValue(tags.intermittent ?? tags.seasonal),
  };
  const pointSets = element.geometry?.length
    ? [element.geometry]
    : (element.members ?? [])
        .filter((member) => member.role !== "inner" && member.geometry?.length)
        .map((member) => member.geometry!);
  return pointSets.flatMap((points) => {
    const geometry = geometryFromPoints(points, category);
    return geometry ? [{ geometry, properties }] : [];
  });
}

function buildQuery(site: GeoJSON.Polygon) {
  const { south, west, north, east } = boundsAroundSite(
    site,
    SEARCH_RADIUS_KM,
  );
  const bbox = `${south},${west},${north},${east}`;
  return `[out:json][timeout:20];
(
  way["waterway"~"^(river|stream|canal|drain|ditch)$"](${bbox});
  relation["waterway"~"^(river|stream|canal|drain|ditch)$"](${bbox});
  way["natural"="water"](${bbox});
  relation["natural"="water"](${bbox});
  way["natural"="wetland"](${bbox});
  relation["natural"="wetland"](${bbox});
  way["water"~"^(lake|reservoir|pond|basin)$"](${bbox});
  relation["water"~"^(lake|reservoir|pond|basin)$"](${bbox});
  way["landuse"="reservoir"](${bbox});
  relation["landuse"="reservoir"](${bbox});
);
out body geom qt;`;
}

async function fetchSurfaceWater(site: GeoJSON.Polygon) {
  const retrievedAt = new Date().toISOString();
  const failures: string[] = [];
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "User-Agent": "SolarDev.ai surface water screening",
        },
        body: new URLSearchParams({ data: buildQuery(site) }),
        cache: "no-store",
        signal: AbortSignal.timeout(25_000),
      });
      if (!response.ok) {
        failures.push(`${new URL(endpoint).hostname}: HTTP ${response.status}`);
        continue;
      }
      const data = (await response.json()) as OverpassResponse;
      return {
        features: (data.elements ?? []).flatMap(featuresForElement),
        endpoint: new URL(endpoint).hostname,
        datasetTimestamp: data.osm3s?.timestamp_osm_base ?? null,
        retrievedAt,
      };
    } catch (error) {
      failures.push(
        `${new URL(endpoint).hostname}: ${
          error instanceof Error ? error.name : "request failed"
        }`,
      );
    }
  }
  throw new SurfaceWaterSourceError(
    "Live surface-water sources are busy. Wait a moment and retry.",
    failures,
  );
}

function classify(distanceM: number | null): ProximityClassification {
  if (distanceM === null) return "not-found";
  if (distanceM <= 1) return "on-site";
  if (distanceM <= 100) return "near";
  if (distanceM <= 500) return "moderate";
  return "remote";
}

function recommendation(
  category: SurfaceWaterCategory,
  classification: ProximityClassification,
) {
  if (classification === "not-found") {
    return "No mapped feature was found within 5 km. Check authoritative hydrography, drainage and wetland datasets.";
  }
  if (classification === "on-site") {
    return category === "wetland"
      ? "Treat the mapped wetland intersection as a material constraint and confirm its boundary, legal status, buffers and seasonal extent with the competent authority."
      : "Confirm the feature boundary, ordinary high-water extent, required buffers, crossing constraints and drainage implications before layout development.";
  }
  return "Confirm the mapped feature and applicable buffers using authoritative local data and a site survey; OSM proximity alone does not establish a regulatory setback.";
}

function nearestResult(
  category: SurfaceWaterCategory,
  label: string,
  features: SurfaceWaterFeature[],
  distanceFromSite: ReturnType<typeof createSiteDistanceCalculator>,
): SurfaceWaterProximityResult {
  const nearestByAsset = new Map<
    string,
    { distanceM: number; properties: SurfaceWaterFeature["properties"] }
  >();
  for (const feature of features) {
    if (feature.properties.category !== category) continue;
    const assetKey = `${feature.properties.osmType}:${feature.properties.osmId}`;
    const distanceM = distanceFromSite(feature.geometry);
    const existing = nearestByAsset.get(assetKey);
    if (!existing || distanceM < existing.distanceM) {
      nearestByAsset.set(assetKey, { distanceM, properties: feature.properties });
    }
  }
  const nearest = [...nearestByAsset.values()].reduce<
    { distanceM: number; properties: SurfaceWaterFeature["properties"] } | null
  >(
    (current, candidate) =>
      !current || candidate.distanceM < current.distanceM ? candidate : current,
    null,
  );
  const distanceM = nearest ? Math.round(nearest.distanceM) : null;
  const classification = classify(distanceM);
  return {
    id: category,
    label,
    distanceM,
    classification,
    risk:
      classification === "on-site"
        ? "high"
        : classification === "near" || classification === "moderate"
          ? "medium"
          : "low",
    feature: nearest ? nearest.properties : null,
    recommendedAction: recommendation(category, classification),
  };
}

export async function analyzeSurfaceWater(
  projectId: string,
  site: GeoJSON.Polygon,
): Promise<SurfaceWaterAnalysis> {
  const data = await fetchSurfaceWater(site);
  const distanceFromSite = createSiteDistanceCalculator(site);
  const uniqueFeatures = new Set(
    data.features.map(
      (feature) => `${feature.properties.osmType}:${feature.properties.osmId}`,
    ),
  );
  const mapFeatures = constraintFeatureCollection(
    data.features.flatMap((feature, index) => {
      if (distanceFromSite(feature.geometry) > 1) return [];
      return [
        constraintFeature(feature.geometry, {
          criterionId: "surface-water",
          label: "Surface water / wetland",
          featureId: `OSM:${feature.properties.osmType}/${feature.properties.osmId}:${index}`,
          featureName: feature.properties.name,
        }),
      ];
    }),
  );
  return {
    projectId,
    generatedAt: new Date().toISOString(),
    searchRadiusKm: SEARCH_RADIUS_KM,
    featuresScanned: uniqueFeatures.size,
    results: [
      nearestResult(
        "watercourse",
        "Nearest watercourse",
        data.features,
        distanceFromSite,
      ),
      nearestResult(
        "standing-water",
        "Nearest lake or reservoir",
        data.features,
        distanceFromSite,
      ),
      nearestResult(
        "wetland",
        "Nearest mapped wetland",
        data.features,
        distanceFromSite,
      ),
    ],
    mapFeatures,
    source: {
      provider: "OpenStreetMap contributors via Overpass API",
      endpoint: data.endpoint,
      datasetTimestamp: data.datasetTimestamp,
      retrievedAt: data.retrievedAt,
      licence: "Open Database License (ODbL) 1.0",
    },
    limitations: [
      "OpenStreetMap hydrography and wetland coverage, geometry and tagging vary by location.",
      "Mapped features may be intermittent, culverted, artificial, seasonally larger or absent from OpenStreetMap.",
      "Distances are screening measurements from the project boundary, not surveyed setbacks.",
      "This does not assess flood probability, drainage capacity, groundwater, water quality or legal buffers.",
      `Features outside the ${SEARCH_RADIUS_KM} km search radius are not evaluated.`,
    ],
  };
}
