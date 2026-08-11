"use client";

import { useState } from "react";

const stageActions = {
  origination: [
    "Confirm the candidate boundary, target capacity and land-control route.",
    "Run GIS fatal-flaw screening and record unavailable evidence.",
    "Shortlist grid connection options and define authority engagement.",
  ],
  feasibility: [
    "Reconcile gross area, exclusions and preliminary usable capacity.",
    "Commission the priority environmental, terrain, drainage and grid studies.",
    "Build the feasibility basis, sensitivities and next decision gate.",
  ],
  development: [
    "Align land, grid, permitting and engineering milestones on one critical path.",
    "Convert open findings into owned risks with evidence-based closeout criteria.",
    "Audit readiness against the next investment or procurement decision.",
  ],
  diligence: [
    "Freeze the document register and identify missing or superseded evidence.",
    "Test boundary, capacity, yield, grid, consent, cost and programme consistency.",
    "Report material findings, conditions and residual reliance limitations.",
  ],
} as const;

const priorityEvidence = {
  site: "Controlled boundary, constraints register, terrain and access evidence",
  grid: "Connection concept, network correspondence, route and capacity evidence",
  permitting: "Consent route, policy review, study scopes and consultation record",
  investment: "Basis of estimate, yield assumptions, risk register and decision criteria",
} as const;

type Stage = keyof typeof stageActions;
type Priority = keyof typeof priorityEvidence;

export default function ProjectDevelopmentAgentDemo() {
  const [stage, setStage] = useState<Stage>("origination");
  const [priority, setPriority] = useState<Priority>("site");
  const [market, setMarket] = useState("Spain");
  const [hasGenerated, setHasGenerated] = useState(true);
  const stageArticle = stage === "origination" ? "an" : "a";

  function generateBrief() {
    setHasGenerated(true);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
      <form
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        onSubmit={(event) => {
          event.preventDefault();
          generateBrief();
        }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Project context
        </p>
        <label className="mt-5 block text-xs font-semibold text-slate-300">
          Development stage
          <select
            value={stage}
            onChange={(event) => {
              setStage(event.target.value as Stage);
              setHasGenerated(false);
            }}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white"
          >
            <option value="origination">Origination</option>
            <option value="feasibility">Feasibility</option>
            <option value="development">Development</option>
            <option value="diligence">Technical due diligence</option>
          </select>
        </label>
        <label className="mt-4 block text-xs font-semibold text-slate-300">
          Immediate priority
          <select
            value={priority}
            onChange={(event) => {
              setPriority(event.target.value as Priority);
              setHasGenerated(false);
            }}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white"
          >
            <option value="site">Site viability</option>
            <option value="grid">Grid connection</option>
            <option value="permitting">Permitting</option>
            <option value="investment">Investment decision</option>
          </select>
        </label>
        <label className="mt-4 block text-xs font-semibold text-slate-300">
          Market
          <input
            value={market}
            onChange={(event) => {
              setMarket(event.target.value);
              setHasGenerated(false);
            }}
            maxLength={80}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white outline-none focus:border-emerald-300"
          />
        </label>
        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300"
        >
          Generate preview brief
        </button>
      </form>

      <section
        aria-live="polite"
        className="rounded-2xl border border-emerald-300/20 bg-slate-900 p-5 sm:p-6"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
              Agent response
            </p>
            <h2 className="mt-1 font-semibold text-white">
              Development action brief
            </h2>
          </div>
          <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-200">
            Rules-based preview
          </span>
        </div>

        {hasGenerated ? (
          <div className="mt-5">
            <p className="text-sm leading-7 text-slate-300">
              For {stageArticle} <strong className="text-white">{stage}</strong>-stage
              project in <strong className="text-white">{market || "the selected market"}</strong>,
              prioritize the following controlled actions:
            </p>
            <ol className="mt-5 space-y-3">
              {stageActions[stage].map((action, index) => (
                <li key={action} className="flex gap-3 rounded-xl bg-white/[0.035] p-4 text-sm leading-6 text-slate-300">
                  <span className="font-mono font-bold text-emerald-300">0{index + 1}</span>
                  <span>{action}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5 rounded-xl border border-sky-300/15 bg-sky-300/[0.05] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-200">
                Evidence requested
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {priorityEvidence[priority]}.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-slate-500">
            Generate the brief to apply the updated project context.
          </div>
        )}

        <p className="mt-5 text-[10px] leading-5 text-slate-500">
          This rules-based preview uses a controlled decision framework and does not process project files. The forthcoming AI
          agent will work with project evidence, cite sources, expose uncertainty
          and require professional validation before conclusions are issued.
        </p>
      </section>
    </div>
  );
}
