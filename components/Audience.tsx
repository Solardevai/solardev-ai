import {
  applications,
  professionalAudience,
} from "@/data/siteData";

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
            Professional use
          </p>

          <h2
            id="audience-title"
            className="mt-4 text-3xl font-bold tracking-tight text-[#10271f] sm:text-4xl"
          >
            Built for real project-development work
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#536860]">
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
              className="rounded-full border border-[#10271f]/10 bg-white/70 px-4 py-2 text-sm text-[#29483c]"
            >
              {audience}
            </span>
          ))}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {applications.map((application) => (
            <article
              key={application.number}
              className="rounded-2xl border border-[#10271f]/10 bg-white/70 p-6 shadow-sm sm:p-7"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-sm font-bold text-emerald-300">
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
      </div>
    </section>
  );
}
