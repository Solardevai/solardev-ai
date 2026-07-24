import TrackedCheckoutLink from "@/components/TrackedCheckoutLink";
import { handbookVolumes } from "@/data/handbookData";
import {
  productData,
  volumeTwoProductData,
} from "@/data/productData";

export default function Pricing() {
  const [volumeOne, volumeTwo] = handbookVolumes;

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="relative scroll-mt-24 overflow-hidden border-y border-white/10 bg-slate-950 py-16 sm:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-400/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">
            Professional handbook series
          </p>
          <h2
            id="pricing-title"
            className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Choose your volume
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
            Each volume is an individual digital edition with a
            one-time purchase price.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <article className="flex h-full flex-col rounded-2xl border border-amber-400/25 bg-white/[0.035] p-6 shadow-xl shadow-black/15">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
                  {volumeOne.volume}
                </p>
                <h3 className="mt-2 text-xl font-bold text-white">
                  {volumeOne.title}
                </h3>
              </div>
              <span className="shrink-0 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-300">
                Available
              </span>
            </div>

            <div className="mt-5 flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight text-white">
                €{volumeOne.price}
              </span>
              <span className="pb-1 text-sm text-slate-500">
                one-time
              </span>
            </div>

            <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-300">
              <li>{volumeOne.pages}-page PDF edition</li>
              <li>{volumeOne.chapters} professional chapters</li>
              <li>Immediate secure download</li>
            </ul>

            <TrackedCheckoutLink
              href={productData.checkoutUrl}
              buttonLocation="pricing_volume_1"
              itemId={productData.itemId}
              itemName={productData.itemName}
              itemCategory={productData.itemCategory}
              price={productData.price}
              currency={productData.currency}
              ariaLabel={`Purchase Volume 1 for €${productData.price}`}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Get Volume 1
            </TrackedCheckoutLink>
          </article>

          <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
                  {volumeTwo.volume}
                </p>
                <h3 className="mt-2 text-xl font-bold text-white">
                  {volumeTwo.title}
                </h3>
              </div>
              <span className="shrink-0 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-300">
                Available
              </span>
            </div>

            <div className="mt-5 flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight text-white">
                €{volumeTwo.price}
              </span>
              <span className="pb-1 text-sm text-slate-500">
                one-time
              </span>
            </div>

            <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-300">
              <li>{volumeTwo.pages}-page PDF edition</li>
              <li>{volumeTwo.chapters} professional chapters</li>
              <li>Immediate secure download</li>
            </ul>

            <TrackedCheckoutLink
              href={volumeTwoProductData.checkoutUrl}
              buttonLocation="pricing_volume_2"
              itemId={volumeTwoProductData.itemId}
              itemName={volumeTwoProductData.itemName}
              itemCategory={volumeTwoProductData.itemCategory}
              price={volumeTwoProductData.price}
              currency={volumeTwoProductData.currency}
              ariaLabel={`Purchase Volume 2 for €${volumeTwoProductData.price}`}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Get Volume 2
            </TrackedCheckoutLink>
          </article>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          Individual licence · Secure Stripe checkout for available
          editions · Prices shown in EUR
        </p>
      </div>
    </section>
  );
}
