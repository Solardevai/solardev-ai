import {
  applications,
  professionalAudience,
} from "@/data/siteData";

const workflowBenefits = [
  {
    number: "01",
    title: "Start with project evidence",
    description:
      "Bring together site information, source documents and engineering assumptions before drawing conclusions.",
  },
  {
    number: "02",
    title: "Work through a clear process",
    description:
      "Use guided AI workflows and defined calculations to screen opportunities, review risks and plan the next steps.",
  },
  {
    number: "03",
    title: "Keep decisions traceable",
    description:
      "Record sources, assumptions and limitations so a qualified professional can review every important output.",
  },
];

export default function AudienceApplications() {
  return (
    <section
      id="audience"
      aria-labelledby="audience-title"
      className="scroll-mt-24 border-b border-[#10271f]/10 bg-[#edf0e9] py-20 text-[#10271f] sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            What it does and who it helps
          </p>

          <h2
            id="audience-title"
            className="mt-4 text-3xl font-bold tracking-tight text-[#10271f] sm:text-4xl"
          >
            A clearer way to assess solar and battery storage projects
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#536860]">
            SolarDev AI helps teams move from a potential utility-scale solar
            photovoltaic (PV) or battery energy storage system (BESS) site to a
            documented early-stage decision. It combines engineering guidance,
            controlled AI and practical tools, while keeping final judgement
            with qualified professionals.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {workflowBenefits.map((benefit) => (
            <article
              key={benefit.number}
              className="rounded-2xl border border-[#10271f]/10 bg-white/75 p-6 shadow-sm sm:p-7"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-sm font-bold text-emerald-700">
                {benefit.number}
              </span>

              <h3 className="mt-5 text-xl font-semibold text-[#10271f]">
                {benefit.title}
              </h3>

              <p className="mt-3 leading-7 text-[#536860]">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-[#10271f]">
            Common professional uses
          </h3>
          <p className="mt-3 text-[#536860]">
            Four practical tasks that appear throughout early project
            development.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {applications.map((application) => (
            <article
              key={application.number}
              className="rounded-2xl border border-[#10271f]/10 bg-white/70 p-6 shadow-sm sm:p-7"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-sm font-bold text-emerald-700">
                  {application.number}
                </span>

                <div>
                  <h3 className="text-xl font-semibold text-[#10271f]">
                    {application.title}
                  </h3>

                  <p className="mt-3 leading-7 text-[#536860]">
                    {application.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {application.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#edf0e9] px-3 py-1 text-xs font-medium text-[#536860]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-[#10271f]/10 bg-white/60 px-6 py-8 sm:px-8">
          <h3 className="text-center text-lg font-semibold text-[#10271f]">
            Used by teams across the project lifecycle
          </h3>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {professionalAudience.map((audience) => (
              <span
                key={audience}
                className="rounded-full border border-[#10271f]/10 bg-[#edf0e9] px-4 py-2 text-sm text-[#29483c]"
              >
                {audience}
              </span>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[#536860]">
            AI supports the analysis; it does not replace engineering review,
            due diligence or professional responsibility.
          </p>
        </div>
      </div>
    </section>
  );
}
