import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { handbookVolumes } from "@/data/handbookData";

export const metadata: Metadata = {
  title: "Professional Solar & BESS Handbooks",
  description:
    "Explore the SolarDev AI professional handbook series for AI-assisted utility-scale Solar PV and BESS project development.",
  alternates: {
    canonical: "/handbooks",
  },
  openGraph: {
    title: "Professional Solar & BESS Handbooks",
    description:
      "The SolarDev AI professional handbook series for utility-scale renewable-energy project development.",
    url: "https://www.solardev.ai/handbooks",
    type: "website",
    images: [
      {
        url: "/volume-1-cover.png",
        alt: "SolarDev AI professional handbook series",
      },
    ],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "SolarDev AI Professional Handbook Series",
  url: "https://www.solardev.ai/handbooks",
  description:
    "Professional handbooks for AI-assisted utility-scale Solar PV and BESS project development.",
  hasPart: handbookVolumes.map((handbook) => ({
    "@type": "Book",
    name: `${handbook.volume}: ${handbook.title}`,
    url: handbook.href
      ? `https://www.solardev.ai${handbook.href}`
      : "https://www.solardev.ai/handbooks#volume-2",
  })),
};

export default function HandbooksPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-lg font-bold">
            SolarDev <span className="text-amber-400">AI</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Back to homepage
          </Link>
        </div>
      </header>

      <section className="border-b border-white/10 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">
            Professional handbook series
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
            AI-assisted Solar and BESS project development
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            A growing series of professional engineering handbooks,
            controlled workflows and prompt libraries for real
            utility-scale renewable-energy projects.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="space-y-20">
          {handbookVolumes.map((handbook, index) => (
            <section
              key={handbook.id}
              id={handbook.id}
              aria-labelledby={`${handbook.id}-title`}
              className="scroll-mt-12"
            >
              <div
                className={`grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center ${
                  index % 2 === 1
                    ? "lg:grid-cols-[1.25fr_0.75fr]"
                    : ""
                }`}
              >
                <div
                  className={
                    index % 2 === 1
                      ? "lg:order-2"
                      : undefined
                  }
                >
                  {handbook.cover ? (
                    <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/30">
                      <Image
                        src={handbook.cover}
                        alt={`${handbook.volume} handbook cover`}
                        width={708}
                        height={1000}
                        priority={index === 0}
                        className="h-auto w-full"
                      />
                    </div>
                  ) : (
                    <div className="mx-auto flex aspect-[0.708/1] max-w-sm flex-col items-center justify-center overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-slate-900 to-slate-950 p-8 text-center shadow-2xl shadow-black/30">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-400/25 bg-amber-400/10">
                        <span className="text-3xl font-bold text-amber-400">
                          02
                        </span>
                      </div>
                      <p className="mt-8 text-sm font-bold uppercase tracking-[0.22em] text-amber-400">
                        SolarDev AI
                      </p>
                      <p className="mt-3 text-3xl font-bold">
                        Volume 2
                      </p>
                      <p className="mt-4 leading-7 text-slate-400">
                        Updated cover and publication details coming
                        soon.
                      </p>
                    </div>
                  )}
                </div>

                <div
                  className={
                    index % 2 === 1
                      ? "lg:order-1"
                      : undefined
                  }
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
                      {handbook.volume}
                    </p>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${
                        handbook.available
                          ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
                          : "border-amber-400/25 bg-amber-400/10 text-amber-300"
                      }`}
                    >
                      {handbook.status}
                    </span>
                  </div>

                  <h2
                    id={`${handbook.id}-title`}
                    className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl"
                  >
                    {handbook.title}
                  </h2>
                  <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                    {handbook.description}
                  </p>

                  <dl className="mt-8 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">
                        Edition
                      </dt>
                      <dd className="mt-2 font-semibold text-white">
                        {handbook.edition}
                      </dd>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">
                        Pages
                      </dt>
                      <dd className="mt-2 font-semibold text-white">
                        {handbook.pages ?? "To be confirmed"}
                      </dd>
                    </div>
                    <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:col-span-1">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">
                        Chapters
                      </dt>
                      <dd className="mt-2 font-semibold text-white">
                        {handbook.chapters ??
                          "To be confirmed"}
                      </dd>
                    </div>
                  </dl>

                  {handbook.href && handbook.cta ? (
                    <Link
                      href={handbook.href}
                      className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                      {handbook.cta}
                    </Link>
                  ) : (
                    <p className="mt-8 max-w-2xl rounded-xl border border-white/10 bg-white/[0.025] px-5 py-4 text-sm leading-6 text-slate-400">
                      Publication details, preview pages and purchase
                      information will be added when the updated
                      edition is ready.
                    </p>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
