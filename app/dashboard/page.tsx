import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PortfolioComparison from "@/components/gis/PortfolioComparison";
import { isAuthenticationAvailable } from "@/lib/auth-config";
import { formatArea } from "@/lib/geo/format";
import { listOwnedPortfolioProjects } from "@/lib/projects/data";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your protected SolarDev AI engineering workspace.",
  alternates: {
    canonical: "/dashboard",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

const workspaceTools = [
  {
    title: "New site assessment",
    description:
      "Draw a boundary, review mapped infrastructure and run an indicative PVGIS yield check.",
    href: "/tools/solar-site-screening",
    action: "Open Site Check",
    accent: "amber",
  },
  {
    title: "Solar geometry",
    description:
      "Calculate solar angles, explore the daily sun path and review indicative shadow geometry.",
    href: "/tools/sun-path",
    action: "Open Solar Angle",
    accent: "emerald",
  },
  {
    title: "Development methodology",
    description:
      "Use engineering-led handbooks for structured Solar PV and BESS project development.",
    href: "/handbooks",
    action: "Browse handbooks",
    accent: "sky",
  },
] as const;

const accentClasses = {
  amber: "border-amber-300/20 bg-amber-300/10 text-amber-200",
  emerald:
    "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  sky: "border-sky-300/20 bg-sky-300/10 text-sky-200",
};

export default async function DashboardPage() {
  if (!isAuthenticationAvailable()) {
    redirect("/sign-in?configuration=required");
  }

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const projects = await listOwnedPortfolioProjects(userId);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white">
        <section className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(251,191,36,0.11),transparent_38%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.08),transparent_34%)]">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
                Protected workspace
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-300">
                Free account
              </span>
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Welcome to your SolarDev AI workspace
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Continue your project-development work with the tools and
              professional resources currently available.
            </p>

            <Link
              href="/tools/solar-site-screening"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
            >
              Start a site assessment
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <PortfolioComparison projects={projects} />

          <div className="mb-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  GIS projects
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  Saved sites
                </h2>
              </div>
              <Link
                href="/tools/solar-site-screening"
                className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-300"
              >
                Create project
              </Link>
            </div>

            {projects.length ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/platform/projects/${project.id}`}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-emerald-300/30 hover:bg-emerald-300/[0.05]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                        {project.technology === "bess"
                          ? "BESS"
                          : project.technology === "hybrid"
                            ? "Hybrid"
                            : "Solar PV"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatArea(project.areaSqm)}
                      </span>
                    </div>
                    <h3 className="mt-4 truncate text-lg font-semibold group-hover:text-emerald-200">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-xs capitalize text-slate-500">
                      {project.status.replace("-", " ")}
                      {project.country ? ` · ${project.country}` : ""}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-sm leading-6 text-slate-400">
                No saved projects yet. Define a boundary in Site Check, save it,
                then continue in the GIS workspace.
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {workspaceTools.map((tool) => (
              <article
                key={tool.title}
                className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6"
              >
                <span
                  className={`w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${accentClasses[tool.accent]}`}
                >
                  Available now
                </span>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                  {tool.title}
                </h2>
                <p className="mt-4 flex-1 leading-7 text-slate-300">
                  {tool.description}
                </p>
                <Link
                  href={tool.href}
                  className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-emerald-300/30 hover:bg-emerald-300/10"
                >
                  {tool.action}
                </Link>
              </article>
            ))}
          </div>

          <aside className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Workspace roadmap
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Account foundation active
                </h2>
                <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                  Authentication, project saving and the first GIS workspace
                  are active alongside constraint screening, immutable history,
                  professional PDF reports and portfolio ranking. Usage
                  allowances and subscription controls remain on the roadmap.
                </p>
              </div>
              <Link
                href="/#roadmap"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                View product roadmap
              </Link>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}
