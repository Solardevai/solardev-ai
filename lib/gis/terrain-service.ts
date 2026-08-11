import "server-only";

import area from "@turf/area";
import intersect from "@turf/intersect";
import { featureCollection, polygon } from "@turf/helpers";
import sharp from "sharp";
import type { ConstraintRisk, TerrainAnalysis } from "@/types/gis";

type SamplePoint = {
  longitude: number;
  latitude: number;
};

type GridPoint = SamplePoint & { row: number; column: number };
type ElevatedGridPoint = GridPoint & { elevationM: number };

export class TerrainSourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TerrainSourceError";
  }
}

const GRID_SIZE = 9;
const GRID_NODE_SIZE = GRID_SIZE + 1;
const EARTH_RADIUS_M = 6_371_008.8;
const TERRAIN_TILE_ZOOM = 12;
const TERRAIN_TILE_SIZE = 256;
const MAX_TERRAIN_TILES = 32;
const TERRAIN_TILE_BASE_URL =
  "https://s3.amazonaws.com/elevation-tiles-prod/terrarium";

function sampleTerrainGrid(site: GeoJSON.Polygon) {
  const ring = site.coordinates[0] ?? [];
  if (ring.length < 4) throw new Error("A valid project polygon is required.");
  const longitudes = ring.map(([longitude]) => longitude);
  const latitudes = ring.map(([, latitude]) => latitude);
  const west = Math.min(...longitudes);
  const east = Math.max(...longitudes);
  const south = Math.min(...latitudes);
  const north = Math.max(...latitudes);
  if (west === east || south === north) {
    throw new Error("The project polygon is too narrow to sample terrain.");
  }
  const nodes: GridPoint[] = [];
  for (let row = 0; row < GRID_NODE_SIZE; row += 1) {
    const latitude = south + (row / GRID_SIZE) * (north - south);
    for (let column = 0; column < GRID_NODE_SIZE; column += 1) {
      const longitude = west + (column / GRID_SIZE) * (east - west);
      nodes.push({ longitude, latitude, row, column });
    }
  }
  return nodes;
}

function terrainTileSample(point: GridPoint) {
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

async function fetchElevations(points: GridPoint[]) {
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

  const elevated = samples.flatMap<ElevatedGridPoint>((sample) => {
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

function terrainCells(
  site: GeoJSON.Polygon,
  points: ElevatedGridPoint[],
  northSlopeThresholdDeg: number,
) {
  const pointByCell = new Map(
    points.map((point) => [`${point.row}:${point.column}`, point]),
  );
  const siteFeature = polygon(site.coordinates);
  const slopes: number[] = [];
  const nonUsableFeatures: TerrainAnalysis["nonUsableAreas"]["features"] = [];

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let column = 0; column < GRID_SIZE; column += 1) {
      const southWest = pointByCell.get(`${row}:${column}`);
      const southEast = pointByCell.get(`${row}:${column + 1}`);
      const northWest = pointByCell.get(`${row + 1}:${column}`);
      const northEast = pointByCell.get(`${row + 1}:${column + 1}`);
      if (!southWest || !southEast || !northWest || !northEast) continue;

      const cell = polygon([[
        [southWest.longitude, southWest.latitude],
        [southEast.longitude, southEast.latitude],
        [northEast.longitude, northEast.latitude],
        [northWest.longitude, northWest.latitude],
        [southWest.longitude, southWest.latitude],
      ]]);
      const clipped = intersect(featureCollection([siteFeature, cell]));
      if (!clipped) continue;

      const middleLatitude = (southWest.latitude + northWest.latitude) / 2;
      const middleLongitude = (southWest.longitude + southEast.longitude) / 2;
      const eastWestDistance = distanceM(
        { longitude: southWest.longitude, latitude: middleLatitude },
        { longitude: southEast.longitude, latitude: middleLatitude },
      );
      const northSouthDistance = distanceM(
        { longitude: middleLongitude, latitude: southWest.latitude },
        { longitude: middleLongitude, latitude: northWest.latitude },
      );
      if (eastWestDistance < 1 || northSouthDistance < 1) continue;

      const westElevation = (southWest.elevationM + northWest.elevationM) / 2;
      const eastElevation = (southEast.elevationM + northEast.elevationM) / 2;
      const southElevation = (southWest.elevationM + southEast.elevationM) / 2;
      const northElevation = (northWest.elevationM + northEast.elevationM) / 2;
      const eastGradient = (eastElevation - westElevation) / eastWestDistance;
      const northGradient = (northElevation - southElevation) / northSouthDistance;
      const slopeDeg =
        (Math.atan(Math.hypot(eastGradient, northGradient)) * 180) / Math.PI;
      const aspectDeg =
        ((Math.atan2(-eastGradient, -northGradient) * 180) / Math.PI + 360) %
        360;
      slopes.push(slopeDeg);

      const northFacing = aspectDeg >= 315 || aspectDeg <= 45;
      if (slopeDeg <= northSlopeThresholdDeg || !northFacing) continue;
      const areaSqm = area(clipped);
      nonUsableFeatures.push({
        ...clipped,
        properties: {
          slopeDeg: round(slopeDeg, 2),
          aspectDeg: round(aspectDeg, 1),
          areaSqm: round(areaSqm),
        },
      });
    }
  }

  if (!slopes.length) {
    throw new TerrainSourceError("Terrain slope could not be calculated.");
  }
  return {
    slopes: slopes.sort((first, second) => first - second),
    nonUsableAreas: featureCollection(nonUsableFeatures),
    siteAreaSqm: area(siteFeature),
  };
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

function terrainRisk(
  averageSlope: number,
  p90Slope: number,
  nonUsablePercent: number,
): ConstraintRisk {
  if (averageSlope > 10 || p90Slope > 15 || nonUsablePercent >= 25) {
    return "high";
  }
  if (averageSlope > 5 || p90Slope > 8 || nonUsablePercent > 0) return "medium";
  return "low";
}

export async function analyzeTerrain(
  projectId: string,
  site: GeoJSON.Polygon,
  northSlopeThresholdDeg = 5,
): Promise<TerrainAnalysis> {
  const points = await fetchElevations(sampleTerrainGrid(site));
  const elevations = points.map((point) => point.elevationM);
  const { slopes, nonUsableAreas, siteAreaSqm } = terrainCells(
    site,
    points,
    northSlopeThresholdDeg,
  );
  const nonUsableNorthSlopeAreaSqm = nonUsableAreas.features.reduce(
    (sum, feature) => sum + feature.properties.areaSqm,
    0,
  );
  const nonUsableNorthSlopePercent = siteAreaSqm
    ? (nonUsableNorthSlopeAreaSqm / siteAreaSqm) * 100
    : 0;
  const minimumElevationM = Math.min(...elevations);
  const maximumElevationM = Math.max(...elevations);
  const meanElevationM =
    elevations.reduce((sum, elevation) => sum + elevation, 0) /
    elevations.length;
  const averageSlope =
    slopes.reduce((sum, slope) => sum + slope, 0) / slopes.length;
  const p90Slope = percentile(slopes, 0.9);
  const risk = terrainRisk(
    averageSlope,
    p90Slope,
    nonUsableNorthSlopePercent,
  );

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
      nonUsableNorthSlopeAreaSqm: round(nonUsableNorthSlopeAreaSqm),
      nonUsableNorthSlopePercent: round(nonUsableNorthSlopePercent, 2),
      nonUsableCellCount: nonUsableAreas.features.length,
      northSlopeThresholdDeg,
      risk,
      confidence: "medium",
      recommendedAction:
        nonUsableNorthSlopePercent > 0
          ? `Treat the mapped north-facing cells above ${northSlopeThresholdDeg}° as a preliminary terrain exclusion under the selected assumption (${round(nonUsableNorthSlopePercent, 2)}% of the site). Confirm it with layout-specific limits, a higher-resolution terrain model and topographic survey.`
          : risk === "high"
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
      sampling: "10 × 10 elevation-node grid producing clipped 9 × 9 terrain cells",
      slope: "central cell gradient from corner elevations",
      aspect: "downslope azimuth; north-facing sector 315°–45°",
      nonUsableRule: `slope >${northSlopeThresholdDeg}° and north-facing`,
    },
    nonUsableAreas,
    limitations: [
      "This is a gridded screening result, not a continuous slope raster or topographic survey.",
      "The terrain mosaic uses regional best-available sources with approximately 30 m detail in the target European markets; effective resolution and vertical datum can vary by location.",
      "Cell spacing depends on the site extent; the preliminary terrain mask generalizes each cell from four elevation nodes and may omit local terrain breaks.",
      `The selected preliminary rule uses downslope aspect from 315° through north to 45° and applies where calculated slope is greater than ${northSlopeThresholdDeg}°. This is a user assumption, not a universal constructability limit.`,
      "Source mosaicking, datum differences and DEM artefacts may affect elevations.",
      "Europe terrain data includes EU-DEM layers produced using Copernicus data and information funded by the European Union.",
      "Earthworks, drainage, geotechnical conditions and technology-specific grading limits are not assessed.",
    ],
  };
}
