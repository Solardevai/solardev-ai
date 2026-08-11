import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProjectDevelopmentAgentDemo from "@/components/agents/ProjectDevelopmentAgentDemo";

export const metadata: Metadata = {
  title: "Project Development Agent",
  description:
    "Preview SolarDev AI's specialized agent for evidence-led utility-scale solar and BESS project development workflows.",
  alternates: { canonical: "/agents/project-development" },
};

const capabilities = [
  ["Evidence-led", "Works from project documents, GIS findings and explicit assumptions."],
  ["Stage-aware", "Adapts actions to origination, feasibility, development or due diligence."],
  ["Traceable", "Connects recommendations to sources, gaps, owners and decision gates."],
  ["Professionally controlled", "Surfaces uncertainty and keeps approval with accountable practitioners."],
] as const;

export default function ProjectDevelopmentAgentPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="border-b border-white/10 bg-[radial-gradient(circle_at_22%_0%,rgba(52,211,153,.13),transparent_40%),radial-gradient(circle_at_85%_15%,rgba(56,189,248,.08),transparent_32%)]">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
                First specialized agent
              </span>
              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
                Rules-based interactive preview
              </span>
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
              Project Development Agent
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              A transparent preview of how a future specialized workspace could turn project evidence into
              prioritized actions, information requests, risks and decision-gate
              briefs across the solar and BESS development lifecycle.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(([title, description]) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="font-semibold text-emerald-200">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
              </article>
            ))}
          </div>

          <div className="mt-12">
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">
                Try the interaction model
              </p>
              <h2 className="mt-3 text-3xl font-semibold">Generate a controlled next-step brief</h2>
            </div>
            <ProjectDevelopmentAgentDemo />
          </div>

          <aside className="mt-12 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-2xl font-semibold">Start with real site evidence</h2>
                <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                  SolarDev GIS Site Check creates the boundary and indicative
                  resource context. After saving, the GIS workspace adds separate
                  terrain, constraint and infrastructure evidence that a future
                  project agent can use inside controlled workflows.
                </p>
              </div>
              <Link href="/tools/solar-site-screening" className="rounded-xl bg-emerald-400 px-5 py-3 text-center text-sm font-bold text-slate-950 hover:bg-emerald-300">
                Open SolarDev GIS Site Check
              </Link>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
