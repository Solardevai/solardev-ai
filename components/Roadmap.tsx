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
      "SolarDev GIS Site Check",
      "SolarDev Solar Geometry Tool",
    ],
    status: "Available",
    state: "complete",
  },
  {
    year: "2026 · Q3",
    number: "03",
    title: "Project Workspace & Solar and BESS Agent",
    description:
      "Connect saved projects, deterministic tools and evidence-labelled engineering guidance in one project-aware workspace.",
    deliverables: [
      "Saved GIS projects and screening index",
      "Source registers, PDF reports and CSV exports",
      "SolarDev Solar and BESS Agent",
    ],
    status: "Live",
    state: "current",
  },
  {
    year: "2026 · Q4",
    number: "04",
    title: "Evidence & Data Expansion",
    description:
      "Extend the live Solar and BESS Agent with richer project documents, jurisdictional evidence, spatial intelligence and team review workflows.",
    deliverables: [
      "PDF and DOCX evidence ingestion",
      "Country-specific authority and market connectors",
      "GIS and PostGIS portfolio intelligence",
      "Collaboration, permissions and review workflows",
    ],
    status: "Planned",
    state: "upcoming",
  },
];

const stateStyles = {
  complete: {
    marker:
      "border-emerald-500 bg-emerald-500 text-[#071d17] shadow-[0_0_0_6px_rgba(16,185,129,0.1)]",
    status:
      "border-emerald-700/15 bg-emerald-100 text-emerald-800",
    card: "border-emerald-700/15 bg-white/75",
    bullet: "bg-emerald-600",
  },
  current: {
    marker:
      "border-emerald-600 bg-[#10271f] text-emerald-300 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]",
    status:
      "border-emerald-700/20 bg-emerald-100 text-emerald-800",
    card:
      "border-emerald-600/35 bg-gradient-to-b from-emerald-50 to-white shadow-xl shadow-emerald-900/10",
    bullet: "bg-emerald-600",
  },
  upcoming: {
    marker:
      "border-[#10271f]/20 bg-[#f4f5f0] text-[#536860] shadow-[0_0_0_6px_rgba(16,39,31,0.04)]",
    status: "border-[#10271f]/10 bg-[#10271f]/5 text-[#536860]",
    card: "border-[#10271f]/10 bg-white/60",
    bullet: "bg-[#778a82]",
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
      className="relative scroll-mt-24 overflow-hidden border-y border-[#10271f]/10 bg-[#f4f5f0] py-16 text-[#10271f] sm:py-20"
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
            className="absolute bottom-5 left-[17px] top-5 w-px bg-[#10271f]/10 md:bottom-auto md:left-[12.5%] md:right-[12.5%] md:top-[17px] md:h-px md:w-auto"
          />
          <div
            aria-hidden="true"
            className="absolute left-[17px] top-5 h-[calc(66.666%-4px)] w-px bg-emerald-400/70 md:left-[12.5%] md:top-[17px] md:h-0.5 md:w-1/2"
          />

          <ol className="relative grid gap-9 md:grid-cols-4 md:gap-5">
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
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#778a82]">
                          Stage {item.number}
                        </p>
                        <p className="mt-1 text-lg font-bold tracking-tight text-[#10271f]">
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
                    <h3 className="text-xl font-semibold text-[#10271f]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#536860]">
                      {item.description}
                    </p>

                    <ul className="mt-auto grid gap-2 border-t border-[#10271f]/10 pt-5">
                      {item.deliverables.map((deliverable) => (
                        <li
                          key={deliverable}
                          className="flex items-start gap-2.5 text-xs font-medium leading-5 text-[#29483c]"
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

          <div className="mt-9 flex items-center justify-center gap-3 text-xs text-[#778a82]">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-emerald-400/60" />
            <span>Knowledge → tools → evidence-led agent</span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-emerald-400/60" />
          </div>
        </div>
      </div>
    </section>
  );
}
