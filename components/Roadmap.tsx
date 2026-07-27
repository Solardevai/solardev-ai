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
    year: "2026 · Q1",
    number: "01",
    title: "Professional Handbook Series",
    description:
      "Two complementary references addressing key decisions from early development through operations.",
    deliverables: ["Volume 1 available", "Volume 2 available"],
    status: "Delivered",
    active: true,
  },
  {
    year: "2026 · Q2",
    number: "02",
    title: "Prompt Library & Templates",
    description:
      "Development started on reusable AI workflows and structured professional project resources.",
    deliverables: ["Searchable prompt library", "Templates & checklists"],
    status: "In development",
    active: true,
  },
  {
    year: "2026 · Q4",
    number: "03",
    title: "Site Check Expansion",
    description:
      "Build on the public beta with environmental and terrain constraints and a structured screening summary.",
    deliverables: ["Public beta available", "Constraint screening planned"],
    status: "Planned",
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

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
            Product Roadmap
          </p>
          <h2
            id="roadmap-title"
            className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Built across three 2026 milestones
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-400">
            Delivered professional knowledge, followed by reusable workflows
            and a progressively more capable Site Check.
          </p>
        </div>

        <div className="relative mx-auto mt-10 max-w-6xl">
          <div className="grid gap-4 md:grid-cols-3 md:items-stretch">
            {roadmapItems.map((item) => (
              <div key={item.number} className="contents">
                <article
                  className={`flex min-h-80 flex-col rounded-2xl border p-6 ${
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

                  <ul className="mt-auto grid gap-2 pt-6">
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
