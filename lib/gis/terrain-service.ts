import "server-only";

import sharp from "sharp";
import type { ConstraintRisk, TerrainAnalysis } from "@/types/gis";

type SamplePoint = {
  longitude: number;
  latitude: number;
};

type ElevatedPoint = SamplePoint & { elevationM: number };

export class TerrainSourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TerrainSourceError";
  }
}

const GRID_SIZE = 9;
const MAX_LOCATIONS = 100;
const EARTH_RADIUS_M = 6_371_008.8;
const TERRAIN_TILE_ZOOM = 12;
const TERRAIN_TILE_SIZE = 256;
const MAX_TERRAIN_TILES = 32;
const TERRAIN_TILE_BASE_URL =
  "https://s3.amazonaws.com/elevation-tiles-prod/terrarium";

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

function terrainTileSample(point: SamplePoint) {
  const latitude = Math.max(-85.05112878, Math.min(85.05112878, point.latitude));
  const tilesPerAxis = 2 ** TERRAIN_TILE_ZOOM;
  const xPosition = ((point.longitude + 180) / 360) * tilesPerAxis;
  const latitudeRadians = radians(latitude);
  const yPosition =
    ((1 - Math.asinh(Math.tan(latitudeRadians)) / Math.PI) / 2) *
    tilesPerAxis;
  const tileX = Math.max(0, Math.min(tilesPerAxis - 1, Math.floor(xPosition)));
  const tileY = Math.max(0, Math.min(tilesPerAxis - 1, Math.floor(yPosition)));
  return {
    point,
    key: `${tileX}/${tileY}`,
    tileX,
    tileY,
    pixelX: Math.max(
      0,
      Math.min(TERRAIN_TILE_SIZE - 1, Math.floor((xPosition - tileX) * TERRAIN_TILE_SIZE)),
    ),
    pixelY: Math.max(
      0,
      Math.min(TERRAIN_TILE_SIZE - 1, Math.floor((yPosition - tileY) * TERRAIN_TILE_SIZE)),
    ),
  };
}

async function fetchTerrainTile(tileX: number, tileY: number) {
  const response = await fetch(
    `${TERRAIN_TILE_BASE_URL}/${TERRAIN_TILE_ZOOM}/${tileX}/${tileY}.png`,
    {
      cache: "force-cache",
      signal: AbortSignal.timeout(20_000),
      headers: { "User-Agent": "SolarDev.ai terrain screening" },
    },
  );
  if (!response.ok) {
    throw new TerrainSourceError(
      `The terrain tile service returned HTTP ${response.status}.`,
    );
  }
  const { data, info } = await sharp(Buffer.from(await response.arrayBuffer()))
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (info.width !== TERRAIN_TILE_SIZE || info.height !== TERRAIN_TILE_SIZE) {
    throw new TerrainSourceError("The terrain tile dimensions were unexpected.");
  }
  return { data, channels: info.channels };
}

async function fetchElevations(points: SamplePoint[]) {
  const samples = points.map(terrainTileSample);
  const uniqueTiles = new Map(
    samples.map((sample) => [sample.key, sample] as const),
  );
  if (uniqueTiles.size > MAX_TERRAIN_TILES) {
    throw new TerrainSourceError(
      "The candidate boundary is too extensive for a single terrain screening run.",
    );
  }
  const decodedTiles = new Map<
    string,
    Awaited<ReturnType<typeof fetchTerrainTile>>
  >();
  await Promise.all(
    [...uniqueTiles.entries()].map(async ([key, sample]) => {
      decodedTiles.set(
        key,
        await fetchTerrainTile(sample.tileX, sample.tileY),
      );
    }),
  );

  const elevated = samples.flatMap<ElevatedPoint>((sample) => {
    const tile = decodedTiles.get(sample.key);
    if (!tile || tile.channels < 3) return [];
    const offset =
      (sample.pixelY * TERRAIN_TILE_SIZE + sample.pixelX) * tile.channels;
    const red = tile.data[offset];
    const green = tile.data[offset + 1];
    const blue = tile.data[offset + 2];
    const elevationM = red * 256 + green + blue / 256 - 32768;
    return Number.isFinite(elevationM)
      ? [{ ...sample.point, elevationM }]
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
      provider: "Mapzen Terrain Tiles on AWS",
      dataset: "Global bare-earth Terrain Tiles DEM mosaic",
      resolutionM: 30,
      reference: "AWS Open Data terrain-tiles registry",
      serviceUrl: TERRAIN_TILE_BASE_URL,
      metadataUrl: "https://registry.opendata.aws/terrain-tiles/",
      retrievedAt: new Date().toISOString(),
      licence: "Source-specific open-data attribution requirements",
    },
    methodology: {
      sampling: "9 × 9 interior grid plus available boundary vertices",
      slope: "nearest-neighbour elevation gradient",
    },
    limitations: [
      "This is a sampled screening result, not a continuous slope raster or topographic survey.",
      "The terrain mosaic uses regional best-available sources with approximately 30 m detail in the target European markets; effective resolution and vertical datum can vary by location.",
      "Sample spacing depends on the site extent; maximum sampled slope is not the maximum slope everywhere on the site.",
      "Source mosaicking, datum differences and DEM artefacts may affect elevations.",
      "Europe terrain data includes EU-DEM layers produced using Copernicus data and information funded by the European Union.",
      "Earthworks, drainage, geotechnical conditions and technology-specific grading limits are not assessed.",
    ],
  };
}
