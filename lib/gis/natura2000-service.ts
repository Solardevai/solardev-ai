import "server-only";

import type {
  Natura2000ConstraintAnalysis,
  Natura2000Site,
} from "@/types/gis";

type EsriPolygon = {
  rings: number[][][];
  spatialReference?: { wkid: number };
};

type NaturaAttributes = {
  SITECODE?: string;
  SITENAME?: string;
  RELEASE_DATE?: number | string | null;
  MS?: string;
  SITETYPE?: string;
};

type NaturaQueryResponse = {
  features?: Array<{
    attributes: NaturaAttributes;
    geometry: EsriPolygon;
  }>;
  exceededTransferLimit?: boolean;
  error?: { message?: string; details?: string[] };
};

type GeometryResponse = {
  geometryType?: string;
  geometry?: EsriPolygon;
  geometries?: EsriPolygon[];
  error?: { message?: string; details?: string[] };
};

type AreaResponse = {
  areas?: number[];
  lengths?: number[];
  error?: { message?: string; details?: string[] };
};

export class Natura2000SourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Natura2000SourceError";
  }
}

const MAP_SERVICE =
  "https://bio.discomap.eea.europa.eu/arcgis/rest/services/ProtectedSites/Natura2000Sites/MapServer";
const GEOMETRY_SERVICE =
  "https://bio.discomap.eea.europa.eu/arcgis/rest/services/Utilities/Geometry/GeometryServer";
const METADATA_URL =
  "https://www.eea.europa.eu/data-and-maps/data/natura-12";
const LAYER_IDS = [0, 1, 2] as const;

function requestError(
  prefix: string,
  error?: { message?: string; details?: string[] },
) {
  return new Natura2000SourceError(
    [prefix, error?.message, ...(error?.details ?? [])]
      .filter(Boolean)
      .join(" "),
  );
}

async function postArcGis<T extends { error?: { message?: string; details?: string[] } }>(
  url: string,
  body: URLSearchParams,
  errorPrefix: string,
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "User-Agent": "SolarDev.ai Natura 2000 constraint screening",
    },
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) {
    throw new Natura2000SourceError(`${errorPrefix} HTTP ${response.status}.`);
  }
  const result = (await response.json()) as T;
  if (result.error) throw requestError(errorPrefix, result.error);
  return result;
}

function projectPolygon(site: GeoJSON.Polygon): EsriPolygon {
  return {
    rings: site.coordinates.map((ring) =>
      ring.map(([longitude, latitude]) => [longitude, latitude]),
    ),
    spatialReference: { wkid: 4326 },
  };
}

async function queryLayer(layerId: (typeof LAYER_IDS)[number], site: EsriPolygon) {
  const body = new URLSearchParams({
    where: "1=1",
    geometry: JSON.stringify(site),
    geometryType: "esriGeometryPolygon",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "SITECODE,SITENAME,RELEASE_DATE,MS,SITETYPE",
    returnGeometry: "true",
    outSR: "4326",
    f: "json",
  });
  const result = await postArcGis<NaturaQueryResponse>(
    `${MAP_SERVICE}/${layerId}/query`,
    body,
    "The EEA Natura 2000 query failed.",
  );
  if (result.exceededTransferLimit) {
    throw new Natura2000SourceError(
      "The EEA Natura 2000 query exceeded its feature limit.",
    );
  }
  return result.features ?? [];
}

function releaseDate(value: NaturaAttributes["RELEASE_DATE"]) {
  if (value == null) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function designation(siteType?: string): Natura2000Site["designation"] {
  if (siteType === "A") return "Birds";
  if (siteType === "B") return "Habitats";
  return "Habitats and Birds";
}

async function unionPolygons(polygons: EsriPolygon[]) {
  if (polygons.length === 1) return polygons[0];
  const result = await postArcGis<GeometryResponse>(
    `${GEOMETRY_SERVICE}/union`,
    new URLSearchParams({
      sr: "4326",
      geometries: JSON.stringify({
        geometryType: "esriGeometryPolygon",
        geometries: polygons,
      }),
      f: "json",
    }),
    "The EEA geometry union failed.",
  );
  if (!result.geometry) {
    throw new Natura2000SourceError("The EEA geometry union returned no polygon.");
  }
  return result.geometry;
}

async function intersectPolygon(constraint: EsriPolygon, site: EsriPolygon) {
  const result = await postArcGis<GeometryResponse>(
    `${GEOMETRY_SERVICE}/intersect`,
    new URLSearchParams({
      sr: "4326",
      geometries: JSON.stringify({
        geometryType: "esriGeometryPolygon",
        geometries: [constraint],
      }),
      geometry: JSON.stringify({
        geometryType: "esriGeometryPolygon",
        geometry: site,
      }),
      f: "json",
    }),
    "The EEA geometry intersection failed.",
  );
  return result.geometries?.[0] ?? null;
}

async function geodesicAreas(polygons: EsriPolygon[]) {
  const result = await postArcGis<AreaResponse>(
    `${GEOMETRY_SERVICE}/areasAndLengths`,
    new URLSearchParams({
      sr: "4326",
      polygons: JSON.stringify(polygons),
      areaUnit: JSON.stringify({ areaUnit: "esriSquareMeters" }),
      calculationType: "geodesic",
      f: "json",
    }),
    "The EEA geodesic area calculation failed.",
  );
  if (!result.areas || result.areas.length !== polygons.length) {
    throw new Natura2000SourceError(
      "The EEA geodesic area calculation returned an incomplete result.",
    );
  }
  return result.areas.map((area) => Math.abs(area));
}

export async function analyzeNatura2000(
  projectId: string,
  siteGeometry: GeoJSON.Polygon,
): Promise<Natura2000ConstraintAnalysis> {
  const retrievedAt = new Date().toISOString();
  const site = projectPolygon(siteGeometry);
  const layerResults = await Promise.all(
    LAYER_IDS.map((layerId) => queryLayer(layerId, site)),
  );
  const uniqueSites = new Map<
    string,
    { site: Natura2000Site; geometry: EsriPolygon }
  >();
  for (const feature of layerResults.flat()) {
    const code = feature.attributes.SITECODE?.trim();
    if (!code || !feature.geometry?.rings?.length || uniqueSites.has(code)) {
      continue;
    }
    uniqueSites.set(code, {
      geometry: feature.geometry,
      site: {
        code,
        name: feature.attributes.SITENAME?.trim() || "Unnamed Natura 2000 site",
        designation: designation(feature.attributes.SITETYPE),
        memberState: feature.attributes.MS?.trim() || "",
        releaseDate: releaseDate(feature.attributes.RELEASE_DATE),
      },
    });
  }

  let affectedAreaSqm = 0;
  let affectedSitePercent = 0;
  if (uniqueSites.size) {
    const union = await unionPolygons(
      [...uniqueSites.values()].map((value) => value.geometry),
    );
    const intersection = await intersectPolygon(union, site);
    if (intersection?.rings?.length) {
      const [intersectionArea, siteArea] = await geodesicAreas([
        intersection,
        site,
      ]);
      affectedAreaSqm = Math.round(intersectionArea);
      affectedSitePercent = siteArea
        ? Math.min(100, (intersectionArea / siteArea) * 100)
        : 0;
    }
  }

  const intersects = affectedAreaSqm > 0;
  return {
    projectId,
    generatedAt: new Date().toISOString(),
    result: {
      layerId: "natura-2000",
      label: "Natura 2000",
      intersects,
      affectedAreaSqm,
      affectedSitePercent,
      risk: intersects ? "high" : "low",
      confidence: intersects ? "high" : "medium",
      sourceDate: "2024",
      recommendedAction: intersects
        ? "Treat the mapped overlap as a major development constraint. Confirm the competent authority, designation objectives and appropriate-assessment requirements before land or design commitments."
        : "No intersection was returned by the EU dataset. Confirm national and regional protected-area datasets before relying on this screening result.",
      sites: [...uniqueSites.values()]
        .map((value) => value.site)
        .sort((first, second) => first.code.localeCompare(second.code)),
    },
    source: {
      provider: "European Environment Agency",
      datasetVersion: "2024",
      copyright: "EEA, Copenhagen, 2025",
      licence: "CC BY 4.0",
      serviceUrl: MAP_SERVICE,
      metadataUrl: METADATA_URL,
      retrievedAt,
    },
    limitations: [
      "Coverage is limited to the Natura 2000 network reported by EU Member States.",
      "Member-State competent-authority data is authoritative; EEA states that no legal claims should be derived from this display service.",
      "A non-intersection does not screen nationally or regionally designated protected areas.",
      "Mapped boundaries and calculated overlap require confirmation before development commitments.",
    ],
  };
}
