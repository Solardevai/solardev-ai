"use client";

import { useState } from "react";
import type {
  AnalysisSnapshotDetail,
  AnalysisSnapshotSummary,
  PreliminarySiteScore,
  SiteScoreCriterion,
} from "@/types/gis";

type SiteScorePanelProps = {
  projectId: string;
  initialHistory: AnalysisSnapshotSummary[];
};

const bandLabels: Record<PreliminarySiteScore["band"], string> = {
  "favourable-screening": "Favourable screening",
  "further-review": "Further review",
  "material-constraints": "Material constraints",
  unavailable: "Unavailable",
};

const statusStyles: Record<SiteScoreCriterion["status"], string> = {
  favourable: "text-emerald-200",
  caution: "text-amber-200",
  constraint: "text-rose-200",
  unavailable: "text-slate-500",
};

const snapshotDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "UTC",
  timeZoneName: "short",
});

export default function SiteScorePanel({
  projectId,
  initialHistory,
}: SiteScorePanelProps) {
  const [analysis, setAnalysis] = useState<PreliminarySiteScore | null>(null);
  const [history, setHistory] = useState(initialHistory);
  const [activeSnapshotId, setActiveSnapshotId] = useState<string | null>(null);
  const [loadingSnapshotId, setLoadingSnapshotId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis() {
    setIsRunning(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/analysis/site-score`,
        { method: "POST" },
      );
      const result: {
        score?: PreliminarySiteScore;
        snapshot?: AnalysisSnapshotSummary;
        error?: string;
      } = await response.json();
      if (!response.ok || !result.score || !result.snapshot) {
        throw new Error(result.error || "Preliminary scoring failed.");
      }
      const { score, snapshot } = result;
      setAnalysis(score);
      setActiveSnapshotId(snapshot.id);
      setHistory((current) =>
        [
          snapshot,
          ...current.filter((item) => item.id !== snapshot.id),
        ].slice(0, 20),
      );
    } catch (runError) {
      setError(
        runError instanceof Error
          ? runError.message
          : "Preliminary scoring failed.",
      );
    } finally {
      setIsRunning(false);
    }
  }

  async function loadSnapshot(snapshotId: string) {
    setLoadingSnapshotId(snapshotId);
    setError(null);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/analysis/snapshots/${snapshotId}`,
        { cache: "no-store" },
      );
      const result: { snapshot?: AnalysisSnapshotDetail; error?: string } =
        await response.json();
      if (!response.ok || !result.snapshot) {
        throw new Error(result.error || "Saved analysis could not be loaded.");
      }
      setAnalysis(result.snapshot.payload);
      setActiveSnapshotId(snapshotId);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Saved analysis could not be loaded.",
      );
    } finally {
      setLoadingSnapshotId(null);
    }
  }

  return (
    <section className="mt-6 border-t border-white/10 pt-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Preliminary score
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Explainable deterministic screening
          </p>
        </div>
        <button
          type="button"
          onClick={runAnalysis}
          disabled={isRunning || loadingSnapshotId !== null}
          className="shrink-0 rounded-lg bg-emerald-300 px-3 py-2 text-[11px] font-bold text-slate-950 hover:bg-emerald-200 disabled:opacity-60"
        >
          {isRunning ? "Scoring…" : analysis ? "Refresh" : "Calculate"}
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
                aria-label="Preliminary site score"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={analysis.score ?? undefined}
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-emerald-300/40 bg-slate-950"
              >
                <div className="text-center">
                  <p className="text-2xl font-black text-white">
                    {analysis.score ?? "—"}
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
                    Partial score, normalized across available criteria.
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
                        : `${item.score}/100 · −${item.deductionPoints} pts`}
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
                <p>{analysis.disclaimer}</p>
              </div>
            </details>
          </div>
        )}
      </div>

      {history.length > 0 ? (
        <div className="mt-4 border-t border-white/8 pt-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold text-slate-300">
              Saved runs
            </p>
            <p className="text-[9px] text-slate-600">
              Append-only history
            </p>
          </div>
          <ol className="mt-2 space-y-1.5">
            {history.map((snapshot, index) => {
              const olderSnapshot = history[index + 1];
              const delta =
                olderSnapshot &&
                snapshot.score !== null &&
                olderSnapshot.score !== null
                  ? snapshot.score - olderSnapshot.score
                  : null;
              const isActive = activeSnapshotId === snapshot.id;
              const isLoading = loadingSnapshotId === snapshot.id;

              return (
                <li key={snapshot.id} className="flex items-stretch gap-1.5">
                  <button
                    type="button"
                    onClick={() => loadSnapshot(snapshot.id)}
                    disabled={loadingSnapshotId !== null || isRunning}
                    aria-pressed={isActive}
                    className={`min-w-0 flex-1 rounded-lg border px-2.5 py-2 text-left hover:border-emerald-300/20 hover:bg-white/[0.045] disabled:opacity-60 ${
                      isActive
                        ? "border-emerald-300/30 bg-emerald-300/[0.06]"
                        : "border-white/8 bg-white/[0.025]"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-slate-300">
                        {isLoading
                          ? "Loadingâ€¦"
                          : snapshot.score === null
                            ? "No score"
                            : `${snapshot.score}/100`}
                      </span>
                      <span
                        className={
                          delta === null
                            ? "text-slate-600"
                            : delta > 0
                              ? "text-emerald-300"
                              : delta < 0
                                ? "text-rose-300"
                                : "text-slate-500"
                        }
                      >
                        {delta === null
                          ? "â€”"
                          : `${delta > 0 ? "+" : ""}${delta} vs prior`}
                      </span>
                    </span>
                    <span className="mt-1 flex items-center justify-between gap-2 text-[9px] text-slate-500">
                      <span>{snapshotDateFormatter.format(new Date(snapshot.createdAt))}</span>
                      <span>
                        {snapshot.coveragePercent}% Â· {snapshot.confidence}
                      </span>
                    </span>
                  </button>
                  <a
                    href={`/api/projects/${projectId}/analysis/snapshots/${snapshot.id}/report`}
                    download
                    aria-label={`Download PDF report for the ${snapshotDateFormatter.format(new Date(snapshot.createdAt))} analysis`}
                    className="flex w-12 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/[0.025] text-[9px] font-bold text-emerald-200 hover:border-emerald-300/25 hover:bg-emerald-300/[0.06]"
                  >
                    PDF
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      ) : (
        <p className="mt-3 text-[9px] leading-4 text-slate-600">
          The first completed score will be saved here as an immutable run.
        </p>
      )}
    </section>
  );
}
