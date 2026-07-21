import { chapters } from "@/data/siteData";

const chapterDeliverables: Record<string, string[]> = {
  "01": [
    "Controlled AI workflow",
    "Evidence and assumption checks",
    "Professional validation framework",
  ],
  "02": [
    "Due-diligence workflow",
    "Evidence register",
    "Technical findings structure",
  ],
  "03": [
    "Site-screening matrix",
    "Constraint register",
    "Preliminary go/no-go basis",
  ],
  "04": [
    "Development workplan",
    "Decision-gate structure",
    "Responsibility and dependency mapping",
  ],
  "05": [
    "Land requirements brief",
    "Landowner engagement plan",
    "Land-risk register",
  ],
  "06": [
    "Desktop site assessment",
    "Terrain and access observations",
    "Field-verification priorities",
  ],
  "07": [
    "Site-visit plan",
    "Inspection checklist",
    "Observation and action register",
  ],
  "08": [
    "Environmental screening matrix",
    "Stakeholder considerations",
    "Further-study recommendations",
  ],
  "09": [
    "Development risk register",
    "Risk ownership structure",
    "Mitigation and monitoring actions",
  ],
  "10": [
    "Initial CAPEX structure",
    "Assumption register",
    "Cost sensitivity framework",
  ],
};

export default function VolumeOne() {
  return (
    <section
      id="volume-1"
      aria-labelledby="volume-one-title"
      className="relative scroll-mt-24 overflow-hidden border-y border-white/10 bg-slate-950 py-20 sm:py-24 lg:py-28"
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
            A complete ten-chapter methodology for responsible,
            traceable and decision-focused AI-assisted Solar PV and
            BESS project development.
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-400">
            The handbook takes professionals from responsible AI
            practice and technical due diligence through site
            screening, development planning, project risk and initial
            CAPEX assessment. The chapters follow the practical
            progression of an early-stage utility-scale project toward
            a decision-ready initial investment basis.
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
          {chapters.map((chapter) => {
            const deliverables =
              chapterDeliverables[chapter.number] ?? [];

            return (
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

                  {deliverables.length > 0 && (
                    <div className="mt-6 border-t border-white/10 pt-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Example outputs
                      </p>

                      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                        {deliverables.map((deliverable) => (
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
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}