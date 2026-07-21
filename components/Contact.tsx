import { siteConfig } from "@/data/siteData";

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-24 border-t border-white/10 bg-slate-950 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Contact
          </p>

          <h2
            id="contact-title"
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Contact SolarDev AI
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
            Product enquiries, professional licensing
            and customer support.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <a
            href={`mailto:${siteConfig.infoEmail}`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400">
              Product and licensing
            </p>

            <h3 className="mt-3 text-xl font-bold text-white">
              General and corporate enquiries
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Handbook questions, professional
              collaboration, team licensing and
              corporate implementation.
            </p>

            <p className="mt-6 font-semibold text-emerald-300">
              {siteConfig.infoEmail}
            </p>
          </a>

          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400">
              Customer support
            </p>

            <h3 className="mt-3 text-xl font-bold text-white">
              Payment and product access
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Checkout, payment confirmation, PDF
              delivery and access assistance.
            </p>

            <p className="mt-6 font-semibold text-emerald-300">
              {siteConfig.supportEmail}
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}