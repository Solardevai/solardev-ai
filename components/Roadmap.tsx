type RoadmapItem = {
  year: string;
  title: string;
  description: string;
  status: string;
  active?: boolean;
};

const roadmapItems: RoadmapItem[] = [
  {
    year: "2026",
    title: "Professional Handbook Series",
    description:
      "Launch Volume 1 and continue developing professional Solar PV and BESS engineering content.",
    status: "Current phase",
    active: true,
  },
  {
    year: "2027",
    title: "SolarDev AI Platform",
    description:
      "Introduce searchable prompts, engineering templates and interactive project-development workflows.",
    status: "Planned",
  },
];

export default function Roadmap() {
  return (
    <section
      id="roadmap"
      aria-labelledby="roadmap-title"
      className="relative scroll-mt-24 overflow-hidden border-y border-white/10 bg-slate-950 py-20 sm:py-24"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">
            Product Roadmap
          </p>

          <h2
            id="roadmap-title"
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Building SolarDev AI step by step
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            From professional engineering handbooks to a practical AI-assisted
            project-development platform.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto mt-14 max-w-4xl">
          {/* Desktop horizontal line */}
          <div
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-5 hidden h-px bg-white/15 md:block"
          />

          {/* Mobile vertical line */}
          <div
            aria-hidden="true"
            className="absolute bottom-8 left-[19px] top-5 w-px bg-white/15 md:hidden"
          />

          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            {roadmapItems.map((item) => (
              <article
                key={item.year}
                className="relative grid grid-cols-[40px_1fr] gap-5 md:block md:text-center"
              >
                {/* Timeline marker */}
                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border ${
                    item.active
                      ? "border-amber-400 bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/15"
                      : "border-white/20 bg-slate-950 text-slate-400"
                  } md:mx-auto`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 rounded-full ${
                      item.active ? "bg-slate-950" : "bg-slate-500"
                    }`}
                  />
                </div>

                {/* Timeline content */}
                <div className="pb-4 md:mt-6">
                  <p
                    className={`text-3xl font-bold tracking-tight ${
                      item.active ? "text-amber-400" : "text-white"
                    }`}
                  >
                    {item.year}
                  </p>

                  <h3 className="mt-3 text-xl font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400 sm:text-base">
                    {item.description}
                  </p>

                  <span
                    className={`mt-5 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                      item.active
                        ? "border-amber-400/25 bg-amber-400/10 text-amber-300"
                        : "border-white/10 bg-white/[0.03] text-slate-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}