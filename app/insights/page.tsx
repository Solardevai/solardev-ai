import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { workflowGuides } from "@/data/workflowGuides";

export const metadata: Metadata = {
  title: "Solar & BESS Development Workflow Library",
  description:
    "Practical utility-scale solar and BESS development guides covering site screening, engineering, grid, due diligence and project controls.",
  alternates: { canonical: "/insights" },
};

const librarySchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "SolarDev AI workflow library",
  description: metadata.description,
  url: "https://www.solardev.ai/insights",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: workflowGuides.length,
    itemListElement: workflowGuides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.solardev.ai/insights/${guide.slug}`,
      name: guide.title,
    })),
  },
};

export default function InsightsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(librarySchema).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(52,211,153,.12),transparent_40%)]">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
              Professional workflow library
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
              Practical solar and BESS development guides
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Decision-focused guidance for site screening, engineering,
              development controls and technical due diligence. Each guide
              defines the questions, evidence, workflow, outputs and limits.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tools/solar-site-screening"
                className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300"
              >
                Open SolarDev GIS Site Check
              </Link>
              <Link
                href="/agents/project-development"
                className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.06]"
              >
                Preview development agent
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {workflowGuides.map((guide) => (
              <article
                key={guide.slug}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-0.5 hover:border-emerald-300/30"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                  {guide.category}
                </p>
                <h2 className="mt-3 text-xl font-semibold leading-7">
                  {guide.title}
                </h2>
                <p className="mt-4 flex-1 text-sm leading-6 text-slate-400">
                  {guide.description}
                </p>
                <Link
                  href={`/insights/${guide.slug}`}
                  className="mt-6 text-sm font-semibold text-emerald-300 hover:text-emerald-200"
                >
                  Read workflow →
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
