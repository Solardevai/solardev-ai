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
  description: "Use SolarDev AI's project-aware engineering agent for sourced solar and BESS analysis, deterministic calculations and evidence review.",
  alternates: { canonical: "/agents/project-development" },
};
export const dynamic = "force-dynamic";

const capabilities = [
  ["Evidence-led", "Searches owner-scoped project documents and existing GIS findings."],
  ["Deterministic", "Uses auditable tools for PV, BESS and financial screening calculations."],
  ["Traceable", "Labels sourced facts, assumptions, calculations, gaps and next actions."],
  ["Professionally controlled", "Surfaces uncertainty and keeps approval with accountable practitioners."],
] as const;

export default async function ProjectDevelopmentAgentPage({ searchParams }: { searchParams: Promise<{ projectId?: string | string[] }> }) {
  const query = await searchParams;
  let userId: string | null = null;
  if (isAuthenticationAvailable()) userId = (await auth()).userId;
  const projects = userId ? await listOwnedProjects(userId) : [];
  const requestedProjectId = typeof query.projectId === "string" ? query.projectId : undefined;
  const initialProjectId = projects.some((project) => project.id === requestedProjectId) ? requestedProjectId : undefined;

  return <>
    <Navbar />
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_22%_0%,rgba(52,211,153,.13),transparent_40%),radial-gradient(circle_at_85%_15%,rgba(56,189,248,.08),transparent_32%)]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-wrap items-center gap-3"><span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">SolarDev Engineering Agent</span><span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-200">Authenticated beta</span></div>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">Solar and BESS expertise, grounded in your project</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Ask engineering questions, run auditable screening calculations and interrogate saved project evidence in one controlled workspace.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{capabilities.map(([title, description]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><h2 className="font-semibold text-emerald-200">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-400">{description}</p></article>)}</div>
        <div className="mt-12"><div className="mb-6"><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">Engineering workspace</p><h2 className="mt-3 text-3xl font-semibold">Investigate, calculate and document the basis</h2></div><ProjectDevelopmentAgentDemo projects={projects.map((project) => ({ id: project.id, name: project.name, technology: project.technology, country: project.country, status: project.status, areaHa: project.areaSqm / 10_000 }))} initialProjectId={initialProjectId} isSignedIn={Boolean(userId)} /></div>
        <aside className="mt-12 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8"><div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center"><div><h2 className="text-2xl font-semibold">Start with real site evidence</h2><p className="mt-3 max-w-3xl leading-7 text-slate-300">Create and save a boundary in SolarDev GIS Site Check. The agent can then use its project geometry, development context, latest analysis and uploaded evidence.</p></div><Link href="/tools/solar-site-screening" className="rounded-xl bg-emerald-400 px-5 py-3 text-center text-sm font-bold text-slate-950 hover:bg-emerald-300">Open SolarDev GIS Site Check</Link></div></aside>
      </section>
    </main>
    <Footer />
  </>;
}
