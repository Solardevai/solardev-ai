import "server-only";

import { fetchInfrastructure } from "@/lib/gis/infrastructure-service";
import type { InfrastructureLayerId } from "@/lib/gis/layers";
import {
  analyzeInfrastructureProximity,
  boundsAroundSite,
} from "@/lib/gis/proximity";
import type { InfrastructureAnalysis } from "@/types/gis";

const SEARCH_RADIUS_KM = 15;
const ANALYSIS_LAYERS = new Set<InfrastructureLayerId>([
  "roads",
  "mv",
  "hv",
  "ehv",
  "substations",
  "unknown",
]);

export async function analyzeInfrastructure(
  projectId: string,
  site: GeoJSON.Polygon,
): Promise<InfrastructureAnalysis> {
  const infrastructure = await fetchInfrastructure(
    boundsAroundSite(site, SEARCH_RADIUS_KM),
    ANALYSIS_LAYERS,
  );
  const uniqueAssets = new Set(
    infrastructure.features.map(
      (feature) =>
        `${feature.properties.osmType}:${feature.properties.osmId}`,
    ),
  );
  return {
    projectId,
    generatedAt: new Date().toISOString(),
    searchRadiusKm: SEARCH_RADIUS_KM,
    assetsScanned: uniqueAssets.size,
    results: analyzeInfrastructureProximity(site, infrastructure.features),
    source: {
      provider: infrastructure.metadata.source,
      endpoint: infrastructure.metadata.sourceEndpoint,
      datasetTimestamp: infrastructure.metadata.sourceTimestamp,
      retrievedAt: infrastructure.metadata.retrievedAt,
      licence: "OpenStreetMap data © contributors, ODbL 1.0",
    },
    limitations: [
      "OpenStreetMap coverage and tagging vary by location.",
      "Distances are geospatial screening measurements, not surveyed routes.",
      "Mapped proximity does not establish access rights, grid capacity or connection feasibility.",
      `Assets outside the ${SEARCH_RADIUS_KM} km search radius are not evaluated.`,
    ],
  };
}
