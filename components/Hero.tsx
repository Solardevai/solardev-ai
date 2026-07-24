import Image from "next/image";
import Link from "next/link";
import TrackedCheckoutLink from "@/components/TrackedCheckoutLink";
import { productData } from "@/data/productData";
import { siteConfig } from "@/data/siteData";

export default function Hero() {
  const { product } = siteConfig;

  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-white/10"
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-[-8rem] h-[34rem] w-[34rem] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute right-[-10rem] top-[4rem] h-[32rem] w-[32rem] rounded-full bg-amber-400/10 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <div className="relative mx-auto grid min-h-[820px] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        {/* Hero copy */}
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            {product.edition}
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.28em] text-amber-400">
            Professional Handbook &amp; Prompt Library
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-bold leading-[1.04] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            AI for Utility-Scale Solar &amp; BESS Project Development
          </h1>



          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <TrackedCheckoutLink
              href={productData.checkoutUrl}
              buttonLocation="hero"
              itemId={productData.itemId}
              itemName={productData.itemName}
              itemCategory={productData.itemCategory}
              price={productData.price}
              currency={productData.currency}
              className="rounded-xl bg-amber-400 px-7 py-4 text-center font-semibold text-slate-950 shadow-lg shadow-amber-400/10 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Get Volume 1
            </TrackedCheckoutLink>

            <Link
              href="/handbooks"
              className="rounded-xl border border-white/15 bg-white/[0.03] px-7 py-4 text-center font-semibold text-white transition hover:border-white/25 hover:bg-white/[0.07]"
            >
              Explore the Series
            </Link>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat value={`${product.pages}`} label="Pages" />
            <Stat value={`${product.chapters}`} label="Chapters" />
            <Stat value={`${product.promptLevels}`} label="Prompt levels" />
            <Stat value="Solar + BESS" label="Utility-scale focus" />
          </div>

          
        </div>

        {/* Visual */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative w-full max-w-[560px] pb-16 pt-4">
            {/* Volume 2 */}
            <Link
              href="/solar-bess-project-development-handbook-volume-2"
              aria-label="Explore SolarDev AI Volume 2"
              className="absolute right-0 top-0 z-0 w-[58%] overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900 p-3 shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-amber-400/40 sm:p-4"
            >
              <Image
                src="/volume-2-cover.webp"
                alt="AI for Utility-Scale Solar and BESS Project Development Volume 2 cover"
                width={1224}
                height={1584}
                priority
                className="h-auto w-full rounded-lg"
              />
            </Link>

            {/* Volume 1 */}
            <div className="relative z-10 w-[68%] rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-4 shadow-2xl shadow-black/50 backdrop-blur sm:p-5">
              <Image
                src="/volume-1-cover.webp"
                alt="AI for Utility-Scale Solar and BESS Project Development Volume 1 cover"
                width={900}
                height={1273}
                priority
                className="h-auto w-full rounded-lg"
              />

              <div className="absolute -bottom-8 -left-2 rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-xl backdrop-blur sm:-left-6 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Volume 1
                </p>

                <p className="mt-2 max-w-52 text-sm font-semibold leading-6 text-white">
                  AI Foundations &amp; Professional Prompt Library
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type StatProps = {
  value: string;
  label: string;
};

function Stat({ value, label }: StatProps) {
  return (
    <div className="border-l border-white/10 pl-4">
      <strong className="block text-xl font-bold text-white">{value}</strong>
      <span className="mt-1 block text-sm text-slate-500">{label}</span>
    </div>
  );
}
