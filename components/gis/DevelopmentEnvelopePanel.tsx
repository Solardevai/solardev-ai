"use client";

import { useState } from "react";
import type { TerrainAnalysis } from "@/types/gis";
import type { ProjectTechnology } from "@/types/project";

type DevelopmentEnvelopePanelProps = {
  areaSqm: number;
  centroid: [longitude: number, latitude: number];
  technology: ProjectTechnology;
  terrainAnalysis: TerrainAnalysis | null;
};

function bounded(value: number, minimum: number, maximum: number) {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(maximum, Math.max(minimum, value));
}

function number(value: number, decimals = 1) {
  return value.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function DevelopmentEnvelopePanel({
  areaSqm,
  centroid,
  technology,
  terrainAnalysis,
}: DevelopmentEnvelopePanelProps) {
  const [otherAllowancePercent, setOtherAllowancePercent] = useState(15);
  const [powerDensityMwpHa, setPowerDensityMwpHa] = useState(0.65);
  const [dcAcRatio, setDcAcRatio] = useState(1.25);
  const [specificYield, setSpecificYield] = useState<number | null>(null);
  const [yieldState, setYieldState] = useState<"idle" | "loading" | "error">(
    "idle",
  );

  const grossHa = areaSqm / 10_000;
  const terrainExcludedHa = Math.min(
    grossHa,
    (terrainAnalysis?.result.nonUsableNorthSlopeAreaSqm ?? 0) / 10_000,
  );
  const postTerrainHa = Math.max(0, grossHa - terrainExcludedHa);
  const allowance = bounded(otherAllowancePercent, 0, 60);
  const otherAllowanceHa = postTerrainHa * (allowance / 100);
  const usableAreaHa = Math.max(0, postTerrainHa - otherAllowanceHa);
  const density = bounded(powerDensityMwpHa, 0.1, 2);
  const dcCapacityMwp = usableAreaHa * density;
  const ratio = bounded(dcAcRatio, 1, 2);
  const acCapacityMw = dcCapacityMwp / ratio;
  const annualProductionGwh =
    specificYield === null ? null : (dcCapacityMwp * specificYield) / 1_000;

  async function loadSpecificYield() {
    setYieldState("loading");
    try {
      const response = await fetch(
        `/api/pvgis?lat=${centroid[1]}&lon=${centroid[0]}`,
      );
      const result = (await response.json()) as {
        specificYield?: number;
        error?: string;
      };
      if (!response.ok || !Number.isFinite(result.specificYield)) {
        throw new Error(result.error ?? "PVGIS result unavailable.");
      }
      setSpecificYield(result.specificYield ?? null);
      setYieldState("idle");
    } catch {
      setYieldState("error");
    }
  }

  if (technology === "bess") {
    return (
      <section className="mt-6 border-t border-white/10 pt-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Development envelope
        </p>
        <p className="mt-2 text-[10px] leading-5 text-slate-400">
          Solar MWp and PVGIS production are not calculated for a BESS-only
          project. A storage-specific footprint workflow is planned separately.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6 border-t border-white/10 pt-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Development envelope
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Gross area → assumptions → MWp → indicative production
          </p>
        </div>
        <button
          type="button"
          onClick={loadSpecificYield}
          disabled={yieldState === "loading"}
          className="rounded-lg border border-sky-300/20 px-3 py-2 text-[10px] font-bold text-sky-200 hover:bg-sky-300/10 disabled:opacity-60"
        >
          {yieldState === "loading"
            ? "Loading PVGIS…"
            : specificYield === null
              ? "Add PVGIS yield"
              : "Refresh PVGIS"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <label className="text-[9px] font-semibold leading-4 text-slate-500">
          Other land allowance
          <span className="mt-1 flex items-center gap-1">
            <input
              type="number"
              min={0}
              max={60}
              step={1}
              value={otherAllowancePercent}
              onChange={(event) =>
                setOtherAllowancePercent(Number(event.target.value))
              }
              className="min-w-0 w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-2 text-[10px] text-white"
            />
            <span>%</span>
          </span>
        </label>
        <label className="text-[9px] font-semibold leading-4 text-slate-500">
          DC density
          <span className="mt-1 flex items-center gap-1">
            <input
              type="number"
              min={0.1}
              max={2}
              step={0.05}
              value={powerDensityMwpHa}
              onChange={(event) =>
                setPowerDensityMwpHa(Number(event.target.value))
              }
              className="min-w-0 w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-2 text-[10px] text-white"
            />
            <span>MWp/ha</span>
          </span>
        </label>
        <label className="text-[9px] font-semibold leading-4 text-slate-500">
          DC/AC ratio
          <input
            type="number"
            min={1}
            max={2}
            step={0.05}
            value={dcAcRatio}
            onChange={(event) => setDcAcRatio(Number(event.target.value))}
            className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-2 text-[10px] text-white"
          />
        </label>
      </div>

      <dl className="mt-4 space-y-1.5 text-[10px]">
        <EnvelopeRow label="Gross boundary" value={`${number(grossHa, 2)} ha`} />
        <EnvelopeRow
          label="Selected north-facing terrain mask"
          value={
            terrainAnalysis
              ? `−${number(terrainExcludedHa, 2)} ha`
              : "Not run (0 ha provisional)"
          }
          caution={!terrainAnalysis}
        />
        <EnvelopeRow
          label={`Other land allowance (${number(allowance, 0)}%)`}
          value={`−${number(otherAllowanceHa, 2)} ha`}
        />
        <EnvelopeRow
          label="Indicative usable-area assumption"
          value={`${number(usableAreaHa, 2)} ha`}
          strong
        />
        <EnvelopeRow
          label={`Indicative DC capacity @ ${number(density, 2)} MWp/ha`}
          value={`${number(dcCapacityMwp, 1)} MWp`}
          strong
        />
        <EnvelopeRow
          label={`Indicative AC capacity @ ${number(ratio, 2)} DC/AC`}
          value={`${number(acCapacityMw, 1)} MW`}
        />
        <EnvelopeRow
          label="Indicative annual production"
          value={
            annualProductionGwh === null
              ? yieldState === "error"
                ? "PVGIS unavailable"
                : "Add PVGIS yield"
              : `${number(annualProductionGwh, 1)} GWh/year`
          }
          strong={annualProductionGwh !== null}
        />
      </dl>

      <p className="mt-3 text-[9px] leading-4 text-slate-500">
        Mapped protected areas, water, flood reporting areas and grid features
        are not automatically deducted: their legal applicability, buffers and
        layout treatment require project-specific decisions. This is an
        editable screening bridge, not a layout, P50 yield or capacity opinion.
      </p>
    </section>
  );
}

function EnvelopeRow({
  label,
  value,
  strong = false,
  caution = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  caution?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg bg-white/[0.025] px-2.5 py-2">
      <dt className="text-slate-500">{label}</dt>
      <dd
        className={`text-right ${
          caution
            ? "text-amber-200"
            : strong
              ? "font-bold text-emerald-200"
              : "font-semibold text-slate-200"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
