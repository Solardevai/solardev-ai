import type { PreliminarySiteScore } from "@/types/gis";
import type { SolarDevProject } from "@/types/project";

export type ManualProjectInputs = {
  pvDcMw?: number;
  pvAcMw?: number;
  bessPowerMw?: number;
  bessEnergyMwh?: number;
  notes?: string;
};

export type AgentProjectContext = {
  project: SolarDevProject | null;
  latestAnalysis: PreliminarySiteScore | null;
  manualInputs: ManualProjectInputs;
};

export type LabeledResult<T> = {
  label: "CALCULATED RESULT";
  method: string;
  inputs: Record<string, number | string | boolean | null | undefined>;
  assumptions: string[];
  result: T;
  warnings: string[];
};

export function calculated<T>(method: string, inputs: LabeledResult<T>["inputs"], result: T, assumptions: string[] = [], warnings: string[] = []): LabeledResult<T> {
  return { label: "CALCULATED RESULT", method, inputs, assumptions, result, warnings };
}
