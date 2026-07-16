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
      className="scroll-mt-24 border-y border-white/10 bg-slate-950 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
            Product Roadmap
          </p>

          <h2
            id="roadmap-title"
            className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            From handbook to platform
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-400">
            Building practical AI resources for utility-scale Solar PV and
            BESS project development.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto mt-12 max-w-4xl">
          {/* Desktop connecting line */}
          <div
            aria-hidden="true"
            className="absolute left-1/4 right-1/4 top-[11px] hidden h-px bg-white/15 md:block"
          />

          {/* Mobile connecting line */}
          <div
            aria-hidden="true"
            className="absolute bottom-4 left-[5px] top-2 w-px bg-white/15 md:hidden"
          />

          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            {roadmapItems.map((item) => (
              <article
                key={item.year}
                className="relative pl-8 md:pl-0 md:text-center"
              >
                {/* Marker */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1 h-3 w-3 rounded-full border md:relative md:left-auto md:top-auto md:mx-auto md:block ${
                    item.active
                      ? "border-amber-400 bg-amber-400"
                      : "border-slate-500 bg-slate-950"
                  }`}
                />

                <div className="md:mt-5">
                  <div className="flex flex-wrap items-center gap-3 md:justify-center">
                    <p
                      className={`text-2xl font-bold ${
                        item.active ? "text-amber-400" : "text-white"
                      }`}
                    >
                      {item.year}
                    </p>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                        item.active
                          ? "border-amber-400/25 text-amber-300"
                          : "border-white/10 text-slate-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}