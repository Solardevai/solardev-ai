"use client";

import { useState } from "react";
import type { TerrainAnalysis } from "@/types/gis";

type TerrainAnalysisPanelProps = { projectId: string };

function percentGrade(degrees: number) {
  return Math.tan((degrees * Math.PI) / 180) * 100;
}

export default function TerrainAnalysisPanel({
  projectId,
}: TerrainAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<TerrainAnalysis | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis() {
    setIsRunning(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/analysis/terrain`,
        { method: "POST" },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Terrain screening failed.");
      }
      setAnalysis(result.analysis);
    } catch (runError) {
      setError(
        runError instanceof Error
          ? runError.message
          : "Terrain screening failed.",
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
            Terrain
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Sampled elevation and slope · 90 m DEM
          </p>
        </div>
        <button
          type="button"
          onClick={runAnalysis}
          disabled={isRunning}
          className="shrink-0 rounded-lg bg-lime-300 px-3 py-2 text-[11px] font-bold text-slate-950 hover:bg-lime-200 disabled:opacity-60"
        >
          {isRunning ? "Analysing…" : analysis ? "Refresh" : "Run"}
        </button>
      </div>

      <div aria-live="polite">
        {error && (
          <p className="mt-3 rounded-lg border border-rose-300/20 bg-rose-300/[0.06] p-3 text-[11px] leading-5 text-rose-200">
            {error}
          </p>
        )}

        {analysis && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-semibold text-white">
                  {analysis.result.label}
                </h3>
                <p className="mt-1 text-lg font-bold text-white">
                  {analysis.result.averageSlopeDeg.toFixed(2)}° average
                </p>
              </div>
              <span
                className={`rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${
                  analysis.result.risk === "high"
                    ? "border-rose-300/20 bg-rose-300/10 text-rose-200"
                    : analysis.result.risk === "medium"
                      ? "border-amber-300/20 bg-amber-300/10 text-amber-200"
                      : "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                }`}
              >
                {analysis.result.risk} risk
              </span>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
              <div className="rounded-lg bg-white/[0.035] p-2.5">
                <dt className="text-slate-500">Elevation range</dt>
                <dd className="mt-1 font-semibold text-white">
                  {analysis.result.minimumElevationM.toLocaleString()}–{analysis.result.maximumElevationM.toLocaleString()} m
                </dd>
              </div>
              <div className="rounded-lg bg-white/[0.035] p-2.5">
                <dt className="text-slate-500">Elevation variation</dt>
                <dd className="mt-1 font-semibold text-white">
                  {analysis.result.elevationRangeM.toLocaleString()} m
                </dd>
              </div>
              <div className="rounded-lg bg-white/[0.035] p-2.5">
                <dt className="text-slate-500">Average sampled slope</dt>
                <dd className="mt-1 font-semibold text-white">
                  {analysis.result.averageSlopeDeg.toFixed(2)}° · {percentGrade(analysis.result.averageSlopeDeg).toFixed(1)}%
                </dd>
              </div>
              <div className="rounded-lg bg-white/[0.035] p-2.5">
                <dt className="text-slate-500">90th percentile slope</dt>
                <dd className="mt-1 font-semibold text-white">
                  {analysis.result.p90SlopeDeg.toFixed(2)}° · {percentGrade(analysis.result.p90SlopeDeg).toFixed(1)}%
                </dd>
              </div>
            </dl>

            <p className="mt-3 border-t border-white/8 pt-3 text-[10px] leading-4 text-slate-400">
              {analysis.result.recommendedAction}
            </p>

            <details className="mt-3 border-t border-white/8 pt-3">
              <summary className="cursor-pointer text-[10px] font-semibold text-slate-400">
                Method, source and limitations
              </summary>
              <div className="mt-3 space-y-2 text-[9px] leading-4 text-slate-500">
                <p>
                  {analysis.result.sampleCount} samples · {analysis.methodology.sampling} · {analysis.methodology.slope}.
                </p>
                <p>
                  {analysis.source.dataset} ({analysis.source.resolutionM} m) via {analysis.source.provider}. DOI {analysis.source.doi}. Retrieved {new Date(analysis.source.retrievedAt).toLocaleString()}.
                </p>
                <ul className="list-disc space-y-1 pl-4">
                  {analysis.limitations.map((limitation) => (
                    <li key={limitation}>{limitation}</li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        )}
      </div>
    </section>
  );
}
