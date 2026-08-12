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
      className="relative scroll-mt-24 overflow-hidden border-y border-[#10271f]/10 bg-[#f4f5f0] py-16 text-[#10271f] sm:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
            Professional handbook series
          </p>
          <h2
            id="pricing-title"
            className="mt-3 text-3xl font-bold tracking-tight text-[#10271f] sm:text-4xl"
          >
            Choose your volume
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#536860]">
            Each volume is an individual digital edition with a
            one-time purchase price.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <article className="flex h-full flex-col rounded-2xl border border-emerald-600/25 bg-white/80 p-6 shadow-xl shadow-[#10271f]/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  {volumeOne.volume}
                </p>
                <h3 className="mt-2 text-xl font-bold text-[#10271f]">
                  {volumeOne.title}
                </h3>
              </div>
              <span className="shrink-0 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-bold text-emerald-300">
                Available
              </span>
            </div>

            <div className="mt-5 flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight text-[#10271f]">
                €{volumeOne.price}
              </span>
              <span className="pb-1 text-sm text-slate-500">
                one-time
              </span>
            </div>

            <ul className="mt-5 flex-1 space-y-2 text-sm text-[#29483c]">
              <li>{volumeOne.pages}-page PDF edition</li>
              <li>{volumeOne.chapters} professional chapters</li>
              <li>Individual professional-use licence</li>
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
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Get Volume 1
            </TrackedCheckoutLink>
          </article>

          <article className="flex h-full flex-col rounded-2xl border border-[#10271f]/10 bg-white/70 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  {volumeTwo.volume}
                </p>
                <h3 className="mt-2 text-xl font-bold text-[#10271f]">
                  {volumeTwo.title}
                </h3>
              </div>
              <span className="shrink-0 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-bold text-emerald-300">
                Available
              </span>
            </div>

            <div className="mt-5 flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight text-[#10271f]">
                €{volumeTwo.price}
              </span>
              <span className="pb-1 text-sm text-slate-500">
                one-time
              </span>
            </div>

            <ul className="mt-5 flex-1 space-y-2 text-sm text-[#29483c]">
              <li>{volumeTwo.pages}-page PDF edition</li>
              <li>{volumeTwo.chapters} professional chapters</li>
              <li>Individual professional-use licence</li>
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
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
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
