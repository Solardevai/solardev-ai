import { chapters, siteConfig } from "@/data/siteData";

export default function VolumeOne() {
  const { product } = siteConfig;

  return (
    <section
      id="volume-1"
      className="relative overflow-hidden border-b border-white/10 bg-slate-950"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10rem] top-24 h-[30rem] w-[30rem] rounded-full bg-amber-400/5 blur-3xl" />
        <div className="absolute left-[-10rem] bottom-0 h-[28rem] w-[28rem] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr]">
          {/* Introduction */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              Volume 1
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {product.subtitle}
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              A complete early-stage development sequence for responsible,
              traceable and decision-focused AI-assisted Solar PV and BESS
              project development.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <Metric value={`${product.pages}`} label="Pages" />
              <Metric value={`${product.chapters}`} label="Chapters" />
              <Metric
                value={`${product.promptLevels}`}
                label="Prompt levels"
              />
              <Metric value="PDF" label="Digital edition" />
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                End-state
              </p>

              <p className="mt-3 leading-7 text-slate-300">
                A structured early-stage development basis supporting informed
                project progression, targeted studies, accountable risk
                ownership and a transparent initial investment view.
              </p>
            </div>

            <a
              href={siteConfig.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-xl bg-amber-400 px-7 py-4 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Get Volume 1 — €{product.launchPrice}
            </a>
          </div>

          {/* Chapters */}
          <div className="space-y-5">
            {chapters.map((chapter, index) => (
              <article
                key={chapter.number}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/65 p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-400/25 sm:p-8"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 opacity-70" />

                <div className="grid gap-6 sm:grid-cols-[90px_1fr]">
                  <div>
                    <span className="text-4xl font-bold tracking-tight text-white/15 transition group-hover:text-amber-400/35">
                      {chapter.number}
                    </span>

                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
                      Chapter
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {chapter.title}
                    </h3>

                    <p className="mt-4 leading-7 text-slate-400">
                      {chapter.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {getChapterTags(index).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Development sequence */}
        <div className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
            Development sequence
          </p>

          <h3 className="mt-4 max-w-3xl text-3xl font-bold text-white">
            From responsible AI practice to an initial investment basis
          </h3>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.number}
                className="relative rounded-2xl border border-white/10 bg-white/[0.025] p-5"
              >
                <span className="text-sm font-semibold text-amber-400">
                  {chapter.number}
                </span>

                <p className="mt-3 text-sm font-semibold leading-6 text-white">
                  {chapter.shortTitle}
                </p>

                {index < chapters.length - 1 && (
                  <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-slate-600 lg:block">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type MetricProps = {
  value: string;
  label: string;
};

function Metric({ value, label }: MetricProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <strong className="block text-2xl font-bold text-white">{value}</strong>
      <span className="mt-1 block text-sm text-slate-500">{label}</span>
    </div>
  );
}

function getChapterTags(index: number) {
  const tags = [
    ["Prompt design", "Validation", "Accountability"],
    ["Research", "Evidence", "Due diligence"],
    ["Constraints", "Fatal flaws", "Site scoring"],
    ["Workstreams", "Decision gates", "RTB"],
    ["Ownership", "Land rights", "Parcel strategy"],
    ["Terrain", "Access", "Drainage"],
    ["Field evidence", "HSE", "Reporting"],
    ["Permitting", "Surveys", "Mitigation"],
    ["Risk ownership", "Treatment", "Residual risk"],
    ["Benchmarking", "Contingency", "Sensitivity"],
  ];

  return tags[index] ?? [];
}