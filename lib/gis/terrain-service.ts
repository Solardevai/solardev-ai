import "server-only";

import type { ConstraintRisk, TerrainAnalysis } from "@/types/gis";

type SamplePoint = {
  longitude: number;
  latitude: number;
};

type ElevatedPoint = SamplePoint & { elevationM: number };

type ElevationResponse = {
  elevation?: Array<number | null>;
  error?: boolean;
  reason?: string;
};

export class TerrainConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TerrainConfigurationError";
  }
}

export class TerrainSourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TerrainSourceError";
  }
}

const GRID_SIZE = 9;
const MAX_LOCATIONS = 100;
const EARTH_RADIUS_M = 6_371_008.8;

function pointInRing(point: SamplePoint, ring: number[][]) {
  let inside = false;
  for (
    let current = 0, previous = ring.length - 1;
    current < ring.length;
    previous = current++
  ) {
    const [currentX, currentY] = ring[current];
    const [previousX, previousY] = ring[previous];
    const crosses =
      currentY > point.latitude !== previousY > point.latitude &&
      point.longitude <
        ((previousX - currentX) * (point.latitude - currentY)) /
          (previousY - currentY) +
          currentX;
    if (crosses) inside = !inside;
  }
  return inside;
}

function sampleSite(site: GeoJSON.Polygon) {
  const ring = site.coordinates[0] ?? [];
  if (ring.length < 4) throw new Error("A valid project polygon is required.");
  const longitudes = ring.map(([longitude]) => longitude);
  const latitudes = ring.map(([, latitude]) => latitude);
  const west = Math.min(...longitudes);
  const east = Math.max(...longitudes);
  const south = Math.min(...latitudes);
  const north = Math.max(...latitudes);
  const points: SamplePoint[] = [];
  const seen = new Set<string>();
  const addPoint = (longitude: number, latitude: number) => {
    const key = `${longitude.toFixed(7)},${latitude.toFixed(7)}`;
    if (seen.has(key) || points.length >= MAX_LOCATIONS) return;
    seen.add(key);
    points.push({ longitude, latitude });
  };

  for (let row = 0; row < GRID_SIZE; row += 1) {
    const latitude = south + ((row + 0.5) / GRID_SIZE) * (north - south);
    for (let column = 0; column < GRID_SIZE; column += 1) {
      const longitude =
        west + ((column + 0.5) / GRID_SIZE) * (east - west);
      const point = { longitude, latitude };
      if (pointInRing(point, ring)) addPoint(longitude, latitude);
    }
  }

  const openRing = ring.slice(
    0,
    ring.length > 1 &&
      ring[0][0] === ring.at(-1)?.[0] &&
      ring[0][1] === ring.at(-1)?.[1]
      ? -1
      : undefined,
  );
  for (const [longitude, latitude] of openRing) {
    addPoint(longitude, latitude);
  }

  if (points.length < 3) {
    throw new Error("The project polygon is too narrow to sample terrain.");
  }
  return points;
}

function elevationApiConfig() {
  const apiKey = process.env.OPEN_METEO_API_KEY?.trim();
  if (apiKey) {
    return {
      endpoint: "https://customer-api.open-meteo.com/v1/elevation",
      apiKey,
    };
  }
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.OPEN_METEO_ALLOW_NONCOMMERCIAL === "true"
  ) {
    return {
      endpoint: "https://api.open-meteo.com/v1/elevation",
      apiKey: null,
    };
  }
  throw new TerrainConfigurationError(
    "Terrain screening requires an Open-Meteo commercial API key.",
  );
}

async function fetchElevations(points: SamplePoint[]) {
  const { endpoint, apiKey } = elevationApiConfig();
  const url = new URL(endpoint);
  url.searchParams.set(
    "latitude",
    points.map((point) => point.latitude.toFixed(7)).join(","),
  );
  url.searchParams.set(
    "longitude",
    points.map((point) => point.longitude.toFixed(7)).join(","),
  );
  if (apiKey) url.searchParams.set("apikey", apiKey);
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
    headers: { "User-Agent": "SolarDev.ai terrain screening" },
  });
  const result = (await response.json()) as ElevationResponse;
  if (!response.ok || result.error) {
    throw new TerrainSourceError(
      result.reason || `The elevation service returned HTTP ${response.status}.`,
    );
  }
  if (!result.elevation || result.elevation.length !== points.length) {
    throw new TerrainSourceError(
      "The elevation service returned an incomplete sample.",
    );
  }
  const elevated = points.flatMap((point, index) => {
    const elevationM = result.elevation?.[index];
    return typeof elevationM === "number" && Number.isFinite(elevationM)
      ? [{ ...point, elevationM }]
      : [];
  });
  if (elevated.length < 3) {
    throw new TerrainSourceError(
      "Too few valid elevation values were returned for slope analysis.",
    );
  }
  return elevated;
}

function radians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceM(first: SamplePoint, second: SamplePoint) {
  const latitudeDelta = radians(second.latitude - first.latitude);
  const longitudeDelta = radians(second.longitude - first.longitude);
  const firstLatitude = radians(first.latitude);
  const secondLatitude = radians(second.latitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function slopeSamples(points: ElevatedPoint[]) {
  const slopes: number[] = [];
  const usedPairs = new Set<string>();
  for (let index = 0; index < points.length; index += 1) {
    let nearestIndex = -1;
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (let candidate = 0; candidate < points.length; candidate += 1) {
      if (candidate === index) continue;
      const distance = distanceM(points[index], points[candidate]);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = candidate;
      }
    }
    if (nearestIndex < 0 || nearestDistance < 1) continue;
    const pair = [index, nearestIndex].sort((first, second) => first - second);
    const pairKey = `${pair[0]}:${pair[1]}`;
    if (usedPairs.has(pairKey)) continue;
    usedPairs.add(pairKey);
    const rise = Math.abs(
      points[index].elevationM - points[nearestIndex].elevationM,
    );
    slopes.push((Math.atan(rise / nearestDistance) * 180) / Math.PI);
  }
  if (!slopes.length) {
    throw new TerrainSourceError("Terrain slope could not be calculated.");
  }
  return slopes.sort((first, second) => first - second);
}

function round(value: number, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function percentile(sortedValues: number[], quantile: number) {
  const index = Math.min(
    sortedValues.length - 1,
    Math.max(0, Math.ceil(sortedValues.length * quantile) - 1),
  );
  return sortedValues[index];
}

function terrainRisk(averageSlope: number, p90Slope: number): ConstraintRisk {
  if (averageSlope > 10 || p90Slope > 15) return "high";
  if (averageSlope > 5 || p90Slope > 8) return "medium";
  return "low";
}

export async function analyzeTerrain(
  projectId: string,
  site: GeoJSON.Polygon,
): Promise<TerrainAnalysis> {
  const points = await fetchElevations(sampleSite(site));
  const elevations = points.map((point) => point.elevationM);
  const slopes = slopeSamples(points);
  const minimumElevationM = Math.min(...elevations);
  const maximumElevationM = Math.max(...elevations);
  const meanElevationM =
    elevations.reduce((sum, elevation) => sum + elevation, 0) /
    elevations.length;
  const averageSlope =
    slopes.reduce((sum, slope) => sum + slope, 0) / slopes.length;
  const p90Slope = percentile(slopes, 0.9);
  const risk = terrainRisk(averageSlope, p90Slope);

  return {
    projectId,
    generatedAt: new Date().toISOString(),
    result: {
      layerId: "terrain-slope",
      label: "Terrain elevation and slope",
      sampleCount: points.length,
      minimumElevationM: round(minimumElevationM),
      maximumElevationM: round(maximumElevationM),
      meanElevationM: round(meanElevationM),
      elevationRangeM: round(maximumElevationM - minimumElevationM),
      averageSlopeDeg: round(averageSlope, 2),
      p90SlopeDeg: round(p90Slope, 2),
      maximumSampledSlopeDeg: round(slopes.at(-1)!, 2),
      risk,
      confidence: "medium",
      recommendedAction:
        risk === "high"
          ? "Treat terrain as a material layout and grading risk. Obtain a higher-resolution terrain model and topographic survey before capacity or earthworks assumptions."
          : risk === "medium"
            ? "Review tracker or fixed-tilt slope limits, preliminary grading and drainage using a higher-resolution terrain model."
            : "Sampled terrain appears comparatively gentle. Confirm local breaks, drainage paths and grading quantities with a higher-resolution terrain model and survey.",
    },
    source: {
      provider: "Open-Meteo Elevation API",
      dataset: "Copernicus DEM",
      resolutionM: 90,
      doi: "10.5270/ESA-c5d3d65",
      retrievedAt: new Date().toISOString(),
      licence: "Copernicus data attribution requirements",
    },
    methodology: {
      sampling: "9 × 9 interior grid plus available boundary vertices",
      slope: "nearest-neighbour elevation gradient",
    },
    limitations: [
      "This is a sampled screening result, not a continuous slope raster or topographic survey.",
      "The source DEM has 90 m resolution and cannot resolve local berms, channels, embankments or abrupt terrain breaks.",
      "Sample spacing depends on the site extent; maximum sampled slope is not the maximum slope everywhere on the site.",
      "Tree canopy, buildings, datum differences and DEM artefacts may affect elevations.",
      "Earthworks, drainage, geotechnical conditions and technology-specific grading limits are not assessed.",
    ],
  };
}
