"use client";

import { useState } from "react";
import { formatArea } from "@/lib/geo/format";
import type { Natura2000ConstraintAnalysis } from "@/types/gis";

type ConstraintAnalysisPanelProps = {
  projectId: string;
};

export default function ConstraintAnalysisPanel({
  projectId,
}: ConstraintAnalysisPanelProps) {
  const [analysis, setAnalysis] =
    useState<Natura2000ConstraintAnalysis | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis() {
    setIsRunning(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/analysis/natura2000`,
        { method: "POST" },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Natura 2000 screening failed.");
      }
      setAnalysis(result.analysis);
    } catch (runError) {
      setError(
        runError instanceof Error
          ? runError.message
          : "Natura 2000 screening failed.",
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
            Environmental constraints
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Official EU Natura 2000 network
          </p>
        </div>
        <button
          type="button"
          onClick={runAnalysis}
          disabled={isRunning}
          className="shrink-0 rounded-lg bg-rose-300 px-3 py-2 text-[11px] font-bold text-slate-950 hover:bg-rose-200 disabled:opacity-60"
        >
          {isRunning ? "Screening…" : analysis ? "Refresh" : "Run screening"}
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
                  {analysis.result.intersects
                    ? `${analysis.result.affectedSitePercent.toFixed(2)}% affected`
                    : "No mapped intersection"}
                </p>
              </div>
              <span
                className={`rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${
                  analysis.result.risk === "high"
                    ? "border-rose-300/20 bg-rose-300/10 text-rose-200"
                    : "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                }`}
              >
                {analysis.result.risk} risk
              </span>
            </div>

            {analysis.result.intersects && (
              <dl className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                <div className="rounded-lg bg-white/[0.035] p-2.5">
                  <dt className="text-slate-500">Affected area</dt>
                  <dd className="mt-1 font-semibold text-white">
                    {formatArea(analysis.result.affectedAreaSqm)}
                  </dd>
                </div>
                <div className="rounded-lg bg-white/[0.035] p-2.5">
                  <dt className="text-slate-500">Designated sites</dt>
                  <dd className="mt-1 font-semibold text-white">
                    {analysis.result.sites.length}
                  </dd>
                </div>
              </dl>
            )}

            {analysis.result.sites.length > 0 && (
              <div className="mt-3 space-y-2">
                {analysis.result.sites.map((site) => (
                  <div
                    key={site.code}
                    className="rounded-lg border border-white/8 px-2.5 py-2 text-[10px]"
                  >
                    <p className="font-semibold text-slate-200">{site.name}</p>
                    <p className="mt-1 text-slate-500">
                      {site.code} · {site.designation}
                      {site.memberState ? ` · ${site.memberState}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-3 border-t border-white/8 pt-3 text-[10px] leading-4 text-slate-400">
              {analysis.result.recommendedAction}
            </p>

            <details className="mt-3 border-t border-white/8 pt-3">
              <summary className="cursor-pointer text-[10px] font-semibold text-slate-400">
                Source and limitations
              </summary>
              <div className="mt-3 space-y-2 text-[9px] leading-4 text-slate-500">
                <p>
                  {analysis.source.provider}, dataset {analysis.source.datasetVersion}. {analysis.source.copyright}. {analysis.source.licence}.
                </p>
                <p>
                  Retrieved {new Date(analysis.source.retrievedAt).toLocaleString()}.
                </p>
                <ul className="list-disc space-y-1 pl-4">
                  {analysis.limitations.map((limitation) => (
                    <li key={limitation}>{limitation}</li>
                  ))}
                </ul>
                <a
                  href={analysis.source.serviceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex font-semibold text-rose-200 hover:text-rose-100"
                >
                  Open official EEA service ↗
                </a>
              </div>
            </details>
          </div>
        )}
      </div>
    </section>
  );
}
