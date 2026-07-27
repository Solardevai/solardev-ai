type RoadmapItem = {
  year: string;
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  status: string;
  active?: boolean;
};

const roadmapItems: RoadmapItem[] = [
  {
    year: "2026",
    number: "01",
    title: "Professional Handbook Series",
    description:
      "A two-volume field reference covering the full utility-scale Solar PV and BESS project lifecycle.",
    deliverables: ["Volume 1 available", "Volume 2 available"],
    status: "Current",
    active: true,
  },
  {
    year: "2026",
    number: "02",
    title: "SolarDev AI Platform",
    description:
      "Turning the handbook methodology into practical tools for everyday solar and BESS project work.",
    deliverables: ["Prompt library & templates", "Solar Site Quick Check"],
    status: "Ongoing",
    active: true,
  },
];

export default function Roadmap() {
  return (
    <section
      id="roadmap"
      aria-labelledby="roadmap-title"
      className="relative scroll-mt-24 overflow-hidden border-y border-white/10 bg-slate-950 py-16 sm:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.04] blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
            Product Roadmap
          </p>
          <h2
            id="roadmap-title"
            className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Built in two focused stages
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-400">
            First, trusted professional knowledge. Next, practical tools that
            put that knowledge to work.
          </p>
        </div>

        <div className="relative mx-auto mt-10 max-w-4xl">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
            {roadmapItems.map((item) => (
              <div key={item.number} className="contents">
                {item.number === "02" && (
                  <div
                    aria-hidden="true"
                    className="flex items-center justify-center py-1 md:px-1"
                  >
                    <span className="h-8 w-px bg-gradient-to-b from-emerald-400 to-white/20 md:h-px md:w-10 md:bg-gradient-to-r" />
                    <span className="-ml-1 h-2 w-2 rotate-45 border-r border-t border-white/30 md:-ml-2" />
                  </div>
                )}

                <article
                  className={`flex min-h-72 flex-col rounded-2xl border p-6 ${
                    item.active
                      ? "border-emerald-400/30 bg-emerald-400/[0.055]"
                      : "border-white/10 bg-white/[0.025]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Stage {item.number}
                      </p>
                      <p
                        className={`mt-2 text-3xl font-bold ${
                          item.active ? "text-emerald-400" : "text-white"
                        }`}
                      >
                        {item.year}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                        item.active
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                          : "border-white/10 bg-white/[0.03] text-slate-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>

                  <ul className="mt-auto grid gap-2 pt-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                    {item.deliverables.map((deliverable) => (
                      <li
                        key={deliverable}
                        className="flex items-center gap-2 text-xs font-medium text-slate-300"
                      >
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            item.active ? "bg-emerald-400" : "bg-slate-600"
                          }`}
                        />
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
