import "server-only";

import {
  constraintFeature,
  constraintFeatureCollection,
  polygonFromEsriRings,
} from "@/lib/gis/constraint-map";
import type {
  NationallyDesignatedArea,
  NationallyDesignatedAreasAnalysis,
} from "@/types/gis";

type EsriPolygon = {
  rings: number[][][];
  spatialReference?: { wkid: number };
};

type NatDAAttributes = {
  cddaId?: number;
  cddaCountryCode?: string;
  siteName?: string;
  nationalId?: string | null;
  designationTypeCode?: string | null;
  iucnCategory?: string | null;
};

type ArcGisError = { message?: string; details?: string[] };

type NatDAQueryResponse = {
  features?: Array<{ attributes: NatDAAttributes; geometry: EsriPolygon }>;
  exceededTransferLimit?: boolean;
  error?: ArcGisError;
};

type GeometryResponse = {
  geometry?: EsriPolygon;
  geometries?: EsriPolygon[];
  error?: ArcGisError;
};

type AreaResponse = { areas?: number[]; error?: ArcGisError };

export class NationallyDesignatedAreasSourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NationallyDesignatedAreasSourceError";
  }
}

const MAP_SERVICE =
  "https://bio.discomap.eea.europa.eu/arcgis/rest/services/ProtectedSites/NatDAv23_Dyna_WM/MapServer";
const LAYER_ID = 4;
const GEOMETRY_SERVICE =
  "https://bio.discomap.eea.europa.eu/arcgis/rest/services/Utilities/Geometry/GeometryServer";
const METADATA_URL =
  "https://www.eea.europa.eu/en/datahub/datahubitem-view/f60cec02-6494-4d08-b12d-17a37012cb28";

function sourceError(prefix: string, error?: ArcGisError) {
  return new NationallyDesignatedAreasSourceError(
    [prefix, error?.message, ...(error?.details ?? [])]
      .filter(Boolean)
      .join(" "),
  );
}

async function postArcGis<T extends { error?: ArcGisError }>(
  url: string,
  body: URLSearchParams,
  errorPrefix: string,
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "User-Agent": "SolarDev.ai nationally designated areas screening",
    },
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) {
    throw new NationallyDesignatedAreasSourceError(
      `${errorPrefix} HTTP ${response.status}.`,
    );
  }
  const result = (await response.json()) as T;
  if (result.error) throw sourceError(errorPrefix, result.error);
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

async function queryAreas(site: EsriPolygon) {
  const result = await postArcGis<NatDAQueryResponse>(
    `${MAP_SERVICE}/${LAYER_ID}/query`,
    new URLSearchParams({
      where: "1=1",
      geometry: JSON.stringify(site),
      geometryType: "esriGeometryPolygon",
      inSR: "4326",
      spatialRel: "esriSpatialRelIntersects",
      outFields:
        "cddaId,cddaCountryCode,siteName,nationalId,designationTypeCode,iucnCategory",
      returnGeometry: "true",
      outSR: "4326",
      f: "json",
    }),
    "The EEA NatDA query failed.",
  );
  if (result.exceededTransferLimit) {
    throw new NationallyDesignatedAreasSourceError(
      "The EEA NatDA query exceeded its feature limit.",
    );
  }
  return result.features ?? [];
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
    throw new NationallyDesignatedAreasSourceError(
      "The EEA geometry union returned no polygon.",
    );
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
    throw new NationallyDesignatedAreasSourceError(
      "The EEA geodesic area calculation returned an incomplete result.",
    );
  }
  return result.areas.map((area) => Math.abs(area));
}

function optionalText(value?: string | null) {
  return value?.trim() || null;
}

export async function analyzeNationallyDesignatedAreas(
  projectId: string,
  siteGeometry: GeoJSON.Polygon,
): Promise<NationallyDesignatedAreasAnalysis> {
  const retrievedAt = new Date().toISOString();
  const site = projectPolygon(siteGeometry);
  const features = await queryAreas(site);
  const uniqueAreas = new Map<
    number,
    { area: NationallyDesignatedArea; geometry: EsriPolygon }
  >();

  for (const feature of features) {
    const cddaId = feature.attributes.cddaId;
    if (
      typeof cddaId !== "number" ||
      !feature.geometry?.rings?.length ||
      uniqueAreas.has(cddaId)
    ) {
      continue;
    }
    uniqueAreas.set(cddaId, {
      geometry: feature.geometry,
      area: {
        cddaId,
        countryCode: feature.attributes.cddaCountryCode?.trim() || "",
        name:
          feature.attributes.siteName?.trim() ||
          "Unnamed nationally designated area",
        nationalId: optionalText(feature.attributes.nationalId),
        designationTypeCode: optionalText(
          feature.attributes.designationTypeCode,
        ),
        iucnCategory: optionalText(feature.attributes.iucnCategory),
      },
    });
  }

  let affectedAreaSqm = 0;
  let affectedSitePercent = 0;
  let overlapGeometry: EsriPolygon | null = null;
  if (uniqueAreas.size) {
    const union = await unionPolygons(
      [...uniqueAreas.values()].map((value) => value.geometry),
    );
    const intersection = await intersectPolygon(union, site);
    if (intersection?.rings?.length) {
      overlapGeometry = intersection;
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
  const mapGeometry = overlapGeometry
    ? polygonFromEsriRings(overlapGeometry.rings)
    : null;
  return {
    projectId,
    generatedAt: new Date().toISOString(),
    result: {
      layerId: "nationally-designated-areas",
      label: "Nationally designated areas",
      intersects,
      affectedAreaSqm,
      affectedSitePercent,
      risk: intersects ? "high" : "low",
      confidence: intersects ? "high" : "medium",
      sourceDate: "May 2025",
      recommendedAction: intersects
        ? "Treat the mapped overlap as a major development constraint. Confirm the governing national designation, competent authority and applicable consent requirements before land or design commitments."
        : "No intersection was returned by the EEA query service. Check current national and regional registers before relying on this screening result.",
      areas: [...uniqueAreas.values()]
        .map((value) => value.area)
        .sort((first, second) => first.cddaId - second.cddaId),
    },
    mapFeatures: constraintFeatureCollection(
      mapGeometry
        ? [
            constraintFeature(mapGeometry, {
              criterionId: "national-designations",
              label: "National designation",
              featureId: "national-designations-overlap",
              featureName: `${uniqueAreas.size} intersecting designation${uniqueAreas.size === 1 ? "" : "s"}`,
            }),
          ]
        : [],
    ),
    source: {
      provider: "European Environment Agency",
      datasetVersion: "23",
      reportingPeriod: "through May 2025",
      licence: "EEA standard re-use policy",
      serviceUrl: MAP_SERVICE,
      metadataUrl: METADATA_URL,
      retrievedAt,
    },
    limitations: [
      "The queryable EEA map service is NatDA version 23, reported through May 2025; the EEA datahub lists a newer July 2026 downloadable inventory.",
      "Coverage is compiled from 38 reporting countries; the service documents incomplete or unavailable coverage for Estonia, Ireland and Türkiye.",
      "National competent-authority registers and legislation are authoritative.",
      "A non-intersection does not prove that no national, regional or local protection applies.",
      "Mapped boundaries and calculated overlap require confirmation before development commitments.",
    ],
  };
}
