type Chapter = {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
};

const chapters: Chapter[] = [
  {
    number: "01",
    title: "AI Foundations for Engineering Practice",
    description:
      "Establishes the principles, controls and professional responsibilities required for reliable AI-assisted engineering work.",
    deliverables: [
      "Controlled AI workflow",
      "Evidence and assumption checks",
      "Professional validation framework",
    ],
  },
  {
    number: "02",
    title: "Technical Due Diligence",
    description:
      "Structures multidisciplinary technical reviews for early-stage Solar PV and BESS opportunities.",
    deliverables: [
      "Due-diligence workflow",
      "Evidence register",
      "Technical findings structure",
    ],
  },
  {
    number: "03",
    title: "Site Feasibility and Constraint Screening",
    description:
      "Supports the initial identification of technical, environmental, grid, land and development constraints.",
    deliverables: [
      "Site-screening matrix",
      "Constraint register",
      "Preliminary go/no-go basis",
    ],
  },
  {
    number: "04",
    title: "Project Development Roadmap",
    description:
      "Converts an early-stage opportunity into a structured sequence of studies, approvals, decisions and development gates.",
    deliverables: [
      "Development workplan",
      "Decision-gate structure",
      "Responsibility and dependency mapping",
    ],
  },
  {
    number: "05",
    title: "Land Strategy and Landowner Engagement",
    description:
      "Provides a systematic approach to land requirements, ownership review, access strategy and landowner engagement.",
    deliverables: [
      "Land requirements brief",
      "Landowner engagement plan",
      "Land-risk register",
    ],
  },
  {
    number: "06",
    title: "Satellite and Geospatial Desktop Review",
    description:
      "Uses available mapping and imagery to support preliminary site interpretation before field investigations.",
    deliverables: [
      "Desktop site assessment",
      "Terrain and access observations",
      "Field-verification priorities",
    ],
  },
  {
    number: "07",
    title: "Site Visit Planning and Execution",
    description:
      "Structures site visits around defined engineering questions, evidence requirements and development risks.",
    deliverables: [
      "Site-visit plan",
      "Inspection checklist",
      "Observation and action register",
    ],
  },
  {
    number: "08",
    title: "Environmental and Social Screening",
    description:
      "Supports proportionate early-stage identification of environmental, permitting, community and social constraints.",
    deliverables: [
      "Environmental screening matrix",
      "Stakeholder considerations",
      "Further-study recommendations",
    ],
  },
  {
    number: "09",
    title: "Project Risk Register",
    description:
      "Creates a structured process for identifying, evaluating, allocating and monitoring project-development risks.",
    deliverables: [
      "Development risk register",
      "Risk ownership structure",
      "Mitigation and monitoring actions",
    ],
  },
  {
    number: "10",
    title: "Initial CAPEX Benchmarking",
    description:
      "Develops a transparent early-stage cost basis for Solar PV and BESS projects before detailed engineering and procurement.",
    deliverables: [
      "Initial CAPEX structure",
      "Assumption register",
      "Cost sensitivity framework",
    ],
  },
];

export function VolumeOne () {
  return (
    <section
      id="volume-one"
      aria-labelledby="volume-one-title"
      className="relative overflow-hidden border-y border-white/10 bg-slate-950 py-20 sm:py-24 lg:py-28"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section introduction */}
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
            Volume 1
          </p>

          <h2
            id="volume-one-title"
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            AI Foundations &amp; Professional Prompt Library
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            A complete ten-chapter methodology for responsible, traceable
            and decision-focused AI-assisted Solar PV and BESS project
            development.
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-400">
            The handbook takes professionals from responsible AI practice
            and technical due diligence through site screening, development
            planning, project risk and initial CAPEX assessment. The chapters
            follow the practical progression of an early-stage utility-scale
            project toward a decision-ready initial investment basis.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300">
              PDF Publisher Edition
            </span>

            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
              Available immediately
            </span>
          </div>
        </div>

        {/* Chapter cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {chapters.map((chapter) => (
            <article
              key={chapter.number}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.055] sm:p-7"
            >
              <div
                aria-hidden="true"
                className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-emerald-400/[0.04] transition duration-300 group-hover:bg-emerald-400/[0.08]"
              />

              <div className="relative">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-sm font-bold text-emerald-300">
                    {chapter.number}
                  </span>

                  <div>
                    <h3 className="text-xl font-semibold leading-7 text-white">
                      {chapter.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                      {chapter.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Example outputs
                  </p>

                  <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                    {chapter.deliverables.map((deliverable) => (
                      <li
                        key={deliverable}
                        className="flex items-start gap-2 text-sm leading-5 text-slate-300"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"
                        />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Section conclusion */}
        <div className="mt-12 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] px-6 py-8 text-center sm:px-10">
          <h3 className="text-xl font-semibold text-white sm:text-2xl">
            A structured basis for early-stage project decisions
          </h3>

          <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            The complete workflow supports project progression, targeted
            technical studies, accountable risk ownership and transparent
            early-stage investment assessment.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#preview"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Preview the Handbook
            </a>

            <a
              href="#pricing"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Get Volume 1 — €49
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}