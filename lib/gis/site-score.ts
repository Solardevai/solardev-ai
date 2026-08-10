import "server-only";

import { analyzeFloodRiskAreas } from "@/lib/gis/flood-risk-service";
import { analyzeInfrastructure } from "@/lib/gis/infrastructure-analysis";
import { analyzeNationallyDesignatedAreas } from "@/lib/gis/nationally-designated-areas-service";
import { analyzeNatura2000 } from "@/lib/gis/natura2000-service";
import { analyzeSurfaceWater } from "@/lib/gis/surface-water-service";
import { analyzeTerrain } from "@/lib/gis/terrain-service";
import { terrainConstraintMapFeatures } from "@/lib/gis/terrain-constraint-map";
import type {
  ConstraintMapFeatureCollection,
  FloodRiskAreaAnalysis,
  ConstraintRegisterFeature,
  ConstraintRegisterRow,
  InfrastructureAnalysis,
  NationallyDesignatedAreasAnalysis,
  Natura2000ConstraintAnalysis,
  PreliminarySiteScore,
  ProximityClassification,
  SiteScoreCriterion,
  SiteScoreCriterionId,
  SiteScoreSource,
  SurfaceWaterAnalysis,
  TerrainAnalysis,
} from "@/types/gis";

type CriterionBase = Pick<
  SiteScoreCriterion,
  "id" | "label" | "group" | "weight"
>;

const SOURCE_DEADLINE_MS = 35_000;

async function withinSourceDeadline<T>(promise: Promise<T>) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error("Analysis source deadline exceeded.")),
      SOURCE_DEADLINE_MS,
    );
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

const CRITERIA: Record<SiteScoreCriterionId, CriterionBase> = {
  "natura-2000": {
    id: "natura-2000",
    label: "Natura 2000",
    group: "environment",
    weight: 15,
  },
  "national-designations": {
    id: "national-designations",
    label: "National designations",
    group: "environment",
    weight: 15,
  },
  "flood-risk-areas": {
    id: "flood-risk-areas",
    label: "Flood risk reporting areas",
    group: "water",
    weight: 10,
  },
  "surface-water": {
    id: "surface-water",
    label: "Surface water and wetlands",
    group: "water",
    weight: 15,
  },
  "main-road": {
    id: "main-road",
    label: "Main-road proximity",
    group: "infrastructure",
    weight: 10,
  },
  "transmission-line": {
    id: "transmission-line",
    label: "Transmission-line proximity",
    group: "infrastructure",
    weight: 10,
  },
  substation: {
    id: "substation",
    label: "Substation proximity",
    group: "infrastructure",
    weight: 10,
  },
  terrain: {
    id: "terrain",
    label: "Terrain slope",
    group: "terrain",
    weight: 15,
  },
};

function round(value: number, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function criterion(
  id: SiteScoreCriterionId,
  score: number,
  evidence: string,
): SiteScoreCriterion {
  const base = CRITERIA[id];
  const boundedScore = Math.max(0, Math.min(100, score));
  return {
    ...base,
    score: boundedScore,
    deductionPoints: round(base.weight * (1 - boundedScore / 100)),
    status:
      boundedScore >= 80
        ? "favourable"
        : boundedScore >= 50
          ? "caution"
          : "constraint",
    evidence,
  };
}

function unavailable(
  id: SiteScoreCriterionId,
  evidence = "Source unavailable during this run.",
): SiteScoreCriterion {
  return {
    ...CRITERIA[id],
    score: null,
    deductionPoints: null,
    status: "unavailable",
    evidence,
  };
}

function overlapScore(percent: number, minorScore: number) {
  if (percent <= 0) return 100;
  if (percent <= 1) return minorScore;
  if (percent <= 10) return 15;
  return 0;
}

function naturaCriterion(analysis: Natura2000ConstraintAnalysis) {
  const { affectedSitePercent, sites } = analysis.result;
  return criterion(
    "natura-2000",
    overlapScore(affectedSitePercent, 40),
    affectedSitePercent > 0
      ? `${affectedSitePercent.toFixed(2)}% of the site overlaps ${sites.length} Natura 2000 designation${sites.length === 1 ? "" : "s"}.`
      : "No mapped Natura 2000 intersection was returned.",
  );
}

function nationalCriterion(analysis: NationallyDesignatedAreasAnalysis) {
  const { affectedSitePercent, areas } = analysis.result;
  return criterion(
    "national-designations",
    overlapScore(affectedSitePercent, 50),
    affectedSitePercent > 0
      ? `${affectedSitePercent.toFixed(2)}% of the site overlaps ${areas.length} national designation${areas.length === 1 ? "" : "s"}.`
      : "No mapped national-designation intersection was returned.",
  );
}

function floodCriterion(analysis: FloodRiskAreaAnalysis) {
  return criterion(
    "flood-risk-areas",
    analysis.result.intersects ? 25 : 100,
    analysis.result.intersects
      ? `${analysis.result.areas.length} Floods Directive reporting-area ${analysis.result.areas.length === 1 ? "feature intersects" : "features intersect"} the site.`
      : "No Floods Directive reporting-area intersection was returned.",
  );
}

const proximityRank: Record<ProximityClassification, number> = {
  "on-site": 0,
  near: 1,
  moderate: 2,
  remote: 3,
  "not-found": 4,
};

function waterCriterion(analysis: SurfaceWaterAnalysis) {
  const worst = [...analysis.results].sort(
    (first, second) =>
      proximityRank[first.classification] - proximityRank[second.classification],
  )[0];
  const scoreByClassification: Record<ProximityClassification, number> = {
    "on-site": 0,
    near: 50,
    moderate: 75,
    remote: 100,
    "not-found": 100,
  };
  const onSite = analysis.results.filter(
    (result) => result.classification === "on-site",
  );
  return criterion(
    "surface-water",
    scoreByClassification[worst.classification],
    onSite.length
      ? `${onSite.length} mapped surface-water ${onSite.length === 1 ? "category intersects" : "categories intersect"} the site.`
      : worst.distanceM == null
        ? "No mapped surface-water feature was found within the search radius."
        : `Nearest mapped ${worst.label.toLowerCase()} is ${worst.distanceM.toLocaleString()} m from the boundary.`,
  );
}

function infrastructureScore(
  id: "main-road" | "transmission-line" | "substation",
  classification: ProximityClassification,
) {
  const scores = {
    "main-road": {
      "on-site": 50,
      near: 100,
      moderate: 75,
      remote: 40,
      "not-found": 20,
    },
    "transmission-line": {
      "on-site": 60,
      near: 100,
      moderate: 75,
      remote: 40,
      "not-found": 20,
    },
    substation: {
      "on-site": 70,
      near: 100,
      moderate: 80,
      remote: 50,
      "not-found": 25,
    },
  } as const;
  return scores[id][classification];
}

function infrastructureCriteria(analysis: InfrastructureAnalysis) {
  return analysis.results.map((result) =>
    criterion(
      result.id,
      infrastructureScore(result.id, result.classification),
      result.distanceM == null
        ? `No mapped ${result.label.toLowerCase()} was found within ${analysis.searchRadiusKm} km.`
        : result.distanceM <= 1
          ? `${result.label} intersects the site.`
          : `${result.label} is ${result.distanceM.toLocaleString()} m from the boundary.`,
    ),
  );
}

function terrainCriterion(analysis: TerrainAnalysis) {
  const score =
    analysis.result.risk === "low"
      ? 100
      : analysis.result.risk === "medium"
        ? 60
        : 20;
  return criterion(
    "terrain",
    score,
    `${analysis.result.averageSlopeDeg.toFixed(2)}° average and ${analysis.result.p90SlopeDeg.toFixed(2)}° 90th-percentile sampled slope; ${analysis.result.nonUsableNorthSlopePercent.toFixed(2)}% classified non-usable because it is north-facing above 5°.`,
  );
}

function sourceFailure(id: string, label: string, reason: string) {
  return { id, label, reason };
}

function sourceRegister(
  infrastructure: PromiseSettledResult<InfrastructureAnalysis>,
  natura: PromiseSettledResult<Natura2000ConstraintAnalysis>,
  national: PromiseSettledResult<NationallyDesignatedAreasAnalysis>,
  flood: PromiseSettledResult<FloodRiskAreaAnalysis>,
  surfaceWater: PromiseSettledResult<SurfaceWaterAnalysis>,
  terrain: PromiseSettledResult<TerrainAnalysis>,
) {
  const sources: SiteScoreSource[] = [];

  if (natura.status === "fulfilled") {
    sources.push({
      id: "natura-2000",
      label: "Natura 2000",
      provider: natura.value.source.provider,
      dataset: "Natura 2000 spatial dataset",
      version: natura.value.source.datasetVersion,
      licence: natura.value.source.licence,
      retrievedAt: natura.value.source.retrievedAt,
      serviceUrl: natura.value.source.serviceUrl,
      metadataUrl: natura.value.source.metadataUrl,
      limitations: natura.value.limitations,
    });
  }

  if (national.status === "fulfilled") {
    sources.push({
      id: "national-designations",
      label: "Nationally designated areas",
      provider: national.value.source.provider,
      dataset: `Nationally designated areas (${national.value.source.reportingPeriod})`,
      version: national.value.source.datasetVersion,
      licence: national.value.source.licence,
      retrievedAt: national.value.source.retrievedAt,
      serviceUrl: national.value.source.serviceUrl,
      metadataUrl: national.value.source.metadataUrl,
      limitations: national.value.limitations,
    });
  }

  if (flood.status === "fulfilled") {
    sources.push({
      id: "flood-risk-areas",
      label: "Floods Directive reporting areas",
      provider: flood.value.source.provider,
      dataset: flood.value.source.serviceDataset,
      version: flood.value.source.latestReferenceDataset,
      licence: flood.value.source.licence,
      retrievedAt: flood.value.source.retrievedAt,
      serviceUrl: flood.value.source.serviceUrl,
      metadataUrl: flood.value.source.metadataUrl,
      limitations: flood.value.limitations,
    });
  }

  if (surfaceWater.status === "fulfilled") {
    sources.push({
      id: "surface-water",
      label: "Surface water and wetlands",
      provider: surfaceWater.value.source.provider,
      dataset: "Live OpenStreetMap extract",
      version: surfaceWater.value.source.datasetTimestamp,
      licence: surfaceWater.value.source.licence,
      retrievedAt: surfaceWater.value.source.retrievedAt,
      serviceUrl: surfaceWater.value.source.endpoint,
      metadataUrl: "https://www.openstreetmap.org/copyright",
      limitations: surfaceWater.value.limitations,
    });
  }

  if (infrastructure.status === "fulfilled") {
    sources.push({
      id: "infrastructure",
      label: "Road, grid and substation proximity",
      provider: infrastructure.value.source.provider,
      dataset: "Live OpenStreetMap infrastructure extract",
      version: infrastructure.value.source.datasetTimestamp,
      licence: infrastructure.value.source.licence,
      retrievedAt: infrastructure.value.source.retrievedAt,
      serviceUrl: infrastructure.value.source.endpoint,
      metadataUrl: "https://www.openstreetmap.org/copyright",
      limitations: infrastructure.value.limitations,
    });
  }

  if (terrain.status === "fulfilled") {
    sources.push({
      id: "terrain",
      label: "Terrain elevation and slope",
      provider: terrain.value.source.provider,
      dataset: `${terrain.value.source.dataset} (${terrain.value.source.resolutionM} m)`,
      version: terrain.value.source.reference,
      licence: terrain.value.source.licence,
      retrievedAt: terrain.value.source.retrievedAt,
      serviceUrl: terrain.value.source.serviceUrl,
      metadataUrl: terrain.value.source.metadataUrl,
      limitations: terrain.value.limitations,
    });
  }

  return sources;
}

function registerSourceId(id: SiteScoreCriterionId) {
  return id === "main-road" || id === "transmission-line" || id === "substation"
    ? "infrastructure"
    : id;
}

function uniqueActions(actions: Array<string | null | undefined>) {
  return [...new Set(actions.filter((action): action is string => Boolean(action)))];
}

function constraintRegister(
  criteria: SiteScoreCriterion[],
  sources: SiteScoreSource[],
  infrastructure: PromiseSettledResult<InfrastructureAnalysis>,
  natura: PromiseSettledResult<Natura2000ConstraintAnalysis>,
  national: PromiseSettledResult<NationallyDesignatedAreasAnalysis>,
  flood: PromiseSettledResult<FloodRiskAreaAnalysis>,
  surfaceWater: PromiseSettledResult<SurfaceWaterAnalysis>,
  terrain: PromiseSettledResult<TerrainAnalysis>,
) {
  const criterionById = new Map(criteria.map((item) => [item.id, item]));
  const sourceById = new Map(sources.map((source) => [source.id, source]));

  function row(
    id: SiteScoreCriterionId,
    details: Partial<
      Pick<
        ConstraintRegisterRow,
        | "intersects"
        | "affectedAreaSqm"
        | "affectedSitePercent"
        | "distanceM"
        | "features"
        | "recommendedActions"
      >
    > = {},
  ): ConstraintRegisterRow {
    const criterion = criterionById.get(id) ?? unavailable(id);
    const sourceId = registerSourceId(id);
    return {
      criterionId: id,
      label: criterion.label,
      group: criterion.group,
      status: criterion.status,
      score: criterion.score,
      finding: criterion.evidence,
      intersects: details.intersects ?? null,
      affectedAreaSqm: details.affectedAreaSqm ?? null,
      affectedSitePercent: details.affectedSitePercent ?? null,
      distanceM: details.distanceM ?? null,
      sourceId,
      sourceRetrievedAt: sourceById.get(sourceId)?.retrievedAt ?? null,
      features: details.features ?? [],
      recommendedActions: details.recommendedActions ?? [],
    };
  }

  const rows: ConstraintRegisterRow[] = [];
  if (natura.status === "fulfilled") {
    const result = natura.value.result;
    rows.push(
      row("natura-2000", {
        intersects: result.intersects,
        affectedAreaSqm: result.affectedAreaSqm,
        affectedSitePercent: result.affectedSitePercent,
        features: result.sites.map<ConstraintRegisterFeature>((site) => ({
          identifier: site.code,
          name: site.name,
          jurisdiction: site.memberState,
          classification: site.designation,
        })),
        recommendedActions: uniqueActions([result.recommendedAction]),
      }),
    );
  } else rows.push(row("natura-2000"));

  if (national.status === "fulfilled") {
    const result = national.value.result;
    rows.push(
      row("national-designations", {
        intersects: result.intersects,
        affectedAreaSqm: result.affectedAreaSqm,
        affectedSitePercent: result.affectedSitePercent,
        features: result.areas.map<ConstraintRegisterFeature>((area) => ({
          identifier: area.nationalId || `CDDA:${area.cddaId}`,
          name: area.name,
          jurisdiction: area.countryCode,
          classification:
            area.designationTypeCode || area.iucnCategory || "National designation",
        })),
        recommendedActions: uniqueActions([result.recommendedAction]),
      }),
    );
  } else rows.push(row("national-designations"));

  if (flood.status === "fulfilled") {
    const result = flood.value.result;
    rows.push(
      row("flood-risk-areas", {
        intersects: result.intersects,
        features: result.areas.map<ConstraintRegisterFeature>((area) => ({
          identifier: area.id,
          name: area.name,
          jurisdiction: area.countryCode,
          classification: `${area.representation}${area.hazardCategory ? ` | ${area.hazardCategory}` : ""}`,
        })),
        recommendedActions: uniqueActions([result.recommendedAction]),
      }),
    );
  } else rows.push(row("flood-risk-areas"));

  if (surfaceWater.status === "fulfilled") {
    const results = surfaceWater.value.results;
    const distances = results
      .map((result) => result.distanceM)
      .filter((distance): distance is number => distance !== null);
    rows.push(
      row("surface-water", {
        intersects: results.some((result) => result.classification === "on-site"),
        distanceM: distances.length ? Math.min(...distances) : null,
        features: results.flatMap<ConstraintRegisterFeature>((result) =>
          result.feature
            ? [{
                identifier: `OSM:${result.feature.osmType}/${result.feature.osmId}`,
                name: result.feature.name,
                jurisdiction: null,
                classification: result.feature.waterType,
              }]
            : [],
        ),
        recommendedActions: uniqueActions(
          results.map((result) => result.recommendedAction),
        ),
      }),
    );
  } else rows.push(row("surface-water"));

  const infrastructureIds = [
    "main-road",
    "transmission-line",
    "substation",
  ] as const;
  for (const id of infrastructureIds) {
    if (infrastructure.status !== "fulfilled") {
      rows.push(row(id));
      continue;
    }
    const result = infrastructure.value.results.find((item) => item.id === id);
    rows.push(
      row(id, {
        intersects: result ? result.classification === "on-site" : null,
        distanceM: result?.distanceM ?? null,
        features: result?.asset
          ? [{
              identifier: `OSM:${result.asset.osmType}/${result.asset.osmId}`,
              name: result.asset.name,
              jurisdiction: null,
              classification:
                result.asset.voltage != null
                  ? `${result.asset.voltage} V`
                  : result.asset.roadClass,
            }]
          : [],
        recommendedActions: uniqueActions([result?.recommendedAction]),
      }),
    );
  }

  rows.push(
    terrain.status === "fulfilled"
      ? row("terrain", {
          intersects:
            terrain.value.result.nonUsableNorthSlopeAreaSqm > 0,
          affectedAreaSqm:
            terrain.value.result.nonUsableNorthSlopeAreaSqm,
          affectedSitePercent:
            terrain.value.result.nonUsableNorthSlopePercent,
          recommendedActions: uniqueActions([
            terrain.value.result.recommendedAction,
          ]),
        })
      : row("terrain"),
  );
  return rows;
}

function constraintMapFeatures(
  infrastructure: PromiseSettledResult<InfrastructureAnalysis>,
  natura: PromiseSettledResult<Natura2000ConstraintAnalysis>,
  national: PromiseSettledResult<NationallyDesignatedAreasAnalysis>,
  flood: PromiseSettledResult<FloodRiskAreaAnalysis>,
  surfaceWater: PromiseSettledResult<SurfaceWaterAnalysis>,
  terrain: PromiseSettledResult<TerrainAnalysis>,
): ConstraintMapFeatureCollection {
  const features: ConstraintMapFeatureCollection["features"] = [];
  for (const analysis of [
    infrastructure,
    natura,
    national,
    flood,
    surfaceWater,
  ]) {
    if (analysis.status === "fulfilled") {
      features.push(...analysis.value.mapFeatures.features);
    }
  }
  if (terrain.status === "fulfilled") {
    features.push(
      ...terrainConstraintMapFeatures(terrain.value.nonUsableAreas).features,
    );
  }
  return { type: "FeatureCollection", features };
}

export async function analyzePreliminarySiteScore(
  projectId: string,
  site: GeoJSON.Polygon,
): Promise<PreliminarySiteScore> {
  const [infrastructure, natura, national, flood, surfaceWater, terrain] =
    await Promise.allSettled([
      withinSourceDeadline(analyzeInfrastructure(projectId, site)),
      withinSourceDeadline(analyzeNatura2000(projectId, site)),
      withinSourceDeadline(analyzeNationallyDesignatedAreas(projectId, site)),
      withinSourceDeadline(analyzeFloodRiskAreas(projectId, site)),
      withinSourceDeadline(analyzeSurfaceWater(projectId, site)),
      withinSourceDeadline(analyzeTerrain(projectId, site)),
    ] as const);

  const criteria: SiteScoreCriterion[] = [];
  const unavailableSources: PreliminarySiteScore["unavailableSources"] = [];

  if (natura.status === "fulfilled") criteria.push(naturaCriterion(natura.value));
  else {
    criteria.push(unavailable("natura-2000"));
    unavailableSources.push(
      sourceFailure("natura-2000", "Natura 2000", "EEA source unavailable."),
    );
  }

  if (national.status === "fulfilled") {
    criteria.push(nationalCriterion(national.value));
  } else {
    criteria.push(unavailable("national-designations"));
    unavailableSources.push(
      sourceFailure(
        "national-designations",
        "National designations",
        "EEA source unavailable.",
      ),
    );
  }

  if (flood.status === "fulfilled") criteria.push(floodCriterion(flood.value));
  else {
    criteria.push(unavailable("flood-risk-areas"));
    unavailableSources.push(
      sourceFailure(
        "flood-risk-areas",
        "Flood risk reporting areas",
        "EEA source unavailable.",
      ),
    );
  }

  if (surfaceWater.status === "fulfilled") {
    criteria.push(waterCriterion(surfaceWater.value));
  } else {
    criteria.push(unavailable("surface-water"));
    unavailableSources.push(
      sourceFailure(
        "surface-water",
        "Surface water and wetlands",
        "Overpass source unavailable.",
      ),
    );
  }

  if (infrastructure.status === "fulfilled") {
    criteria.push(...infrastructureCriteria(infrastructure.value));
  } else {
    criteria.push(
      unavailable("main-road"),
      unavailable("transmission-line"),
      unavailable("substation"),
    );
    unavailableSources.push(
      sourceFailure(
        "infrastructure",
        "Infrastructure proximity",
        "Overpass source unavailable.",
      ),
    );
  }

  if (terrain.status === "fulfilled") criteria.push(terrainCriterion(terrain.value));
  else {
    criteria.push(
      unavailable(
        "terrain",
        "Terrain provider is not configured or was unavailable during this run.",
      ),
    );
    unavailableSources.push(
      sourceFailure(
        "terrain",
        "Terrain elevation and slope",
        "Public terrain-tile source unavailable.",
      ),
    );
  }

  const availableCriteria = criteria.filter(
    (item): item is SiteScoreCriterion & { score: number } =>
      item.score !== null,
  );
  const availableWeight = availableCriteria.reduce(
    (sum, item) => sum + item.weight,
    0,
  );
  const weightedScore = availableCriteria.reduce(
    (sum, item) => sum + item.score * item.weight,
    0,
  );
  const score = availableWeight ? round(weightedScore / availableWeight) : null;
  const coveragePercent = availableWeight;
  const confidence =
    coveragePercent >= 95
      ? "high"
      : coveragePercent >= 70
        ? "medium"
        : "low";
  const band =
    score === null
      ? "unavailable"
      : score >= 80
        ? "favourable-screening"
        : score >= 60
          ? "further-review"
          : "material-constraints";

  const sources = sourceRegister(
    infrastructure,
    natura,
    national,
    flood,
    surfaceWater,
    terrain,
  );

  return {
    projectId,
    generatedAt: new Date().toISOString(),
    score,
    coveragePercent,
    confidence,
    band,
    criteria,
    unavailableSources,
    sources,
    constraintRegister: constraintRegister(
      criteria,
      sources,
      infrastructure,
      natura,
      national,
      flood,
      surfaceWater,
      terrain,
    ),
    terrainNonUsableAreas:
      terrain.status === "fulfilled"
        ? terrain.value.nonUsableAreas
        : undefined,
    constraintMapFeatures: constraintMapFeatures(
      infrastructure,
      natura,
      national,
      flood,
      surfaceWater,
      terrain,
    ),
    methodology: {
      version: "1.3",
      totalWeight: 100,
      normalization: "available-weight normalized",
    },
    disclaimer:
      "This preliminary screening score is a deterministic prioritisation aid, not a permitting opinion, valuation, investment recommendation or substitute for authoritative studies and professional judgment.",
  };
}
