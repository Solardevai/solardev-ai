import { professionalAudience } from "@/data/siteData";

const useCases = [
  {
    title: "Opportunity screening",
    description:
      "Structure early site reviews, identify fatal flaws, compare opportunities and define the next technical actions.",
    tags: ["Site screening", "Constraints", "Go / No-Go"],
  },
  {
    title: "Technical due diligence",
    description:
      "Review multidisciplinary project evidence, identify information gaps and organise decision-ready findings.",
    tags: ["Evidence", "Risk", "Information gaps"],
  },
  {
    title: "Development planning",
    description:
      "Convert project objectives into coordinated workstreams, dependencies, decision gates and Ready-to-Build actions.",
    tags: ["Roadmap", "RACI", "Programme"],
  },
  {
    title: "Engineering documentation",
    description:
      "Prepare stronger first drafts of technical notes, executive summaries, scopes, registers and review reports.",
    tags: ["Reports", "Summaries", "Technical notes"],
  },
  {
    title: "Risk management",
    description:
      "Translate technical findings into accountable risks with causes, consequences, actions, ownership and residual exposure.",
    tags: ["Risk register", "Mitigation", "Ownership"],
  },
  {
    title: "CAPEX benchmarking",
    description:
      "Develop transparent estimate bases, scope assumptions, benchmark ranges, contingency and sensitivity reviews.",
    tags: ["CAPEX", "Contingency", "Sensitivity"],
  },
];

export default function Audience() {
  return (
    <section
      id="audience"
      className="relative overflow-hidden border-b border-white/10 bg-white text-slate-950"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-12rem] top-[-8rem] h-[34rem] w-[34rem] rounded-full bg-amber-300/15 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[-12rem] h-[32rem] w-[32rem] rounded-full bg-blue-300/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
              Built for professionals
            </p>

            <h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
              Designed for people responsible for real project decisions
            </h2>
          </div>

          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            SolarDev AI supports professionals working across the technical,
            commercial, environmental and development interfaces of
            utility-scale Solar PV and BESS projects.
          </p>
        </div>

        {/* Professional roles */}
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {professionalAudience.map((role) => (
            <div
              key={role}
              className="group flex min-h-24 items-center rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-amber-400">
                  ✓
                </span>

                <p className="font-semibold leading-6 text-slate-900">
                  {role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Use cases */}
        <div className="mt-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
              Practical applications
            </p>

            <h3 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Apply AI across the early project-development lifecycle
            </h3>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Each use case combines a professional objective, available
              evidence, structured analysis, validation requirements and a
              decision-focused output.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {useCases.map((useCase, index) => (
              <article
                key={useCase.title}
                className="group rounded-3xl border border-slate-200 bg-slate-50/80 p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:bg-white hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold tracking-[0.2em] text-amber-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="h-px w-16 bg-gradient-to-r from-amber-500 to-transparent" />
                </div>

                <h4 className="mt-7 text-2xl font-bold text-slate-950">
                  {useCase.title}
                </h4>

                <p className="mt-4 leading-7 text-slate-600">
                  {useCase.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {useCase.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Corporate licensing */}
        <div className="mt-16 rounded-3xl bg-slate-950 p-8 text-white sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">
                Team and corporate use
              </p>

              <h3 className="mt-4 text-3xl font-bold">
                Need access for multiple professionals?
              </h3>

              <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                The standard edition is intended for individual professional
                use. Contact SolarDev AI regarding team access, corporate
                licensing, training or tailored implementation support.
              </p>
            </div>

            <a
              href="mailto:info@solardev.ai?subject=SolarDev%20AI%20Corporate%20Licensing"
              className="shrink-0 rounded-xl bg-amber-400 px-7 py-4 text-center font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Discuss Corporate Access
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}