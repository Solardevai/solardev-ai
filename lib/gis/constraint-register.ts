import "server-only";

import type { AnalysisSnapshotDetail, ConstraintRegisterRow } from "@/types/gis";
import type { SolarDevProject } from "@/types/project";

function safeCell(value: string | number | boolean | null) {
  let text = value == null ? "" : String(value);
  if (/^[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

function legacyRows(snapshot: AnalysisSnapshotDetail): ConstraintRegisterRow[] {
  return snapshot.payload.criteria.map((criterion) => ({
    criterionId: criterion.id,
    label: criterion.label,
    group: criterion.group,
    status: criterion.status,
    score: criterion.score,
    finding: criterion.evidence,
    intersects: null,
    affectedAreaSqm: null,
    affectedSitePercent: null,
    distanceM: null,
    sourceId: criterion.id,
    sourceRetrievedAt: null,
    features: [],
    recommendedActions: [],
  }));
}

export function constraintRegisterFilename(project: SolarDevProject) {
  const slug = project.name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${slug || "site"}-constraint-register.csv`;
}

export function generateConstraintRegisterCsv(
  project: SolarDevProject,
  snapshot: AnalysisSnapshotDetail,
) {
  const rows = snapshot.payload.constraintRegister ?? legacyRows(snapshot);
  const header = [
    "project_id",
    "project_name",
    "snapshot_id",
    "analysis_generated_utc",
    "methodology_version",
    "criterion_id",
    "criterion",
    "group",
    "status",
    "score",
    "intersects",
    "affected_area_sqm",
    "affected_site_percent",
    "distance_m",
    "feature_identifiers",
    "feature_names",
    "feature_jurisdictions",
    "feature_classifications",
    "source_id",
    "source_retrieved_utc",
    "finding",
    "recommended_actions",
  ];
  const lines = [header.map(safeCell).join(",")];
  for (const row of rows) {
    lines.push(
      [
        project.id,
        project.name,
        snapshot.id,
        snapshot.payload.generatedAt,
        snapshot.methodologyVersion,
        row.criterionId,
        row.label,
        row.group,
        row.status,
        row.score,
        row.intersects,
        row.affectedAreaSqm,
        row.affectedSitePercent,
        row.distanceM,
        row.features.map((feature) => feature.identifier).join(" | "),
        row.features.map((feature) => feature.name ?? "").join(" | "),
        row.features.map((feature) => feature.jurisdiction ?? "").join(" | "),
        row.features.map((feature) => feature.classification ?? "").join(" | "),
        row.sourceId,
        row.sourceRetrievedAt,
        row.finding,
        row.recommendedActions.join(" | "),
      ].map(safeCell).join(","),
    );
  }
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}
