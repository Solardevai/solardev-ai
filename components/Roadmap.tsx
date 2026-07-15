import { roadmapItems, siteConfig } from "@/data/siteData";

export default function Roadmap() {
  return (
    <section
      id="roadmap"
      className="relative scroll-mt-24 overflow-hidden border-b border-white/10 bg-slate-950"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              Product roadmap
            </p>

            <h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Building a complete AI platform for renewable-energy professionals
            </h2>
          </div>

          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            Volume 1 is the foundation. Future SolarDev AI products will expand
            into advanced project-development applications, engineering
            toolkits, searchable prompt libraries and professional workflows.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {roadmapItems.map((item, index) => (
            <article
              key={`${item.volume}-${item.title}`}
              className={`relative overflow-hidden rounded-3xl border p-8 transition duration-300 hover:-translate-y-1 ${
                item.active
                  ? "border-amber-400/30 bg-amber-400/[0.06]"
                  : "border-white/10 bg-white/[0.025]"
              }`}
            >
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-amber-400/5 blur-3xl" />

              <div className="relative">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
                      {item.volume}
                    </p>

                    <h3 className="mt-4 text-2xl font-bold text-white">
                      {item.title}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      item.active
                        ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                        : "border-white/10 bg-white/[0.03] text-slate-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-sm font-bold text-amber-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="h-px flex-1 bg-gradient-to-r from-amber-400/50 to-transparent" />
                </div>

                <p className="mt-7 leading-7 text-slate-400">
                  {getRoadmapDescription(index)}
                </p>

                {item.active && (
                  <a
                    href={siteConfig.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex rounded-xl bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300"
                  >
                    Get Volume 1 — €{siteConfig.product.launchPrice}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-white/10 bg-slate-900/70 p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">
                Future development
              </p>

              <h3 className="mt-4 text-3xl font-bold text-white">
                SolarDev AI will evolve beyond handbooks
              </h3>

              <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                Planned development includes professional templates,
                interactive engineering workflows, searchable prompt systems,
                training resources and future AI-assisted project-development
                tools.
              </p>
            </div>

            <a
              href={`mailto:${siteConfig.infoEmail}?subject=SolarDev%20AI%20Roadmap`}
              className="shrink-0 rounded-xl border border-white/15 px-7 py-4 text-center font-semibold text-white transition hover:border-amber-400/30 hover:bg-amber-400/[0.06]"
            >
              Discuss the Roadmap
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function getRoadmapDescription(index: number) {
  const descriptions = [
    "The current Publisher Edition establishes responsible AI-assisted engineering practice and the complete early-stage Solar PV and BESS development sequence.",
    "Advanced applications will extend the methodology into broader multidisciplinary development, design coordination and decision support.",
    "A practical library of professional templates, checklists, registers and repeatable engineering workflows.",
    "A searchable platform for professional prompts, structured by project stage, engineering discipline and required deliverable.",
  ];

  return descriptions[index] ?? "";
}