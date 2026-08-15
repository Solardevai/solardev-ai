import type { Metadata } from "next";
import Link from "next/link";
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
    name: "Free — No account",
    eyebrow: "Open access",
    description:
      "Use the public screening and solar-geometry tools immediately. No registration or project workspace is required.",
    cta: "Explore public tools",
    href: "/tools/solar-site-screening",
    featured: false,
    topics: [
      {
        name: "GIS site check",
        features: [
          "Draw a boundary or upload a KMZ site polygon",
          "Calculate gross area, perimeter and centroid",
          "Inspect satellite, topographic and OpenStreetMap context",
        ],
      },
      {
        name: "Solar data and exports",
        features: [
          "Request an indicative PVGIS specific yield",
          "Export boundaries as KMZ, KML or GeoJSON",
          "Download PVGIS TMY weather data as CSV or EPW",
        ],
      },
      {
        name: "Solar geometry",
        features: [
          "Calculate solar position, daylight and indicative shading",
          "Share a scenario URL and export the daily path as CSV",
        ],
      },
    ],
  },
  {
    id: "free-account",
    name: "Free — With account",
    eyebrow: "Expanded workspace",
    description:
      "Create a free account to keep project work together and use the signed-in GIS and Agent capabilities.",
    cta: "Create a free account",
    href: "/sign-up",
    featured: true,
    topics: [
      {
        name: "Everything in open access",
        features: [
          "All public GIS, PVGIS, export and solar-geometry tools",
        ],
      },
      {
        name: "Saved project workspace",
        features: [
          "Save and manage site boundaries as private projects",
          "Preserve screening history and compare a project portfolio",
          "Add optional project and design inputs",
        ],
      },
      {
        name: "Constraint screening and evidence",
        features: [
          "Run terrain, designated-area, flood-reporting, surface-water and infrastructure screens",
          "Create a preliminary screening index with source coverage",
          "Export professional PDF reports and CSV registers",
        ],
      },
      {
        name: "Solar and BESS Agent",
        features: [
          "Ask general or saved-project questions",
          "Use project context and deterministic solar and BESS calculations",
          "Add TXT, MD, CSV or JSON evidence to a selected project session",
        ],
      },
    ],
  },
] as const;

export default function PlansPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f4f5f0] text-[#10271f]">
        <section className="relative overflow-hidden border-b border-[#10271f]/10 px-6 py-16 sm:py-20 lg:py-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 -top-48 h-[32rem] w-[32rem] rounded-full bg-amber-200/30 blur-3xl" />
            <div className="absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-emerald-300/25 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
              Plans
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              Start free, with or without an account
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#536860]">
              Choose immediate access to the public tools or create a free
              account for saved projects, deeper screening and the Solar and
              BESS Agent. Both options currently cost €0.
            </p>
          </div>
        </section>

        <section aria-labelledby="plan-comparison-title" className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 id="plan-comparison-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
                Compare free access
              </h2>
              <p className="mt-4 leading-7 text-[#536860]">
                Features are grouped by the project-development topic they support.
              </p>
            </div>

            <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
              {plans.map((plan) => (
                <article
                  key={plan.id}
                  className={`relative overflow-hidden rounded-3xl border p-6 shadow-sm sm:p-8 ${
                    plan.featured
                      ? "border-emerald-600/35 bg-gradient-to-b from-emerald-50 to-white shadow-xl shadow-emerald-900/10"
                      : "border-[#10271f]/10 bg-white/75"
                  }`}
                >
                  {plan.featured ? (
                    <span className="absolute right-5 top-5 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-800">
                      More functionality
                    </span>
                  ) : null}

                  <p className="pr-36 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                    {plan.eyebrow}
                  </p>
                  <div className="mt-5 flex items-end justify-between gap-5">
                    <h3 className="text-3xl font-bold tracking-tight">{plan.name}</h3>
                    <p className="shrink-0 text-right">
                      <span className="text-3xl font-bold">€0</span>
                      <span className="block text-xs text-[#778a82]">Current price</span>
                    </p>
                  </div>
                  <p className="mt-5 max-w-xl leading-7 text-[#536860]">
                    {plan.description}
                  </p>

                  <div className="mt-8 space-y-7 border-t border-[#10271f]/10 pt-7">
                    {plan.topics.map((topic) => (
                      <section key={topic.name} aria-labelledby={`${plan.id}-${topic.name.replaceAll(" ", "-").toLowerCase()}`}>
                        <h4
                          id={`${plan.id}-${topic.name.replaceAll(" ", "-").toLowerCase()}`}
                          className="font-semibold text-[#10271f]"
                        >
                          {topic.name}
                        </h4>
                        <ul className="mt-3 space-y-2.5">
                          {topic.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-[#29483c]">
                              <span
                                aria-hidden="true"
                                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
                              />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>

                  <Link
                    href={plan.href}
                    className={`mt-9 flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                      plan.featured
                        ? "bg-emerald-500 text-[#071d17] hover:bg-emerald-400"
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

        <section className="border-y border-[#10271f]/10 bg-[#edf0e9] px-6 py-14">
          <div className="mx-auto max-w-4xl rounded-3xl border border-[#10271f]/10 bg-white/70 p-7 text-center sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Future plans
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to expand as paid tiers are introduced
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#536860]">
              This comparison establishes the current free access levels. Paid
              plans can be added here later with clearly defined features,
              limits and pricing.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
