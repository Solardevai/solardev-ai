"use client";

import { useState } from "react";
import type {
  PreliminarySiteScore,
  SiteScoreCriterion,
} from "@/types/gis";

type SiteScorePanelProps = {
  projectId: string;
  northSlopeThresholdDeg?: number;
  onAnalysisChange?: (analysis: PreliminarySiteScore) => void;
};

const bandLabels: Record<PreliminarySiteScore["band"], string> = {
  "favourable-screening": "Lower mapped exposure",
  "further-review": "Further review required",
  "material-constraints": "Material mapped constraints",
  unavailable: "Insufficient source coverage",
};

const statusStyles: Record<SiteScoreCriterion["status"], string> = {
  favourable: "text-emerald-200",
  caution: "text-amber-200",
  constraint: "text-rose-200",
  unavailable: "text-slate-500",
};

function roundedScore(value: number) {
  return Math.round(value * 10) / 10;
}

function formatScore(value: number) {
  const rounded = roundedScore(value);
  return Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);
}

export default function SiteScorePanel({
  projectId,
  northSlopeThresholdDeg = 5,
  onAnalysisChange,
}: SiteScorePanelProps) {
  const [analysis, setAnalysis] = useState<PreliminarySiteScore | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis() {
    setIsRunning(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/analysis/site-score`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ northSlopeThresholdDeg }),
        },
      );
      const result: {
        score?: PreliminarySiteScore;
        error?: string;
      } = await response.json();
      if (!response.ok || !result.score) {
        throw new Error(result.error || "Screening-index calculation failed.");
      }
      const { score } = result;
      setAnalysis(score);
      onAnalysisChange?.(score);
    } catch (runError) {
      setError(
        runError instanceof Error
          ? runError.message
          : "Screening-index calculation failed.",
      );
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <section className="mt-6 border-t border-white/10 pt-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Preliminary screening index
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Relative prioritisation across available sources
          </p>
        </div>
        <button
          type="button"
          onClick={runAnalysis}
          disabled={isRunning}
          className="shrink-0 rounded-lg bg-emerald-300 px-3 py-2 text-[11px] font-bold text-slate-950 hover:bg-emerald-200 disabled:opacity-60"
        >
          {isRunning ? "Calculating…" : analysis ? "Refresh" : "Calculate"}
        </button>
      </div>

      <div aria-live="polite">
        {error && (
          <p className="mt-3 rounded-lg border border-rose-300/20 bg-rose-300/[0.06] p-3 text-[11px] leading-5 text-rose-200">
            {error}
          </p>
        )}

        {analysis && (
          <div className="mt-4 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.035] p-3">
            <div className="flex items-center gap-4">
              <div
                role="meter"
                aria-label="Preliminary screening index"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={analysis.score ?? undefined}
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-emerald-300/40 bg-slate-950"
              >
                <div className="text-center">
                  <p className="text-2xl font-black text-white">
                    {analysis.score === null
                      ? "—"
                      : formatScore(analysis.score)}
                  </p>
                  <p className="text-[9px] uppercase tracking-wide text-slate-500">
                    / 100
                  </p>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">
                  {bandLabels[analysis.band]}
                </p>
                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  {analysis.coveragePercent}% data coverage · {analysis.confidence} confidence
                </p>
                {analysis.coveragePercent < 100 && (
                  <p className="mt-1 text-[9px] leading-4 text-amber-200">
                    Partial index, normalized across available criteria.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-white/8 pt-3">
              {analysis.criteria.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg bg-white/[0.025] px-2.5 py-2"
                >
                  <div className="flex items-center justify-between gap-2 text-[10px]">
                    <span className="font-semibold text-slate-300">
                      {item.label}
                    </span>
                    <span className={statusStyles[item.status]}>
                      {item.score === null
                        ? "Unavailable"
                        : `${item.score}/100 · index effect −${item.deductionPoints}`}
                    </span>
                  </div>
                  <p className="mt-1 text-[9px] leading-4 text-slate-500">
                    Weight {item.weight}% · {item.evidence}
                  </p>
                </div>
              ))}
            </div>

            {analysis.unavailableSources.length > 0 && (
              <div className="mt-3 rounded-lg border border-amber-300/15 bg-amber-300/[0.04] p-2.5">
                <p className="text-[10px] font-semibold text-amber-200">
                  Missing inputs
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-[9px] leading-4 text-slate-500">
                  {analysis.unavailableSources.map((source) => (
                    <li key={source.id}>
                      {source.label}: {source.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <details className="mt-3 border-t border-white/8 pt-3">
              <summary className="cursor-pointer text-[10px] font-semibold text-slate-400">
                Method and disclaimer
              </summary>
              <div className="mt-3 space-y-2 text-[9px] leading-4 text-slate-500">
                <p>
                  Methodology v{analysis.methodology.version}; eight fixed criteria totaling {analysis.methodology.totalWeight} weight points. Missing inputs use {analysis.methodology.normalization} and are never scored as favourable.
                </p>
                {analysis.methodology.assumptions ? (
                  <p>
                    Recorded terrain assumption: north-facing slope threshold &gt;{analysis.methodology.assumptions.northSlopeThresholdDeg}°.
                  </p>
                ) : null}
                <p>
                  The index compares mapped exposure under this methodology. It is not a feasibility rating, consent opinion, grid-capacity assessment or prediction of project success.
                </p>
                <p>{analysis.disclaimer}</p>
              </div>
            </details>
          </div>
        )}
      </div>

    </section>
  );
}
