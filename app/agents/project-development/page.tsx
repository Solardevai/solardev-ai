import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProjectDevelopmentAgentDemo from "@/components/agents/ProjectDevelopmentAgentDemo";
import { isAuthenticationAvailable } from "@/lib/auth-config";
import { listOwnedProjects } from "@/lib/projects/data";

export const metadata: Metadata = {
  title: "Solar & BESS Engineering Agent",
  description:
    "Use SolarDev AI's project-aware engineering agent for sourced solar and BESS analysis, deterministic calculations and evidence review.",
  alternates: { canonical: "/agents/project-development" },
};

export const dynamic = "force-dynamic";

const trustSignals = [
  ["Project-grounded", "Saved boundaries, GIS findings and project evidence"],
  ["Auditable", "Deterministic solar PV, BESS and finance screens"],
  ["Decision-ready", "Inputs, assumptions, constraints and next actions"],
] as const;

export default async function ProjectDevelopmentAgentPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string | string[] }>;
}) {
  const query = await searchParams;
  let userId: string | null = null;
  if (isAuthenticationAvailable()) userId = (await auth()).userId;

  const projects = userId ? await listOwnedProjects(userId) : [];
  const requestedProjectId =
    typeof query.projectId === "string" ? query.projectId : undefined;
  const initialProjectId = projects.some(
    (project) => project.id === requestedProjectId,
  )
    ? requestedProjectId
    : undefined;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 pb-11 pt-12 lg:px-8 lg:pb-14 lg:pt-16">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200">
                    SolarDev engineering copilot
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Stage-aware · Evidence-led
                  </span>
                </div>
                <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                  Screen, quantify and document the engineering basis.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                  Move from early site questions to traceable solar PV and BESS
                  decisions using saved project context, deterministic calculations
                  and clearly labelled evidence.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 lg:w-[520px]">
                {trustSignals.map(([title, description]) => (
                  <div
                    key={title}
                    className="border-l border-white/10 pl-3"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300">
                      {title}
                    </p>
                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <ProjectDevelopmentAgentDemo
            projects={projects.map((project) => ({
              id: project.id,
              name: project.name,
              technology: project.technology,
              country: project.country,
              status: project.status,
              areaHa: project.areaSqm / 10_000,
            }))}
            initialProjectId={initialProjectId}
            isSignedIn={Boolean(userId)}
          />

          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Start with a defensible site basis
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Create or update a saved site boundary, review its GIS findings and
                bring the result into this workspace as project context.
              </p>
            </div>
            <Link
              href="/tools/solar-site-screening"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-2.5 text-center text-xs font-bold text-emerald-200 transition hover:bg-emerald-300/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60"
            >
              Run a GIS site screen
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
