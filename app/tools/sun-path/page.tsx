import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SunPathTool from "@/components/SunPathTool";

const PAGE_URL = "https://www.solardev.ai/tools/sun-path";

export const metadata: Metadata = {
  title: "SolarDev Solar Geometry Tool",
  description:
    "Calculate solar azimuth, elevation, zenith, sunrise, sunset and indicative flat-ground shading by coordinates, date, local time and object height.",
  alternates: { canonical: "/tools/sun-path" },
  openGraph: {
    title: "SolarDev Solar Geometry Tool",
    description:
      "Explore sun direction, solar elevation and indicative shadow geometry on an interactive satellite map.",
    url: PAGE_URL,
    type: "website",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "SolarDev AI solar sun position and shading calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SolarDev Solar Geometry Tool",
    description:
      "Explore sun direction, solar elevation and indicative shadow geometry on an interactive satellite map.",
    images: ["/opengraph-image.jpg"],
  },
};

const faqs = [
  {
    question: "What is solar azimuth?",
    answer:
      "Solar azimuth is the horizontal compass direction of the sun, expressed clockwise from true north: 0° north, 90° east, 180° south and 270° west.",
  },
  {
    question: "What is solar elevation?",
    answer:
      "Solar elevation is the angle of the sun above the horizon. Low elevation produces longer flat-ground shadows; negative elevation means the sun is below the calculated horizon.",
  },
  {
    question: "How is shading length calculated?",
    answer:
      "For a vertical object on flat ground, indicative shadow length is calculated as object height divided by the tangent of solar elevation. The result does not account for terrain, ground slope, object width or horizon obstructions.",
  },
  {
    question: "Does this replace a detailed PV shading study?",
    answer:
      "No. The tool is for solar-geometry screening. Detailed PV design requires verified time-zone inputs, terrain and horizon data, table geometry, row spacing, tracking behaviour and an appropriate simulation method.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["SoftwareApplication", "WebApplication"],
      "@id": `${PAGE_URL}#application`,
      name: "SolarDev Solar Geometry Tool",
      url: PAGE_URL,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Solar geometry calculator",
      operatingSystem: "Web browser",
      browserRequirements: "Requires JavaScript and a modern web browser",
      description:
        "A free browser-based calculator for solar azimuth, elevation, daily events and indicative flat-ground shading.",
      featureList: [
        "Satellite map location selection",
        "Solar azimuth, elevation and zenith",
        "Sunrise and sunset estimates",
        "Time-of-day slider",
        "Indicative flat-ground shading length and direction",
        "Daily solar-elevation chart",
        "Shareable scenario URL",
        "Daily CSV export",
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
          name: "Solar Geometry Tool",
          item: PAGE_URL,
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

export default function SunPathPage() {
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
        <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.13),transparent_68%)]" />
          <div className="relative mx-auto max-w-[1440px]">
            <div className="mb-9 max-w-4xl">
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                  Free engineering tool
                </span>
                <span className="text-xs text-slate-500">Public beta</span>
              </div>
              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                SolarDev <span className="text-amber-400">Solar Geometry Tool</span>
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Calculate solar azimuth, elevation, daily solar events and
                indicative flat-ground shading for a selected location, date
                and local time. Explore the geometry directly on satellite
                imagery and export the daily solar path.
              </p>
            </div>

            <SunPathTool />

            <div className="mt-6 grid gap-4 text-sm text-slate-400 sm:grid-cols-3">
              <p>
                <strong className="block text-white">1. Locate</strong>
                Search an address, paste coordinates or click the map.
              </p>
              <p>
                <strong className="block text-white">2. Explore</strong>
                Change date and time to inspect sun and shading direction.
              </p>
              <p>
                <strong className="block text-white">3. Share or export</strong>
                Copy the scenario URL or download the daily values as CSV.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-slate-900/35 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              Solar geometry
            </p>
            <h2 className="mt-3 text-3xl font-bold">What the calculator shows</h2>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Solar azimuth", "The sun’s clockwise direction from true north."],
                ["Solar elevation", "The sun’s angular height above the calculated horizon."],
                ["Solar zenith", "The angular distance between the sun and the vertical direction."],
                ["Daily events", "Indicative sunrise, sunset and daylight period for the selected day."],
                ["Shading length", "Flat-ground shadow length for the selected vertical object height."],
                ["Daily profile", "A chart and CSV series of solar elevation and azimuth through the day."],
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
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                Calculation method
              </p>
              <h2 className="mt-3 text-2xl font-bold">Indicative sun and shadow geometry</h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-400">
                <p>
                  Solar position uses the NOAA fractional-year approximation
                  with the selected coordinates, date, local clock time and
                  editable UTC offset. The daily path and events are sampled at
                  15-minute intervals. Azimuth uses true geographic north
                  rather than magnetic north.
                </p>
                <p>
                  For positive solar elevation, the tool applies the
                  flat-ground relationship <span className="font-mono text-slate-200">L = H / tan(α)</span>,
                  where H is vertical object height and α is solar elevation.
                  Shading direction is opposite the solar azimuth.
                </p>
              </div>
            </article>

            <article className="rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.04] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                Screening limitations
              </p>
              <h2 className="mt-3 text-2xl font-bold">Not a detailed PV shading study</h2>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                {[
                  "Confirm the UTC offset and daylight-saving treatment for the selected date.",
                  "Ground slope, terrain and horizon obstructions are not modelled.",
                  "Object width, PV table geometry and row-to-row shading are not included.",
                  "Map vectors are visual direction indicators and are not drawn to geographic scale.",
                  "Tracker rotation, backtracking and diffuse irradiance are not simulated.",
                  "Use verified engineering software and site data for design decisions.",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-cyan-300">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="border-t border-white/10 bg-slate-900/25 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold">Sun-position and shading FAQs</h2>
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
                Apply the solar geometry within a candidate site screen or
                continue with the wider development methodology.
              </p>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Link href="/tools/solar-site-screening" className="font-semibold text-emerald-300 hover:text-emerald-200">
                  SolarDev GIS Site Check →
                </Link>
                <Link href="/handbooks" className="font-semibold text-amber-300 hover:text-amber-200">
                  Handbooks →
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
