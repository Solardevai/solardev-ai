import { professionalAudience, siteConfig } from "@/data/siteData";

const useCases = [
  {
    title: "Opportunity Screening",
    description:
      "Structure early site reviews, identify fatal flaws, compare opportunities and define the next technical actions.",
    tags: ["Site Screening", "Constraints", "Go / No-Go"],
  },
  {
    title: "Technical Due Diligence",
    description:
      "Review multidisciplinary project evidence, identify information gaps and organise decision-ready findings.",
    tags: ["Evidence", "Risk", "Information Gaps"],
  },
  {
    title: "Development Planning",
    description:
      "Convert project objectives into coordinated workstreams, dependencies, decision gates and Ready-to-Build actions.",
    tags: ["Roadmap", "RACI", "Programme"],
  },
  {
    title: "Engineering Documentation",
    description:
      "Prepare stronger first drafts of technical notes, executive summaries, scopes, registers and review reports.",
    tags: ["Reports", "Technical Notes", "Summaries"],
  },
  {
    title: "Risk Management",
    description:
      "Translate technical findings into accountable risks with causes, consequences, ownership and mitigation actions.",
    tags: ["Risk Register", "Mitigation", "Ownership"],
  },
  {
    title: "CAPEX Benchmarking",
    description:
      "Develop transparent estimate bases, benchmark assumptions, contingency ranges and investment sensitivities.",
    tags: ["CAPEX", "Benchmark", "Sensitivity"],
  },
];

export default function Audience() {
  return (
    <section
      id="audience"
      className="scroll-mt-24 relative overflow-hidden border-b border-white/10 bg-white text-slate-950"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-amber-300/15 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-blue-300/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24">

        {/* Header */}

        <div className="grid gap-12 lg:grid-cols-2 lg:items-end">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
              Built for Professionals
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Designed for professionals responsible for real projects
            </h2>
          </div>

          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            SolarDev AI supports engineers, developers and consultants involved
            in the development of utility-scale Solar PV and Battery Energy
            Storage System projects.
          </p>

        </div>

        {/* Professional Roles */}

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {professionalAudience.map((role) => (

            <div
              key={role}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-amber-400 font-bold">
                  ✓
                </div>

                <p className="font-semibold leading-6">
                  {role}
                </p>

              </div>

            </div>

          ))}

        </div>

        {/* Use Cases */}

        <div className="mt-24">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
            Practical Applications
          </p>

          <h3 className="mt-4 text-3xl font-bold sm:text-4xl">
            AI supporting the complete early-stage development workflow
          </h3>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Every workflow combines engineering objectives, project evidence,
            structured prompting, professional validation and decision-ready
            outputs.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {useCases.map((item, index) => (

              <article
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:bg-white hover:shadow-xl"
              >

                <div className="flex items-center justify-between">

                  <span className="text-sm font-bold tracking-[0.2em] text-amber-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="h-px w-16 bg-gradient-to-r from-amber-500 to-transparent" />

                </div>

                <h4 className="mt-7 text-2xl font-bold">
                  {item.title}
                </h4>

                <p className="mt-5 leading-7 text-slate-600">
                  {item.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">

                  {item.tags.map((tag) => (

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

        {/* CTA */}

        <div className="mt-20 rounded-3xl bg-slate-950 p-10 text-white">

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">
                Corporate Licensing
              </p>

              <h3 className="mt-4 text-3xl font-bold">
                Need access for your engineering team?
              </h3>

              <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                SolarDev AI also offers team licensing, corporate access,
                professional training and future enterprise AI solutions for
                renewable-energy developers and engineering consultancies.
              </p>

            </div>

            <a
              href={`mailto:${siteConfig.infoEmail}?subject=Corporate Licensing`}
              className="rounded-xl bg-amber-400 px-7 py-4 text-center font-semibold text-slate-950 transition hover:-translate-y-1 hover:bg-amber-300"
            >
              Contact Sales
            </a>

          </div>

        </div>

      </div>

    </section>
  );
}