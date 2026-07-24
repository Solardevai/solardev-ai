import {
  pricingFeatures,
  siteConfig,
} from "@/data/siteData";
import TrackedCheckoutLink from "@/components/TrackedCheckoutLink";
import { productData } from "@/data/productData";

export default function Pricing() {
  const {
    checkoutUrl,
    product,
  } = siteConfig;

  const savings =
    product.standardPrice - product.launchPrice;

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="relative scroll-mt-24 overflow-hidden border-y border-white/10 bg-slate-950 py-20 sm:py-24"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-400/5 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">
            {product.edition}
          </p>

          <h2
            id="pricing-title"
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Get Volume 1
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Immediate access to the complete
            professional handbook for utility-scale
            Solar PV and BESS project development.
          </p>
        </div>

        {/* Pricing card */}
        <div className="mx-auto mt-12 w-full max-w-2xl">
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/25 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-amber-400/[0.055]"
            />

            <div className="relative">
              {/* Product name */}
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
                  Volume 1
                </p>

                <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  {product.subtitle}
                </h3>
              </div>

              {/* Price */}
              <div className="mt-7 text-center">
                <div className="flex items-end justify-center gap-4">
                  <del className="pb-2 text-2xl font-semibold text-slate-500 decoration-slate-500">
                    €{product.standardPrice}
                  </del>

                  <span className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
                    €{product.launchPrice}
                  </span>
                </div>

                {savings > 0 && (
                  <p className="mt-2 text-sm font-semibold text-emerald-400">
                    Save €{savings}
                  </p>
                )}

                <p className="mt-1 text-sm font-medium text-slate-400">
                  Introductory price · One-time purchase
                </p>
              </div>

              {/* Product benefits */}
              <div className="mt-7 border-t border-white/10 pt-7">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {pricingFeatures.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-300"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-bold text-emerald-400"
                      >
                        ✓
                      </span>

                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Purchase button */}
              <div className="mt-8">
                <TrackedCheckoutLink
                  href={checkoutUrl}
                  buttonLocation="pricing"
                  itemId={productData.itemId}
                  itemName={productData.itemName}
                  itemCategory={productData.itemCategory}
                  price={productData.price}
                  currency={productData.currency}
                  aria-label={`Purchase ${product.name} for ${product.launchPrice} euros`}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-base font-bold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  Get Immediate Access
                </TrackedCheckoutLink>

                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  Secure Stripe checkout. The PDF is
                  available immediately after payment
                  confirmation.
                </p>
              </div>

              {/* Purchase details */}
              <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-white/10 pt-6 text-xs font-medium text-slate-400">
                <span>Individual licence</span>
                <span>One-time payment</span>
                <span>Secure digital delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
