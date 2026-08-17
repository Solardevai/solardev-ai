import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Free Plans",
  description:
    "Compare SolarDev AI free access without an account and the expanded free workspace available after sign-up.",
  alternates: { canonical: "/plans" },
};

const plans = [
  {
    id: "free-open",
    name: "Basic",
    eyebrow: "No account",
    description: "Start screening a site immediately. No registration required.",
    cta: "Explore public tools",
    href: "/tools/solar-site-screening",
    featured: false,
    highlights: [
      "Public GIS site screening",
      "Solar data and geometry tools",
      "Boundary and weather-data exports",
    ],
  },
  {
    id: "free-account",
    name: "Professional",
    eyebrow: "Free account",
    description: "Save your work and unlock deeper project screening and analysis.",
    cta: "Create a free account",
    href: "/sign-up",
    featured: true,
    highlights: [
      "Everything available without an account",
      "Private saved projects and portfolio view",
      "Advanced screening, reports and AI Agent",
    ],
  },
] as const;

const featureGroups = [
  {
    name: "Site screening tools",
    description: "Understand a site before creating a project.",
    featured: false,
    features: [
      { name: "Draw or upload a KMZ site boundary", open: true, account: true },
      { name: "Calculate area, perimeter and centroid", open: true, account: true },
      { name: "Satellite, topographic and street-map context", open: true, account: true },
      { name: "Indicative PVGIS specific yield", open: true, account: true },
    ],
  },
  {
    name: "Solar data and exports",
    description: "Calculate, share and export useful project data.",
    featured: false,
    features: [
      { name: "KMZ, KML and GeoJSON boundary exports", open: true, account: true },
      { name: "TMY weather data in CSV or EPW", open: true, account: true },
      { name: "Solar position, daylight and shading tools", open: true, account: true },
      { name: "Shareable scenario URL and solar-path CSV", open: true, account: true },
    ],
  },
  {
    name: "Account features",
    description: "Additional capabilities included when you create a free account.",
    featured: true,
    features: [
      { name: "Save and manage private projects", open: false, account: true },
      { name: "Preserve screening history", open: false, account: true },
      { name: "Compare projects in a portfolio", open: false, account: true },
      { name: "Terrain, flood, water and infrastructure screening", open: false, account: true },
      { name: "Designated-area and source-coverage checks", open: false, account: true },
      { name: "Professional PDF reports and CSV registers", open: false, account: true },
      { name: "Solar and BESS Agent with project context", open: false, account: true },
      { name: "Project evidence uploads for Agent sessions", open: false, account: true },
    ],
  },
] as const;

function IncludedMark({ included }: { included: boolean }) {
  if (!included) {
    return (
      <span className="flex items-center justify-center text-[#9aaba4]" aria-label="Not included">
        <span aria-hidden="true" className="h-px w-4 bg-current" />
      </span>
    );
  }

  return (
    <span
      className="mx-auto flex size-7 items-center justify-center rounded-lg border border-emerald-600/20 bg-emerald-100 text-emerald-700 shadow-sm"
      aria-label="Included"
    >
      <Check aria-hidden="true" className="size-4 stroke-[3]" />
    </span>
  );
}

export default function PlansPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f4f5f0] text-[#10271f]">
        <section className="relative overflow-hidden border-b border-[#10271f]/10 px-6 py-14 sm:py-20 lg:py-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 -top-48 h-[32rem] w-[32rem] rounded-full bg-amber-200/30 blur-3xl" />
            <div className="absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-emerald-300/25 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Plans</p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              Start free. Unlock more with an account.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#536860]">
              Use the core tools instantly, or create a free account to save projects,
              run deeper screening and work with the Solar and BESS Agent.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-[#29483c]">
              {["€0 for both options", "No credit card", "Start instantly"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                    <Check aria-hidden="true" className="size-3.5 stroke-[3]" />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="plan-options-title" className="px-6 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Choose your access</p>
              <h2 id="plan-options-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Two ways to get started
              </h2>
            </div>

            <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
              {plans.map((plan) => (
                <article
                  key={plan.id}
                  className={`relative flex flex-col overflow-hidden rounded-3xl border p-6 sm:p-8 ${
                    plan.featured
                      ? "border-emerald-600/35 bg-white shadow-xl shadow-emerald-900/10 ring-1 ring-emerald-500/10"
                      : "border-[#10271f]/10 bg-white/70 shadow-sm"
                  }`}
                >
                  {plan.featured ? (
                    <div className="absolute right-0 top-0 rounded-bl-2xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white">
                      Recommended
                    </div>
                  ) : null}

                  <div className="pr-20">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{plan.eyebrow}</p>
                    <h3 className="mt-3 text-3xl font-bold tracking-tight">{plan.name}</h3>
                  </div>

                  <div className="mt-5 border-b border-[#10271f]/10 pb-6">
                    <span className="text-5xl font-bold tracking-tight">€0</span>
                  </div>

                  <p className="mt-6 leading-7 text-[#536860]">{plan.description}</p>

                  <ul className="mt-6 flex-1 space-y-3.5">
                    {plan.highlights.map((highlight, index) => (
                      <li key={highlight} className="flex items-start gap-3 text-sm leading-6 text-[#29483c]">
                        <span
                          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md ${
                            plan.featured && index > 0
                              ? "bg-emerald-600 text-white"
                              : "border border-emerald-600/20 bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          <Check aria-hidden="true" className="size-3.5 stroke-[3]" />
                        </span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.featured ? (
                    <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-600/15 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
                      <Sparkles aria-hidden="true" className="size-4 shrink-0 text-emerald-600" />
                      Includes 8 additional account features
                    </div>
                  ) : null}

                  <Link
                    href={plan.href}
                    className={`mt-6 flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                      plan.featured
                        ? "bg-emerald-500 text-[#071d17] shadow-sm hover:bg-emerald-400"
                        : "border border-[#10271f]/15 bg-[#edf0e9] text-[#10271f] hover:bg-white"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="plan-comparison-title" className="px-6 pb-20 sm:pb-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Full comparison</p>
              <h2 id="plan-comparison-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                See exactly what is included
              </h2>
              <p className="mt-4 leading-7 text-[#536860]">
                Every checked box is included at no cost. Create an account for
                the highlighted project workspace features.
              </p>
            </div>

            <div className="mt-10 overflow-hidden rounded-3xl border border-[#10271f]/10 bg-white shadow-sm">
              <div className="grid grid-cols-[minmax(0,1fr)_5.5rem_5.5rem] items-center border-b border-[#10271f]/10 bg-[#edf0e9] sm:grid-cols-[minmax(0,1fr)_9rem_9rem]">
                <p className="p-4 text-xs font-bold uppercase tracking-[0.16em] text-[#536860] sm:px-6">Feature</p>
                <p className="border-l border-[#10271f]/10 px-2 py-4 text-center text-xs font-bold sm:text-sm">No account</p>
                <p className="h-full border-l border-emerald-600/15 bg-emerald-50 px-2 py-4 text-center text-xs font-bold text-emerald-900 sm:text-sm">Free account</p>
              </div>

              {featureGroups.map((group) => (
                <section key={group.name} aria-labelledby={`group-${group.name.replaceAll(" ", "-").toLowerCase()}`}>
                  <div className={`border-b border-[#10271f]/10 px-4 py-4 sm:px-6 ${group.featured ? "bg-emerald-50/80" : "bg-[#fafbf8]"}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 id={`group-${group.name.replaceAll(" ", "-").toLowerCase()}`} className="font-bold">{group.name}</h3>
                      {group.featured ? (
                        <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                          Account extras
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-[#64786f]">{group.description}</p>
                  </div>

                  <ul>
                    {group.features.map((feature) => (
                      <li
                        key={feature.name}
                        className="grid grid-cols-[minmax(0,1fr)_5.5rem_5.5rem] items-stretch border-b border-[#10271f]/8 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_9rem_9rem]"
                      >
                        <span className="flex items-center p-4 text-sm leading-5 text-[#29483c] sm:px-6 sm:py-4">{feature.name}</span>
                        <span className="flex items-center justify-center border-l border-[#10271f]/10 px-2 py-3">
                          <IncludedMark included={feature.open} />
                        </span>
                        <span className={`flex items-center justify-center border-l border-emerald-600/15 px-2 py-3 ${group.featured ? "bg-emerald-50/60" : "bg-emerald-50/30"}`}>
                          <IncludedMark included={feature.account} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="mt-8 rounded-3xl bg-[#10271f] px-6 py-8 text-center text-[#f4f5f0] sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-10 sm:text-left">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">Get the complete toolkit</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">Ready to save your first project?</h2>
                <p className="mt-2 text-sm leading-6 text-[#b8c5bf]">Free to create. No credit card required.</p>
              </div>
              <Link
                href="/sign-up"
                className="mt-6 inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-[#071d17] transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#10271f] sm:mt-0"
              >
                Create a free account
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
