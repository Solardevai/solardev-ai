"use client";

import Link from "next/link";
import { useState } from "react";
import type { PortfolioProjectSummary } from "@/types/project";

type SortKey = "score" | "coverage" | "constraints" | "recent" | "name";

type PortfolioComparisonProps = {
  projects: PortfolioProjectSummary[];
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const bandLabels = {
  "favourable-screening": "Favourable",
  "further-review": "Further review",
  "material-constraints": "Material constraints",
  unavailable: "Unavailable",
} as const;

function scoreValue(project: PortfolioProjectSummary) {
  return project.latestAnalysis?.score ?? -1;
}

function compareProjects(
  first: PortfolioProjectSummary,
  second: PortfolioProjectSummary,
  sortKey: SortKey,
) {
  const scoredDifference =
    Number(second.latestAnalysis?.score !== null && !!second.latestAnalysis) -
    Number(first.latestAnalysis?.score !== null && !!first.latestAnalysis);
  if (scoredDifference) return scoredDifference;
  if (sortKey === "name") return first.name.localeCompare(second.name);
  if (sortKey === "recent") {
    return (
      Date.parse(second.latestAnalysis?.createdAt ?? second.updatedAt) -
      Date.parse(first.latestAnalysis?.createdAt ?? first.updatedAt)
    );
  }
  if (sortKey === "constraints") {
    return (
      (first.latestAnalysis?.materialConstraintCount ?? -1) -
        (second.latestAnalysis?.materialConstraintCount ?? -1) ||
      scoreValue(second) - scoreValue(first)
    );
  }
  if (sortKey === "coverage") {
    return (
      (second.latestAnalysis?.coveragePercent ?? -1) -
        (first.latestAnalysis?.coveragePercent ?? -1) ||
      scoreValue(second) - scoreValue(first)
    );
  }
  return (
    scoreValue(second) - scoreValue(first) ||
    (second.latestAnalysis?.coveragePercent ?? -1) -
      (first.latestAnalysis?.coveragePercent ?? -1)
  );
}

export default function PortfolioComparison({
  projects,
}: PortfolioComparisonProps) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const rankedProjects = projects.toSorted((first, second) =>
    compareProjects(first, second, sortKey),
  );
  const scoredProjects = projects.filter(
    (project) =>
      project.latestAnalysis !== null && project.latestAnalysis.score !== null,
  );
  const averageScore = scoredProjects.length
    ? Math.round(
        (scoredProjects.reduce(
          (total, project) => total + (project.latestAnalysis?.score ?? 0),
          0,
        ) /
          scoredProjects.length) *
          10,
      ) / 10
    : null;
  const materialConstraintCount = projects.reduce(
    (total, project) =>
      total + (project.latestAnalysis?.materialConstraintCount ?? 0),
    0,
  );
  const highConfidenceCount = projects.filter(
    (project) => project.latestAnalysis?.confidence === "high",
  ).length;

  return (
    <section className="mb-12" aria-labelledby="saved-projects-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
            GIS projects
          </p>
          <h2
            id="saved-projects-title"
            className="mt-2 text-3xl font-semibold tracking-tight"
          >
            Saved projects
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Open saved sites or compare their latest preliminary screening
            results. Ranking does not replace project-specific due diligence.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {projects.length > 0 && (
            <label className="text-xs font-semibold text-slate-400">
              Rank by
              <select
                value={sortKey}
                onChange={(event) => setSortKey(event.target.value as SortKey)}
                className="ml-2 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white"
              >
                <option value="score">Highest score</option>
                <option value="coverage">Highest coverage</option>
                <option value="constraints">Fewest constraints</option>
                <option value="recent">Most recently analyzed</option>
                <option value="name">Project name</option>
              </select>
            </label>
          )}
          <Link
            href="/tools/solar-site-screening"
            className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-300"
          >
            Create project
          </Link>
        </div>
      </div>

      {projects.length > 0 ? (
        <>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Projects scored
          </dt>
          <dd className="mt-2 text-2xl font-black text-white">
            {scoredProjects.length}/{projects.length}
          </dd>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Average score
          </dt>
          <dd className="mt-2 text-2xl font-black text-emerald-200">
            {averageScore ?? "-"}
          </dd>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Material criteria
          </dt>
          <dd className="mt-2 text-2xl font-black text-rose-200">
            {materialConstraintCount}
          </dd>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            High confidence
          </dt>
          <dd className="mt-2 text-2xl font-black text-sky-200">
            {highConfidenceCount}
          </dd>
        </div>
          </dl>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-[930px] w-full border-collapse text-left text-xs">
          <thead className="bg-white/[0.05] text-[10px] uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3">Rank</th>
              <th scope="col" className="px-4 py-3">Project</th>
              <th scope="col" className="px-4 py-3">Score</th>
              <th scope="col" className="px-4 py-3">Coverage</th>
              <th scope="col" className="px-4 py-3">Constraints</th>
              <th scope="col" className="px-4 py-3">Latest run</th>
              <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {rankedProjects.map((project, index) => {
              const analysis = project.latestAnalysis;
              return (
                <tr key={project.id} className="bg-white/[0.015] hover:bg-white/[0.035]">
                  <td className="px-4 py-4 font-black text-slate-500">
                    {analysis?.score !== null && analysis ? index + 1 : "-"}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/platform/projects/${project.id}`}
                      className="font-semibold text-white hover:text-emerald-200"
                    >
                      {project.name}
                    </Link>
                    <p className="mt-1 capitalize text-[10px] text-slate-500">
                      {project.technology} | {project.status.replace("-", " ")}
                      {project.country ? ` | ${project.country}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    {analysis ? (
                      <>
                        <span className="font-black text-white">
                          {analysis.score ?? "-"}/100
                        </span>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {bandLabels[analysis.band]}
                        </p>
                      </>
                    ) : (
                      <span className="text-slate-600">Not analyzed</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {analysis ? (
                      <>
                        <span className="font-semibold text-slate-200">
                          {analysis.coveragePercent}%
                        </span>
                        <p className="mt-1 capitalize text-[10px] text-slate-500">
                          {analysis.confidence} confidence
                        </p>
                      </>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-4">
                    {analysis ? (
                      <>
                        <span className={analysis.materialConstraintCount ? "font-bold text-rose-200" : "text-slate-300"}>
                          {analysis.materialConstraintCount} material
                        </span>
                        <p className="mt-1 text-[10px] text-amber-200/70">
                          {analysis.cautionCount} caution
                        </p>
                      </>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-4 text-slate-400">
                    {analysis ? dateFormatter.format(new Date(analysis.createdAt)) : "-"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {analysis ? (
                        <a
                          href={`/api/projects/${project.id}/analysis/snapshots/${analysis.snapshotId}/report`}
                          download
                          className="rounded-lg border border-white/10 px-2.5 py-2 font-semibold text-emerald-200 hover:bg-emerald-300/[0.07]"
                        >
                          PDF
                        </a>
                      ) : null}
                      <Link
                        href={`/platform/projects/${project.id}`}
                        className="rounded-lg bg-emerald-400 px-2.5 py-2 font-bold text-slate-950 hover:bg-emerald-300"
                      >
                        {analysis ? "Open" : "Analyze"}
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-sm leading-6 text-slate-400">
          No saved projects yet. Define a boundary in Site Assessment, save it,
          then continue in the GIS workspace.
        </div>
      )}
    </section>
  );
}
