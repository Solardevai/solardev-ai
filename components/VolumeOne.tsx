import Link from "next/link";
import {
  chapters,
  siteConfig,
} from "@/data/siteData";

export default function VolumeOne() {
  return (
    <section
      id="volume-1"
      aria-labelledby="volume-one-title"
      className="relative scroll-mt-24 overflow-hidden border-y border-white/10 bg-slate-950 py-20 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Volume 1
            </p>

            <h2
              id="volume-one-title"
              className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              {siteConfig.product.subtitle}
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              A structured methodology for using AI
              responsibly across early-stage
              utility-scale Solar PV and BESS project
              development.
            </p>

            <p className="mt-4 max-w-xl leading-7 text-slate-400">
              Progress from controlled AI practice and
              technical due diligence through site
              screening, development planning, project
              risk and initial CAPEX assessment.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/solar-bess-project-development-handbook"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-emerald-400/40 hover:bg-white/5"
              >
                View handbook details
              </Link>

              <a
                href={siteConfig.checkoutUrl}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-emerald-300"
              >
                Get Volume 1
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="grid md:grid-cols-2">
              {chapters.map((chapter) => (
                <article
                  key={chapter.number}
                  className="flex gap-4 border-b border-white/10 p-5 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 md:[&:nth-child(odd)]:border-r md:[&:nth-child(odd)]:border-white/10"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-xs font-bold text-emerald-300">
                    {chapter.number}
                  </span>

                  <div>
                    <h3 className="font-semibold leading-6 text-white">
                      {chapter.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {chapter.shortTitle}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}