import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BookPreview from "@/components/BookPreview";
import TrackedCheckoutLink from "@/components/TrackedCheckoutLink";
import { volumeTwoProductData } from "@/data/productData";

export const metadata: Metadata = {
  title: "Solar & BESS Project Development Handbook — Volume 2",
  description:
    `A ${volumeTwoProductData.pages}-page professional handbook covering FEED, grid connection, consenting, procurement, financing, construction, commissioning and operations for utility-scale Solar PV and BESS projects.`,
  alternates: {
    canonical:
      "/solar-bess-project-development-handbook-volume-2",
  },
  openGraph: {
    title:
      "Solar & BESS Project Development Handbook — Volume 2",
    description:
      "From Development to Operations: a professional handbook and AI prompt library for utility-scale Solar PV and BESS projects.",
    url:
      "https://www.solardev.ai/solar-bess-project-development-handbook-volume-2",
    type: "website",
    images: [
      {
        url: "/volume-2-cover.webp",
        alt: "SolarDev AI Volume 2 handbook cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar & BESS Project Development Handbook — Volume 2",
    description:
      "From Development to Operations: a professional handbook and AI prompt library for utility-scale Solar PV and BESS projects.",
    images: ["/volume-2-cover.webp"],
  },
};

const chapters = [
  "FEED and Design Basis Development",
  "Grid Connection Studies and Interconnection Strategy",
  "Permitting and Consenting to Financial Close",
  "Procurement and EPC Contracting",
  "BESS Technical Due Diligence and Safety Compliance",
  "Financial Modelling and Bankability Support",
  "Construction Planning and Site Management",
  "Commissioning and Energisation",
  "Operations, Performance and Asset Management",
  "Repowering, Augmentation and Portfolio Risk Reporting",
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "@id":
        "https://www.solardev.ai/solar-bess-project-development-handbook-volume-2#product",
      name: volumeTwoProductData.itemName,
      description:
        `A ${volumeTwoProductData.pages}-page professional handbook and AI prompt library covering the project lifecycle from development to operations.`,
      image: [
        "https://www.solardev.ai/volume-2-cover.webp",
      ],
      sku: "SOLARDEV-VOL2",
      category: "Digital engineering handbook",
      model: volumeTwoProductData.edition,
      isRelatedTo: {
        "@id":
          "https://www.solardev.ai/solar-bess-project-development-handbook-volume-2#book",
      },
      brand: {
        "@type": "Brand",
        name: "SolarDev AI",
      },
      offers: {
        "@type": "Offer",
        url:
          "https://www.solardev.ai/solar-bess-project-development-handbook-volume-2",
        priceCurrency: volumeTwoProductData.currency,
        price: volumeTwoProductData.price.toFixed(2),
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: {
          "@type": "Organization",
          name: "SolarDev AI",
          url: "https://www.solardev.ai",
        },
      },
    },
    {
      "@type": "Book",
      "@id":
        "https://www.solardev.ai/solar-bess-project-development-handbook-volume-2#book",
      name: volumeTwoProductData.itemName,
      author: {
        "@type": "Organization",
        name: "SolarDev AI",
        url: "https://www.solardev.ai",
      },
      publisher: {
        "@type": "Organization",
        name: "SolarDev AI",
        url: "https://www.solardev.ai",
      },
      bookFormat: "https://schema.org/EBook",
      bookEdition: volumeTwoProductData.edition,
      inLanguage: "en",
      numberOfPages: volumeTwoProductData.pages,
      image:
        "https://www.solardev.ai/volume-2-cover.webp",
      description:
        `From Development to Operations — ${volumeTwoProductData.edition}.`,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.solardev.ai/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Handbooks",
          item: "https://www.solardev.ai/handbooks",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Volume 2",
          item: "https://www.solardev.ai/solar-bess-project-development-handbook-volume-2",
        },
      ],
    },
  ],
};

export default function VolumeTwoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-lg font-bold">
            SolarDev <span className="text-yellow-400">AI</span>
          </Link>
          <Link
            href="/handbooks"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            All handbooks
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
        <div>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl">
            <Image
              src="/volume-2-cover.webp"
              alt="SolarDev AI Volume 2 handbook cover"
              width={1224}
              height={1584}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            SolarDev AI · Volume 2
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Utility-Scale Solar &amp; BESS: From Development to Operations
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            A professional handbook and AI prompt library covering
            the transition from FEED and financial close through
            construction, commissioning, operations and portfolio
            strategy.
          </p>
          <p className="mt-3 text-sm text-slate-400">
            Written by SolarDev AI.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["Pages", String(volumeTwoProductData.pages)],
              ["Chapters", String(volumeTwoProductData.chapters)],
              ["Format", "PDF"],
              ["Edition", volumeTwoProductData.edition.replace("Edition ", "")],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-white/10 p-4"
              >
                <p className="text-xs uppercase text-slate-500">
                  {label}
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-7">
            <p className="text-sm text-slate-400">
              One-time payment
            </p>
            <p className="mt-2 text-5xl font-bold">
              €{volumeTwoProductData.price}
            </p>
            <TrackedCheckoutLink
              href={volumeTwoProductData.checkoutUrl}
              buttonLocation="volume_2_product_page"
              itemId={volumeTwoProductData.itemId}
              itemName={volumeTwoProductData.itemName}
              itemCategory={
                volumeTwoProductData.itemCategory
              }
              price={volumeTwoProductData.price}
              currency={volumeTwoProductData.currency}
              ariaLabel={`Buy SolarDev AI Volume 2 for €${volumeTwoProductData.price}`}
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Buy Volume 2 - €{volumeTwoProductData.price}
            </TrackedCheckoutLink>
            <p className="mt-4 text-center text-xs text-slate-500">
              Secure Stripe payment. Immediate PDF download after
              successful payment.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-bold">
            What is included
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {chapters.map((chapter, index) => (
              <article
                key={chapter}
                className="rounded-lg border border-white/10 bg-slate-950 p-5"
              >
                <p className="text-sm font-semibold text-emerald-400">
                  Chapter {index + 1}
                </p>
                <h3 className="mt-2 font-semibold">
                  {chapter}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BookPreview volume={2} />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-bold">
          Built for project execution and operations
        </h2>
        <p className="mt-5 leading-8 text-slate-300">
          Volume 2 is designed for engineers, developers,
          technical advisors, project managers, owners and investors
          progressing utility-scale Solar PV and BESS projects beyond
          early development.
        </p>
        <h2 className="mt-12 text-3xl font-bold">
          Professional-use disclaimer
        </h2>
        <p className="mt-5 leading-8 text-slate-300">
          The handbook is an educational and methodological
          resource. It does not replace project-specific engineering,
          legal, financial, environmental or regulatory advice. All
          AI outputs and project assumptions must be independently
          reviewed by appropriately qualified professionals.
        </p>
      </section>
    </main>
  );
}
