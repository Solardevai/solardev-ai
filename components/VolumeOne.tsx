import Link from "next/link";
import TrackedCheckoutLink from "@/components/TrackedCheckoutLink";
import {
  volumeOneProductData,
  volumeTwoProductData,
} from "@/data/productData";

const volumes = [
  {
    product: volumeOneProductData,
    description:
      "A structured methodology for using AI responsibly across early-stage utility-scale Solar PV and BESS project development.",
    scope:
      "Progress from controlled AI practice and technical due diligence through site screening, development planning, project risk and initial CAPEX assessment.",
    detailsHref:
      "/solar-bess-project-development-handbook",
    accent: "emerald",
  },
  {
    product: volumeTwoProductData,
    description:
      "A structured methodology for progressing utility-scale Solar PV and BESS projects from development into execution and operation.",
    scope:
      "Progress from FEED, grid connection and consenting through procurement, financing, construction, commissioning, asset management and repowering.",
    detailsHref:
      "/solar-bess-project-development-handbook-volume-2",
    accent: "emerald",
  },
] as const;

export default function VolumeOne() {
  return (
    <section
      id="volume-1"
      aria-labelledby="handbook-series-title"
      className="relative scroll-mt-24 overflow-hidden border-y border-white/10 bg-slate-950 py-20 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/3 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-emerald-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
            Professional handbook series
          </p>
          <h2
            id="handbook-series-title"
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            From early development to operations
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            Two complementary volumes addressing key decisions across the
            utility-scale Solar PV and BESS project lifecycle.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {volumes.map(
            ({
              product,
              description,
              scope,
              detailsHref,
              accent,
            }) => {
              const isEmerald =
                accent === "emerald";

              return (
                <article
                  key={product.volume}
                  className={`flex h-full flex-col rounded-3xl border bg-white/[0.03] p-7 sm:p-9 ${
                    isEmerald
                      ? "border-emerald-400/20"
                      : "border-emerald-400/20"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold uppercase tracking-[0.22em] ${
                      isEmerald
                        ? "text-emerald-400"
                        : "text-emerald-400"
                    }`}
                  >
                    Volume {product.volume}
                  </p>

                  <h3 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {product.title}
                  </h3>

                  <p className="mt-6 text-lg leading-8 text-slate-300">
                    {description}
                  </p>

                  <p className="mt-4 flex-1 leading-7 text-slate-400">
                    {scope}
                  </p>

                  <dl className="mt-7 grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">
                        Pages
                      </dt>
                      <dd className="mt-1 font-bold text-white">
                        {product.pages}
                      </dd>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">
                        Chapters
                      </dt>
                      <dd className="mt-1 font-bold text-white">
                        {product.chapters}
                      </dd>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">
                        Edition
                      </dt>
                      <dd className="mt-1 font-bold text-white">
                        {product.edition.replace("Edition ", "")}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href={detailsHref}
                      className={`inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/5 ${
                        isEmerald
                          ? "hover:border-emerald-400/40"
                          : "hover:border-emerald-400/40"
                      }`}
                    >
                      View Volume {product.volume}
                    </Link>

                    <TrackedCheckoutLink
                      href={product.checkoutUrl}
                      buttonLocation={`homepage_volume_${product.volume}`}
                      itemId={product.itemId}
                      itemName={product.itemName}
                      itemCategory={product.itemCategory}
                      price={product.price}
                      currency={product.currency}
                      ariaLabel={`Purchase Volume ${product.volume} for €${product.price}`}
                      className={`inline-flex min-h-12 flex-1 items-center justify-center rounded-xl px-5 py-3 text-center font-bold text-slate-950 transition ${
                        isEmerald
                          ? "bg-emerald-400 hover:bg-emerald-300"
                          : "bg-emerald-400 hover:bg-emerald-300"
                      }`}
                    >
                      Get Volume {product.volume}
                    </TrackedCheckoutLink>
                  </div>
                </article>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
