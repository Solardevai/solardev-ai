type RoadmapItem = {
  year: string;
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  status: string;
  state: "complete" | "current" | "upcoming";
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
    state: "complete",
  },
  {
    year: "2026 · Q2",
    number: "02",
    title: "SolarDev AI Tools",
    description:
      "Practical early-stage tools for solar site assessment and solar-angle analysis.",
    deliverables: [
      "Site Assessment - Portugal, Spain, Italy and Germany",
      "Solar Angle",
    ],
    status: "Available",
    state: "complete",
  },
  {
    year: "2026 · Q4",
    number: "03",
    title: "SolarDev AI Platform",
    description:
      "Unify professional AI resources and project-screening capabilities in a structured GIS workspace.",
    deliverables: [
      "Templates & checklists",
      "Site screening - constraints",
      "Automatic reports",
      "GIS platform",
    ],
    status: "Planned",
    state: "upcoming",
  },
];

const stateStyles = {
  complete: {
    marker:
      "border-emerald-300 bg-emerald-400 text-slate-950 shadow-[0_0_0_6px_rgba(52,211,153,0.1)]",
    status:
      "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    card: "border-emerald-400/20 bg-emerald-400/[0.045]",
    bullet: "bg-emerald-400",
  },
  current: {
    marker:
      "border-emerald-300 bg-slate-950 text-emerald-300 shadow-[0_0_0_6px_rgba(52,211,153,0.12)]",
    status:
      "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    card:
      "border-emerald-400/35 bg-gradient-to-b from-emerald-400/[0.075] to-white/[0.025] shadow-2xl shadow-emerald-950/20",
    bullet: "bg-emerald-300",
  },
  upcoming: {
    marker:
      "border-white/20 bg-slate-950 text-slate-400 shadow-[0_0_0_6px_rgba(255,255,255,0.035)]",
    status: "border-white/10 bg-white/[0.035] text-slate-400",
    card: "border-white/10 bg-white/[0.025]",
    bullet: "bg-slate-600",
  },
} as const;

function StageMarker({ item }: { item: RoadmapItem }) {
  const styles = stateStyles[item.state];

  if (item.state === "complete") {
    return (
      <span
        aria-hidden="true"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${styles.marker}`}
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className="h-4 w-4"
        >
          <path
            d="m4.5 10.5 3.25 3.25 7.75-8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  if (item.state === "current") {
    return (
      <span
        aria-hidden="true"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${styles.marker}`}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.85)]" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${styles.marker}`}
    >
      {item.number}
    </span>
  );
}

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
          <h2
            id="roadmap-title"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400"
          >
            Product Roadmap
          </h2>
        </div>

        <div className="relative mx-auto mt-12 max-w-6xl">
          <div
            aria-hidden="true"
            className="absolute bottom-5 left-[17px] top-5 w-px bg-white/10 md:bottom-auto md:left-[16.666%] md:right-[16.666%] md:top-[17px] md:h-px md:w-auto"
          />
          <div
            aria-hidden="true"
            className="absolute left-[17px] top-5 h-[calc(50%-4px)] w-px bg-emerald-400/70 md:left-[16.666%] md:top-[17px] md:h-0.5 md:w-[33.333%]"
          />

          <ol className="relative grid gap-9 md:grid-cols-3 md:gap-5">
            {roadmapItems.map((item) => {
              const styles = stateStyles[item.state];

              return (
                <li
                  key={item.number}
                  className="relative pl-14 md:pl-0"
                >
                  <div className="relative z-10 flex items-center gap-4 md:flex-col md:gap-3">
                    <StageMarker item={item} />

                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3 md:w-full md:flex-col md:justify-start md:text-center">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Stage {item.number}
                        </p>
                        <p className="mt-1 text-lg font-bold tracking-tight text-white">
                          {item.year}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${styles.status}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <article
                    className={`mt-5 flex min-h-64 flex-col rounded-2xl border p-5 transition duration-300 md:mt-6 md:p-6 ${styles.card}`}
                  >
                    <h3 className="text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {item.description}
                    </p>

                    <ul className="mt-auto grid gap-2 border-t border-white/[0.08] pt-5">
                      {item.deliverables.map((deliverable) => (
                        <li
                          key={deliverable}
                          className="flex items-start gap-2.5 text-xs font-medium leading-5 text-slate-300"
                        >
                          <span
                            aria-hidden="true"
                            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${styles.bullet}`}
                          />
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              );
            })}
          </ol>

          <div className="mt-9 flex items-center justify-center gap-3 text-xs text-slate-500">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-emerald-400/60" />
            <span>Knowledge → tools → platform</span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-emerald-400/60" />
          </div>
        </div>
      </div>
    </section>
  );
}
