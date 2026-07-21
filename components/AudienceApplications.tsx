import {
  applications,
  professionalAudience,
} from "@/data/siteData";

export default function AudienceApplications() {
  return (
    <section
      id="audience"
      aria-labelledby="audience-title"
      className="scroll-mt-24 bg-slate-950 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Professional use
          </p>

          <h2
            id="audience-title"
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Built for real project-development work
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Controlled AI workflows for professionals
            responsible for technical reviews,
            development decisions and investment
            recommendations.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {professionalAudience.map((audience) => (
            <span
              key={audience}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300"
            >
              {audience}
            </span>
          ))}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {applications.map((application) => (
            <article
              key={application.number}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-sm font-bold text-emerald-300">
                  {application.number}
                </span>

                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {application.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {application.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {application.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}