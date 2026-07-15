import { features } from "@/data/siteData";

const featureDetails = [
  {
    supportingText:
      "Each workflow begins with the engineering objective, project evidence, applicable constraints and required decision.",
    points: [
      "Real project-development activities",
      "Structured decision sequences",
      "Clear professional deliverables",
    ],
  },
  {
    supportingText:
      "AI outputs are treated as draft analysis requiring verification, traceability and qualified professional review.",
    points: [
      "Explicit assumptions and gaps",
      "Evidence and source control",
      "Engineering validation gates",
    ],
  },
  {
    supportingText:
      "The methodology reflects multidisciplinary utility-scale Solar PV and BESS development rather than generic productivity advice.",
    points: [
      "Solar PV and BESS focus",
      "Consultant-grade prompt design",
      "Decision-ready communication",
    ],
  },
];

export default function Features() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-slate-900/45">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              Why SolarDev AI
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Professional AI built around engineering responsibility
            </h2>
          </div>

          <div>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              SolarDev AI does not present artificial intelligence as an
              engineering authority. It provides controlled methods for using AI
              to organise evidence, accelerate analysis and prepare stronger
              project-development outputs.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {features.map((feature, index) => {
            const detail = featureDetails[index];

            return (
              <article
                key={feature.number}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-8 transition duration-300 hover:-translate-y-1 hover:border-amber-400/25"
              >
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-amber-400/5 blur-3xl transition group-hover:bg-amber-400/10" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold tracking-[0.2em] text-amber-400">
                      {feature.number}
                    </span>

                    <span className="h-px w-16 bg-gradient-to-r from-amber-400/60 to-transparent" />
                  </div>

                  <h3 className="mt-8 text-2xl font-bold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-400">
                    {feature.description}
                  </p>

                  <p className="mt-5 leading-7 text-slate-300">
                    {detail.supportingText}
                  </p>

                  <ul className="mt-7 space-y-3">
                    {detail.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm text-slate-300"
                      >
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 text-xs font-bold text-amber-300">
                          ✓
                        </span>

                        <span className="leading-6">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-amber-400/20 bg-amber-400/[0.045] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/25 bg-amber-400/10">
              <span className="text-2xl text-amber-300">✓</span>
            </div>

            <div>
              <p className="font-semibold text-white">
                Core professional principle
              </p>

              <p className="mt-2 max-w-4xl leading-7 text-slate-300">
                AI should increase the time available for engineering judgement,
                investigation and optimisation. It should never reduce the need
                for validation, accountability or qualified professional review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}