import "server-only";

import type { FloodRiskArea, FloodRiskAreaAnalysis } from "@/types/gis";

type ArcGisError = { message?: string; details?: string[] };

type FloodAttributes = {
  OBJECTID?: number;
  cYear?: string | number | null;
  inspireIdLocalId?: string | null;
  thematicIdIdentifier?: string | null;
  nameTextInternational?: string | null;
  nameText?: string | null;
  hazardCategory?: string | null;
  countryCode?: string | null;
};

type FloodQueryResponse = {
  features?: Array<{ attributes: FloodAttributes }>;
  exceededTransferLimit?: boolean;
  error?: ArcGisError;
};

export class FloodRiskSourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FloodRiskSourceError";
  }
}

const MAP_SERVICE =
  "https://water.discomap.eea.europa.eu/arcgis/rest/services/FloodsDirective/Floods2019_RiskZone_WM/MapServer";
const METADATA_URL =
  "https://www.eea.europa.eu/en/datahub/datahubitem-view/9b7b6eb4-ac38-40a8-bb91-7c92da523bc9";
const LAYERS = [
  { id: 0, representation: "point" },
  { id: 1, representation: "line" },
  { id: 2, representation: "polygon" },
] as const;

function sourceError(prefix: string, error?: ArcGisError) {
  return new FloodRiskSourceError(
    [prefix, error?.message, ...(error?.details ?? [])]
      .filter(Boolean)
      .join(" "),
  );
}

function projectPolygon(site: GeoJSON.Polygon) {
  return {
    rings: site.coordinates.map((ring) =>
      ring.map(([longitude, latitude]) => [longitude, latitude]),
    ),
    spatialReference: { wkid: 4326 },
  };
}

async function queryLayer(
  layer: (typeof LAYERS)[number],
  site: ReturnType<typeof projectPolygon>,
) {
  const response = await fetch(`${MAP_SERVICE}/${layer.id}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "User-Agent": "SolarDev.ai Floods Directive screening",
    },
    body: new URLSearchParams({
      where: "1=1",
      geometry: JSON.stringify(site),
      geometryType: "esriGeometryPolygon",
      inSR: "4326",
      spatialRel: "esriSpatialRelIntersects",
      outFields:
        "OBJECTID,cYear,inspireIdLocalId,thematicIdIdentifier,nameTextInternational,nameText,hazardCategory,countryCode",
      returnGeometry: "false",
      f: "json",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(25_000),
  });

  if (!response.ok) {
    throw new FloodRiskSourceError(
      `The EEA Floods Directive query failed with HTTP ${response.status}.`,
    );
  }
  const result = (await response.json()) as FloodQueryResponse;
  if (result.error) {
    throw sourceError("The EEA Floods Directive query failed.", result.error);
  }
  if (result.exceededTransferLimit) {
    throw new FloodRiskSourceError(
      "The EEA Floods Directive query exceeded its feature limit.",
    );
  }
  return (result.features ?? []).map((feature) => ({
    attributes: feature.attributes,
    representation: layer.representation,
  }));
}

function optionalText(value?: string | null) {
  return value?.trim() || null;
}

export async function analyzeFloodRiskAreas(
  projectId: string,
  siteGeometry: GeoJSON.Polygon,
): Promise<FloodRiskAreaAnalysis> {
  const retrievedAt = new Date().toISOString();
  const site = projectPolygon(siteGeometry);
  const layerResults = await Promise.all(
    LAYERS.map((layer) => queryLayer(layer, site)),
  );
  const areas: FloodRiskArea[] = layerResults
    .flat()
    .map(({ attributes, representation }, index) => {
      const officialId =
        optionalText(attributes.thematicIdIdentifier) ||
        optionalText(attributes.inspireIdLocalId) ||
        `${representation}-${attributes.OBJECTID ?? index}`;
      return {
        id: `${representation}:${officialId}`,
        name:
          optionalText(attributes.nameTextInternational) ||
          optionalText(attributes.nameText) ||
          officialId,
        countryCode: optionalText(attributes.countryCode) || "",
        reportingYear:
          attributes.cYear == null ? null : String(attributes.cYear),
        hazardCategory: optionalText(attributes.hazardCategory),
        representation,
      };
    })
    .sort((first, second) => first.id.localeCompare(second.id));

  const intersects = areas.length > 0;
  return {
    projectId,
    generatedAt: new Date().toISOString(),
    result: {
      layerId: "flood-risk-areas",
      label: "Floods Directive risk areas",
      intersects,
      risk: intersects ? "medium" : "low",
      confidence: "medium",
      sourceDate: "2019 reporting service",
      areas,
      recommendedAction: intersects
        ? "The site intersects an area reported by a Member State as having potential significant flood risk. Open the competent national authority's current hazard and risk maps to confirm inundation probability, depth and development controls."
        : "No reporting-area intersection was returned. This does not exclude flood hazard; check the competent national authority's current river, coastal and surface-water maps.",
    },
    source: {
      provider: "European Environment Agency",
      serviceDataset: "2019 reporting service",
      latestReferenceDataset: "version 3.0, March 2025",
      licence: "EEA standard re-use policy",
      serviceUrl: MAP_SERVICE,
      metadataUrl: METADATA_URL,
      retrievedAt,
    },
    limitations: [
      "This dataset maps Areas of Potential Significant Flood Risk reported under the Floods Directive; it is not an inundation footprint or flood-depth map.",
      "The operational query endpoint is the 2019 reporting service. The EEA datahub lists reference dataset version 3.0 from March 2025, but its current ArcGIS service was unavailable during integration.",
      "Point, line and polygon representations vary by Member State, so an overlap percentage would be misleading and is not calculated.",
      "National competent-authority flood hazard and risk maps are authoritative for development decisions.",
      "A non-intersection does not screen pluvial flooding, small catchments, drainage conditions or climate-change allowances.",
    ],
  };
}
