type Feature = {
  number: string;
  title: string;
  description: string;
  points: string[];
};

const features: Feature[] = [
  {
    number: "01",
    title: "Engineering First",
    description:
      "Professional engineering methodology remains the foundation of every workflow, prompt and decision-support framework.",
    points: [
      "Structured project-development workflows",
      "Clear assumptions and evidence requirements",
      "Decision-focused engineering outputs",
    ],
  },
  {
    number: "02",
    title: "AI With Control",
    description:
      "AI is used inside controlled professional workflows rather than as an unverified source of technical conclusions.",
    points: [
      "Traceable inputs and assumptions",
      "Uncertainty and limitation checks",
      "Mandatory professional validation",
    ],
  },
  {
    number: "03",
    title: "Practitioner-Led",
    description:
      "The handbook is built around real utility-scale Solar PV and BESS project-development activities and deliverables.",
    points: [
      "Utility-scale project context",
      "Consultant-grade prompt structures",
      "Practical engineering review checklists",
    ],
  },
];

export default function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative overflow-hidden bg-slate-950 py-20 sm:py-24 lg:py-28"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-0 top-1/4 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
            Why SolarDev AI
          </p>

          <h2
            id="features-title"
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Engineering workflows, not isolated prompts
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            SolarDev AI combines professional engineering methodology with
            controlled AI assistance to support reliable, traceable and
            decision-ready project-development work.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.055] sm:p-7"
            >
              <div
                aria-hidden="true"
                className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-emerald-400/[0.04] transition duration-300 group-hover:bg-emerald-400/[0.08]"
              />

              <div className="relative">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-sm font-bold text-emerald-300">
                  {feature.number}
                </span>

                <h3 className="mt-6 text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
                  {feature.description}
                </p>

                <ul className="mt-6 space-y-3 border-t border-white/10 pt-5">
                  {feature.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-300"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"
                      />

                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Professional principle */}
        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-7 text-center sm:px-10">
          <p className="text-base leading-7 text-slate-300">
            AI-generated outputs are treated as draft analysis requiring
            verification before they are used in project decisions,
            engineering deliverables or investment recommendations.
          </p>
        </div>
      </div>
    </section>
  );
}