import "server-only";

import {
  constraintFeature,
  constraintFeatureCollection,
} from "@/lib/gis/constraint-map";
import { fetchInfrastructure } from "@/lib/gis/infrastructure-service";
import type { InfrastructureLayerId } from "@/lib/gis/layers";
import {
  analyzeInfrastructureProximity,
  boundsAroundSite,
  createSiteDistanceCalculator,
} from "@/lib/gis/proximity";
import type { InfrastructureAnalysis, SiteScoreCriterionId } from "@/types/gis";

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
  const distanceFromSite = createSiteDistanceCalculator(site);
  const onSiteAssets = new Map<
    string,
    (typeof infrastructure.features)[number]
  >();
  for (const feature of infrastructure.features) {
    if (distanceFromSite(feature.geometry) > 1) continue;
    const assetKey = `${feature.properties.osmType}:${feature.properties.osmId}`;
    const existing = onSiteAssets.get(assetKey);
    if (!existing || (existing.geometry.type === "Point" && feature.geometry.type !== "Point")) {
      onSiteAssets.set(assetKey, feature);
    }
  }
  const mapFeatures = constraintFeatureCollection(
    [...onSiteAssets.entries()].map(([assetKey, feature]) => {
      const criterionId: SiteScoreCriterionId =
        feature.properties.kind === "road"
          ? "main-road"
          : feature.properties.kind === "substation"
            ? "substation"
            : "transmission-line";
      const label =
        criterionId === "main-road"
          ? "Main road"
          : criterionId === "substation"
            ? "Substation"
            : "Transmission line";
      return constraintFeature(feature.geometry, {
        criterionId,
        label,
        featureId: `OSM:${assetKey}`,
        featureName: feature.properties.name,
      });
    }),
  );
  return {
    projectId,
    generatedAt: new Date().toISOString(),
    searchRadiusKm: SEARCH_RADIUS_KM,
    assetsScanned: uniqueAssets.size,
    results: analyzeInfrastructureProximity(site, infrastructure.features),
    mapFeatures,
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
