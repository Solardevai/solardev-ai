import {
  INFRASTRUCTURE_LAYER_IDS,
  type InfrastructureLayerId,
} from "@/lib/gis/layers";
import type {
  ProjectStatus,
  ProjectTechnology,
} from "@/types/project";

const PROJECT_TECHNOLOGIES = new Set<ProjectTechnology>([
  "solar",
  "bess",
  "hybrid",
]);
const PROJECT_STATUSES = new Set<ProjectStatus>([
  "screening",
  "development",
  "due-diligence",
]);
const INFRASTRUCTURE_LAYERS = new Set<string>(INFRASTRUCTURE_LAYER_IDS);

export function isProjectTechnology(
  value: unknown,
): value is ProjectTechnology {
  return typeof value === "string" && PROJECT_TECHNOLOGIES.has(value as ProjectTechnology);
}

export function isProjectStatus(value: unknown): value is ProjectStatus {
  return typeof value === "string" && PROJECT_STATUSES.has(value as ProjectStatus);
}

export function parseVisibleLayers(value: unknown): InfrastructureLayerId[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (layer): layer is InfrastructureLayerId =>
      typeof layer === "string" && INFRASTRUCTURE_LAYERS.has(layer),
  );
}
