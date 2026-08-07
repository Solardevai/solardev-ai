"use client";

import { useState } from "react";
import { formatDistance } from "@/lib/geo/format";
import type {
  InfrastructureAnalysis,
  ProximityClassification,
} from "@/types/gis";

type InfrastructureAnalysisPanelProps = {
  projectId: string;
};

const classificationStyles: Record<ProximityClassification, string> = {
  "on-site": "border-amber-300/20 bg-amber-300/10 text-amber-200",
  near: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  moderate: "border-sky-300/20 bg-sky-300/10 text-sky-200",
  remote: "border-rose-300/20 bg-rose-300/10 text-rose-200",
  "not-found": "border-white/10 bg-white/[0.04] text-slate-400",
};

function formatAssetDetail(
  result: InfrastructureAnalysis["results"][number],
) {
  if (!result.asset) return `No mapped asset within the analysis radius`;
  const details = [
    result.asset.name,
    result.asset.voltage
      ? `${(result.asset.voltage / 1_000).toLocaleString()} kV`
      : null,
    result.asset.roadClass?.replaceAll("_", " "),
    result.asset.operator,
  ].filter(Boolean);
  return details.length ? details.join(" · ") : `OSM ${result.asset.osmType} ${result.asset.osmId}`;
}

export default function InfrastructureAnalysisPanel({
  projectId,
}: InfrastructureAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<InfrastructureAnalysis | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis() {
    setIsRunning(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/analysis/infrastructure`,
        { method: "POST" },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Infrastructure analysis failed.");
      }
      setAnalysis(result.analysis);
    } catch (runError) {
      setError(
        runError instanceof Error
          ? runError.message
          : "Infrastructure analysis failed.",
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
            Infrastructure analysis
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Deterministic distance from the site boundary
          </p>
        </div>
        <button
          type="button"
          onClick={runAnalysis}
          disabled={isRunning}
          className="shrink-0 rounded-lg bg-sky-300 px-3 py-2 text-[11px] font-bold text-slate-950 hover:bg-sky-200 disabled:opacity-60"
        >
          {isRunning ? "Analysing…" : analysis ? "Refresh" : "Run analysis"}
        </button>
      </div>

      <div aria-live="polite">
        {error && (
          <p className="mt-3 rounded-lg border border-rose-300/20 bg-rose-300/[0.06] p-3 text-[11px] leading-5 text-rose-200">
            {error}
          </p>
        )}

        {analysis && (
          <div className="mt-4 space-y-3">
            {analysis.results.map((result) => (
              <article
                key={result.id}
                className="rounded-xl border border-white/10 bg-white/[0.025] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-semibold text-white">
                      {result.label}
                    </h3>
                    <p className="mt-1 text-lg font-bold text-white">
                      {result.distanceM === null
                        ? "Not found"
                        : result.distanceM <= 1
                          ? "Intersects site"
                          : formatDistance(result.distanceM / 1_000)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${classificationStyles[result.classification]}`}
                  >
                    {result.classification.replace("-", " ")}
                  </span>
                </div>
                <p className="mt-2 text-[10px] capitalize leading-4 text-slate-500">
                  {formatAssetDetail(result)}
                </p>
                <p className="mt-2 border-t border-white/8 pt-2 text-[10px] leading-4 text-slate-400">
                  {result.recommendedAction}
                </p>
              </article>
            ))}

            <details className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <summary className="cursor-pointer text-[10px] font-semibold text-slate-400">
                Source and limitations
              </summary>
              <div className="mt-3 space-y-2 text-[9px] leading-4 text-slate-500">
                <p>
                  {analysis.source.provider}. Dataset timestamp: {analysis.source.datasetTimestamp
                    ? new Date(analysis.source.datasetTimestamp).toLocaleString()
                    : "not reported"}. Retrieved {new Date(analysis.source.retrievedAt).toLocaleString()}.
                </p>
                <p>
                  {analysis.assetsScanned.toLocaleString()} unique mapped assets scanned within {analysis.searchRadiusKm} km. {analysis.source.licence}.
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
