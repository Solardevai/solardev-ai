import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SolarSiteScreeningMap from "@/components/SolarSiteScreeningMap";

const SITE_URL = "https://www.solardev.ai/tools/solar-site-screening";

export const metadata: Metadata = {
  title: "Free Solar Site Screening & PVGIS Yield Tool",
  description:
    "Measure a solar-site boundary, calculate area and perimeter, review indicative grid context, estimate PVGIS specific yield and export the boundary as KMZ, KML or GeoJSON.",
  alternates: { canonical: "/tools/solar-site-screening" },
  openGraph: {
    title: "Free Solar Site Screening & PVGIS Yield Tool",
    description:
      "Draw a candidate solar site, calculate its geometry, run an indicative PVGIS yield check and export the boundary.",
    url: SITE_URL,
    type: "website",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "SolarDev AI solar site screening and PVGIS yield tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Solar Site Screening & PVGIS Yield Tool",
    description:
      "Draw a candidate solar site, calculate its geometry, run an indicative PVGIS yield check and export the boundary.",
    images: ["/opengraph-image.jpg"],
  },
};

const faqs = [
  {
    question: "Is Site Check a solar-project feasibility study?",
    answer:
      "No. It is an early-stage screening tool. Its measurements, map context and PVGIS result help structure initial questions, but they do not replace site surveys, grid studies, planning review or professional due diligence.",
  },
  {
    question: "What does the PVGIS estimate represent?",
    answer:
      "The tool requests an indicative annual specific-yield result at the drawn boundary centroid using a 1 kWp fixed system, optimum inclination and 14% assumed system losses. It is not a project energy-yield assessment.",
  },
  {
    question: "Can I export the solar-site boundary?",
    answer:
      "Yes. The drawn boundary can be downloaded as KMZ, KML or GeoJSON. KMZ is selected by default for convenient use in common GIS and virtual-globe workflows.",
  },
  {
    question: "Do the infrastructure layers confirm grid capacity?",
    answer:
      "No. Roads, power lines and substations are indicative OpenStreetMap context only. Proximity does not demonstrate capacity, a viable connection point, ownership, availability or connection feasibility.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["SoftwareApplication", "WebApplication"],
      "@id": `${SITE_URL}#application`,
      name: "SolarDev AI Site Check",
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Solar site screening tool",
      operatingSystem: "Web browser",
      browserRequirements: "Requires JavaScript and a modern web browser",
      description:
        "A free screening tool for measuring solar-site boundaries, reviewing indicative map context and requesting a preliminary PVGIS specific-yield result.",
      featureList: [
        "Satellite site map",
        "Boundary area and perimeter calculation",
        "Boundary centroid",
        "Indicative PVGIS specific-yield estimate",
        "Indicative OpenStreetMap infrastructure context",
        "KMZ, KML and GeoJSON boundary export",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      provider: {
        "@id": "https://www.solardev.ai/#organization",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.solardev.ai/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Site Check",
          item: SITE_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function SolarSiteScreeningPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 lg:px-8">
          <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.14),transparent_65%)]" />
          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto mb-10 max-w-4xl text-center">
              <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Free public beta
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Free Solar Site Screening and{" "}
                <span className="text-emerald-400">PVGIS Yield Tool</span>
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Draw a candidate utility-scale solar site on satellite imagery,
                measure its boundary and obtain an indicative PVGIS
                specific-yield result at the site centroid. Review mapped
                infrastructure context and export the boundary for further GIS
                screening.
              </p>
            </div>

            <SolarSiteScreeningMap />

            <div className="mt-6 grid gap-4 text-sm text-slate-400 sm:grid-cols-3">
              <p>
                <strong className="block text-white">1. Find</strong>
                Search by address, place name or coordinates.
              </p>
              <p>
                <strong className="block text-white">2. Draw</strong>
                Define the site to calculate gross area and perimeter.
              </p>
              <p>
                <strong className="block text-white">3. Check and export</strong>
                Run the PVGIS pre-check and download KMZ, KML or GeoJSON.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-slate-900/35 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Screening outputs
              </p>
              <h2 className="mt-3 text-3xl font-bold">
                What the solar site tool calculates
              </h2>
              <p className="mt-4 leading-7 text-slate-400">
                The tool combines user-defined geometry with a preliminary
                solar-resource request. Outputs are intended to support
                opportunity screening and the definition of follow-up work.
              </p>
            </div>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Gross site area", "Area inside the user-drawn boundary, reported in square metres or hectares."],
                ["Boundary perimeter", "Indicative perimeter length calculated from the drawn coordinates."],
                ["Site centroid", "A representative point used to request the preliminary PVGIS result."],
                ["Specific yield", "Modelled annual kWh/kWp at the centroid using the assumptions shown in the tool."],
                ["Infrastructure context", "Indicative mapped roads, voltage-class lines and substations at scale-dependent zooms."],
                ["GIS-ready exports", "Download the boundary as KMZ, KML or GeoJSON for continued screening."],
              ].map(([title, description]) => (
                <article key={title} className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
            <article className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Methodology
              </p>
              <h2 className="mt-3 text-2xl font-bold">How the screening works</h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-400">
                <p>
                  Search results and map clicks define WGS84 coordinates. The
                  browser calculates boundary area, perimeter and centroid from
                  those coordinates.
                </p>
                <p>
                  The PVGIS v5.3 request uses the centroid with a 1 kWp fixed
                  system, optimum inclination and 14% assumed system losses.
                  The displayed result is a modelled screening value, not a P50
                  or bankable energy-yield assessment.
                </p>
                <p>
                  Infrastructure overlays are derived from OpenStreetMap and
                  depend on contributor coverage and live data availability.
                </p>
              </div>
            </article>

            <article className="rounded-3xl border border-amber-400/15 bg-amber-400/[0.045] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                Important limitations
              </p>
              <h2 className="mt-3 text-2xl font-bold">What Site Check does not assess</h2>
              <ul className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                {[
                  "Grid capacity or connection feasibility",
                  "Environmental and planning constraints",
                  "Flood, drainage or terrain suitability",
                  "Land ownership and project rights",
                  "Geotechnical conditions",
                  "Detailed layout or energy yield",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-amber-300">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="border-t border-white/10 bg-slate-900/25 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold">Solar site screening FAQs</h2>
            <div className="mt-7 space-y-3">
              {faqs.map((faq) => (
                <details key={faq.question} className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <summary className="cursor-pointer font-semibold text-white">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{faq.answer}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm leading-6 text-slate-300">
                Continue the assessment with solar geometry, or use the
                professional site-screening methodology in Volume 1.
              </p>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Link href="/tools/sun-path" className="font-semibold text-amber-300 hover:text-amber-200">
                  Sun-position tool →
                </Link>
                <Link href="/solar-bess-project-development-handbook" className="font-semibold text-emerald-300 hover:text-emerald-200">
                  Volume 1 →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
