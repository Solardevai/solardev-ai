"use client";

import { useState } from "react";
import { formatArea } from "@/lib/geo/format";
import type {
  NationallyDesignatedAreasAnalysis,
  Natura2000ConstraintAnalysis,
} from "@/types/gis";

type ConstraintAnalysisPanelProps = {
  projectId: string;
  onIntersectionChange?: (
    layerId: "natura-2000" | "nationally-designated-areas",
    intersects: boolean,
    affectedSitePercent: number,
  ) => void;
};

type ScreenButtonProps = {
  isRunning: boolean;
  hasResult: boolean;
  tone: "rose" | "amber";
  onClick: () => void;
};

function ScreenButton({
  isRunning,
  hasResult,
  tone,
  onClick,
}: ScreenButtonProps) {
  const colors =
    tone === "rose"
      ? "bg-rose-300 hover:bg-rose-200"
      : "bg-amber-300 hover:bg-amber-200";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isRunning}
      className={`shrink-0 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-950 disabled:opacity-60 ${colors}`}
    >
      {isRunning ? "Screening…" : hasResult ? "Refresh" : "Run"}
    </button>
  );
}

function RiskBadge({ risk }: { risk: "low" | "medium" | "high" }) {
  return (
    <span
      className={`rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${
        risk === "high"
          ? "border-rose-300/20 bg-rose-300/10 text-rose-200"
          : "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
      }`}
    >
      {risk} risk
    </span>
  );
}

export default function ConstraintAnalysisPanel({
  projectId,
  onIntersectionChange,
}: ConstraintAnalysisPanelProps) {
  const [natura, setNatura] = useState<Natura2000ConstraintAnalysis | null>(null);
  const [national, setNational] =
    useState<NationallyDesignatedAreasAnalysis | null>(null);
  const [naturaRunning, setNaturaRunning] = useState(false);
  const [nationalRunning, setNationalRunning] = useState(false);
  const [naturaError, setNaturaError] = useState<string | null>(null);
  const [nationalError, setNationalError] = useState<string | null>(null);

  async function runNatura() {
    setNaturaRunning(true);
    setNaturaError(null);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/analysis/natura2000`,
        { method: "POST" },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Natura 2000 screening failed.");
      setNatura(result.analysis);
      onIntersectionChange?.(
        "natura-2000",
        result.analysis.result.intersects,
        result.analysis.result.affectedSitePercent,
      );
    } catch (error) {
      setNaturaError(error instanceof Error ? error.message : "Natura 2000 screening failed.");
    } finally {
      setNaturaRunning(false);
    }
  }

  async function runNational() {
    setNationalRunning(true);
    setNationalError(null);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/analysis/nationally-designated-areas`,
        { method: "POST" },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "National protected-area screening failed.");
      }
      setNational(result.analysis);
      onIntersectionChange?.(
        "nationally-designated-areas",
        result.analysis.result.intersects,
        result.analysis.result.affectedSitePercent,
      );
    } catch (error) {
      setNationalError(
        error instanceof Error
          ? error.message
          : "National protected-area screening failed.",
      );
    } finally {
      setNationalRunning(false);
    }
  }

  return (
    <section className="mt-6 border-t border-white/10 pt-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        Environmental constraints
      </p>
      <p className="mt-1 text-[11px] text-slate-400">
        Official European designation datasets
      </p>

      <div aria-live="polite">
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-200">Natura 2000</p>
            <p className="mt-0.5 text-[10px] text-slate-500">EU network · 2024</p>
          </div>
          <ScreenButton
            isRunning={naturaRunning}
            hasResult={Boolean(natura)}
            tone="rose"
            onClick={runNatura}
          />
        </div>

        {naturaError && (
          <p className="mt-3 rounded-lg border border-rose-300/20 bg-rose-300/[0.06] p-3 text-[11px] leading-5 text-rose-200">
            {naturaError}
          </p>
        )}

        {natura && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-semibold text-white">{natura.result.label}</h3>
                <p className="mt-1 text-lg font-bold text-white">
                  {natura.result.intersects
                    ? `${natura.result.affectedSitePercent.toFixed(2)}% affected`
                    : "No mapped intersection"}
                </p>
              </div>
              <RiskBadge risk={natura.result.risk} />
            </div>
            {natura.result.intersects && (
              <dl className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                <div className="rounded-lg bg-white/[0.035] p-2.5">
                  <dt className="text-slate-500">Affected area</dt>
                  <dd className="mt-1 font-semibold text-white">
                    {formatArea(natura.result.affectedAreaSqm)}
                  </dd>
                </div>
                <div className="rounded-lg bg-white/[0.035] p-2.5">
                  <dt className="text-slate-500">Designated sites</dt>
                  <dd className="mt-1 font-semibold text-white">{natura.result.sites.length}</dd>
                </div>
              </dl>
            )}
            {natura.result.sites.length > 0 && (
              <div className="mt-3 space-y-2">
                {natura.result.sites.map((site) => (
                  <div key={site.code} className="rounded-lg border border-white/8 px-2.5 py-2 text-[10px]">
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
              {natura.result.recommendedAction}
            </p>
            <details className="mt-3 border-t border-white/8 pt-3">
              <summary className="cursor-pointer text-[10px] font-semibold text-slate-400">Source and limitations</summary>
              <div className="mt-3 space-y-2 text-[9px] leading-4 text-slate-500">
                <p>{natura.source.provider}, dataset {natura.source.datasetVersion}. {natura.source.copyright}. {natura.source.licence}.</p>
                <p>Retrieved {new Date(natura.source.retrievedAt).toLocaleString()}.</p>
                <ul className="list-disc space-y-1 pl-4">
                  {natura.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
                </ul>
                <a href={natura.source.serviceUrl} target="_blank" rel="noreferrer" className="inline-flex font-semibold text-rose-200 hover:text-rose-100">Open official EEA service ↗</a>
              </div>
            </details>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
          <div>
            <p className="text-xs font-semibold text-slate-200">National designations</p>
            <p className="mt-0.5 text-[10px] text-slate-500">EEA NatDA v23 · through May 2025</p>
          </div>
          <ScreenButton
            isRunning={nationalRunning}
            hasResult={Boolean(national)}
            tone="amber"
            onClick={runNational}
          />
        </div>

        {nationalError && (
          <p className="mt-3 rounded-lg border border-rose-300/20 bg-rose-300/[0.06] p-3 text-[11px] leading-5 text-rose-200">
            {nationalError}
          </p>
        )}

        {national && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-semibold text-white">{national.result.label}</h3>
                <p className="mt-1 text-lg font-bold text-white">
                  {national.result.intersects
                    ? `${national.result.affectedSitePercent.toFixed(2)}% affected`
                    : "No mapped intersection"}
                </p>
              </div>
              <RiskBadge risk={national.result.risk} />
            </div>
            {national.result.intersects && (
              <dl className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                <div className="rounded-lg bg-white/[0.035] p-2.5">
                  <dt className="text-slate-500">Affected area</dt>
                  <dd className="mt-1 font-semibold text-white">{formatArea(national.result.affectedAreaSqm)}</dd>
                </div>
                <div className="rounded-lg bg-white/[0.035] p-2.5">
                  <dt className="text-slate-500">Designated areas</dt>
                  <dd className="mt-1 font-semibold text-white">{national.result.areas.length}</dd>
                </div>
              </dl>
            )}
            {national.result.areas.length > 0 && (
              <div className="mt-3 space-y-2">
                {national.result.areas.map((area) => (
                  <div key={area.cddaId} className="rounded-lg border border-white/8 px-2.5 py-2 text-[10px]">
                    <p className="font-semibold text-slate-200">{area.name}</p>
                    <p className="mt-1 text-slate-500">
                      {area.nationalId || `CDDA ${area.cddaId}`}
                      {area.countryCode ? ` · ${area.countryCode}` : ""}
                      {area.iucnCategory ? ` · IUCN ${area.iucnCategory}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 border-t border-white/8 pt-3 text-[10px] leading-4 text-slate-400">
              {national.result.recommendedAction}
            </p>
            <details className="mt-3 border-t border-white/8 pt-3">
              <summary className="cursor-pointer text-[10px] font-semibold text-slate-400">Source and limitations</summary>
              <div className="mt-3 space-y-2 text-[9px] leading-4 text-slate-500">
                <p>{national.source.provider}, query service v{national.source.datasetVersion}, reported {national.source.reportingPeriod}. {national.source.licence}.</p>
                <p>Retrieved {new Date(national.source.retrievedAt).toLocaleString()}.</p>
                <ul className="list-disc space-y-1 pl-4">
                  {national.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
                </ul>
                <a href={national.source.serviceUrl} target="_blank" rel="noreferrer" className="inline-flex font-semibold text-amber-200 hover:text-amber-100">Open official EEA service ↗</a>
              </div>
            </details>
          </div>
        )}
      </div>
    </section>
  );
}
