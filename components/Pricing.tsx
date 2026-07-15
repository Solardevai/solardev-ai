import { pricingFeatures, siteConfig } from "@/data/siteData";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative scroll-mt-24 overflow-hidden border-b border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-amber-400/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-28">

        <div className="text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
            Publisher Edition
          </p>

          <h2 className="mt-5 text-5xl font-bold tracking-tight text-white">
            Start using AI like a professional engineer
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-300">
            Everything you need to integrate AI into utility-scale Solar PV and
            BESS project development with structured engineering methodology.
          </p>

        </div>

        <div className="mx-auto mt-20 max-w-3xl">

          <div className="rounded-[32px] border border-amber-400/25 bg-slate-900/80 p-10 shadow-2xl backdrop-blur">

            {/* Badge */}

            <div className="flex justify-center">

              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-2 text-sm font-semibold text-amber-300">
                🚀 Launch Offer
              </span>

            </div>

            {/* Title */}

            <h3 className="mt-8 text-center text-3xl font-bold text-white">
              {siteConfig.product.name}
            </h3>

            <p className="mt-4 text-center text-slate-400">
              {siteConfig.product.subtitle}
            </p>

            {/* Price */}

            <div className="mt-10 text-center">

              <p className="text-lg text-slate-500 line-through">
                €{siteConfig.product.standardPrice}
              </p>

              <div className="mt-2 flex items-end justify-center gap-2">

                <span className="text-7xl font-bold text-white">
                  €{siteConfig.product.launchPrice}
                </span>

              </div>

              <p className="mt-4 text-green-400 font-semibold">
                Save €10 during launch
              </p>

              <p className="mt-2 text-slate-500">
                One-time purchase • Instant download
              </p>

            </div>

            {/* CTA */}

            <a
              href={siteConfig.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-12 block w-full rounded-2xl bg-amber-400 py-5 text-center text-lg font-bold text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-amber-300"
            >
              Get Instant Access
            </a>

            {/* Features */}

            <div className="mt-14 grid gap-5 sm:grid-cols-2">

              {pricingFeatures.map((feature) => (

                <div
                  key={feature}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                    ✓
                  </div>

                  <span className="text-slate-300">
                    {feature}
                  </span>

                </div>

              ))}

            </div>

            {/* Trust */}

            <div className="mt-14 rounded-2xl border border-white/10 bg-slate-950/60 p-6">

              <div className="grid gap-6 md:grid-cols-3 text-center">

                <div>

                  <p className="text-3xl font-bold text-white">
                    218
                  </p>

                  <p className="mt-2 text-slate-400">
                    Professional Pages
                  </p>

                </div>

                <div>

                  <p className="text-3xl font-bold text-white">
                    10
                  </p>

                  <p className="mt-2 text-slate-400">
                    Engineering Chapters
                  </p>

                </div>

                <div>

                  <p className="text-3xl font-bold text-white">
                    100+
                  </p>

                  <p className="mt-2 text-slate-400">
                    Professional AI Prompts
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}