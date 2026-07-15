import { siteConfig } from "@/data/siteData";

const contactOptions = [
  {
    title: "General enquiries",
    description:
      "Questions about SolarDev AI, the handbook series, future products or professional collaboration.",
    email: siteConfig.infoEmail,
    subject: "SolarDev AI General Enquiry",
  },
  {
    title: "Customer support",
    description:
      "Help with checkout, payment confirmation, digital delivery or access to the purchased edition.",
    email: siteConfig.supportEmail,
    subject: "SolarDev AI Customer Support",
  },
  {
    title: "Corporate licensing",
    description:
      "Team access, corporate licensing, engineering training or tailored implementation support.",
    email: siteConfig.infoEmail,
    subject: "SolarDev AI Corporate Licensing",
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden border-b border-white/10 bg-white text-slate-950"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-amber-300/15 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-blue-300/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
              Contact SolarDev AI
            </p>

            <h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
              Product, support and corporate enquiries
            </h2>
          </div>

          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Contact SolarDev AI regarding Volume 1, digital delivery,
            professional use, future publications, team licensing or corporate
            implementation.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {contactOptions.map((option) => (
            <article
              key={option.title}
              className="group rounded-3xl border border-slate-200 bg-slate-50/80 p-8 transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:bg-white hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-xl text-amber-400">
                @
              </div>

              <h3 className="mt-7 text-2xl font-bold text-slate-950">
                {option.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {option.description}
              </p>

              <a
                href={`mailto:${option.email}?subject=${encodeURIComponent(
                  option.subject,
                )}`}
                className="mt-7 inline-flex font-semibold text-amber-700 transition hover:text-amber-600"
              >
                {option.email}
              </a>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-slate-950 p-8 text-white sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">
                Professional and corporate collaboration
              </p>

              <h3 className="mt-4 text-3xl font-bold">
                Interested in working with SolarDev AI?
              </h3>

              <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                SolarDev AI is developing professional handbooks, engineering
                templates, prompt libraries, training and future AI-assisted
                tools for utility-scale Solar PV and BESS development.
              </p>
            </div>

            <a
              href={`mailto:${siteConfig.infoEmail}?subject=${encodeURIComponent(
                "SolarDev AI Professional Collaboration",
              )}`}
              className="shrink-0 rounded-xl bg-amber-400 px-7 py-4 text-center font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Start a Conversation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}