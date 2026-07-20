import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TrackedCheckoutLink from "@/components/TrackedCheckoutLink";
import { productData } from "@/data/productData";

export const metadata: Metadata = {
  title: "Utility-Scale Solar & BESS Project Development Handbook",
  description:
    "A 218-page professional handbook with AI prompts, engineering workflows, checklists and worked examples for utility-scale Solar PV and BESS project development.",
  alternates: {
    canonical:
      "/solar-bess-project-development-handbook",
  },
  openGraph: {
    title:
      "Utility-Scale Solar & BESS Project Development Handbook",
    description:
      "Professional handbook and AI prompt library for utility-scale Solar PV and BESS project development.",
    url:
      "https://www.solardev.ai/solar-bess-project-development-handbook",
    type: "website",
    images: [
      {
        url: "/volume-1-cover.png",
        alt: "SolarDev AI Volume 1 handbook cover",
      },
    ],
  },
};

const chapters = [
  "AI Foundations & Professional Prompting",
  "Research & Technical Due Diligence",
  "Site Identification & Feasibility Screening",
  "Preliminary Development Roadmap",
  "Landowner Assessment & Land Control",
  "Satellite & Aerial Image Interpretation",
  "Site Visit Planning & Field Due Diligence",
  "Environmental & Social Screening",
  "Initial Project Risk Register",
  "Initial CAPEX Benchmark",
];

const structuredData = {
  "@context": "https://schema.org",

  "@graph": [
    {
      "@type": "Product",
      "@id":
        "https://www.solardev.ai/solar-bess-project-development-handbook#product",

      name:
        "AI for Utility-Scale Solar & BESS Project Development — Volume 1",

      description:
        "A 218-page professional handbook and AI prompt library for utility-scale Solar PV and BESS project development.",

      image: [
        "https://www.solardev.ai/volume-1-cover.png",
      ],

      sku: "SOLARDEV-VOL1",

      category: "Digital engineering handbook",

      brand: {
        "@type": "Brand",
        name: "SolarDev AI",
      },

      isRelatedTo: {
        "@id":
          "https://www.solardev.ai/solar-bess-project-development-handbook#book",
      },

      offers: {
        "@type": "Offer",

        url:
          "https://www.solardev.ai/solar-bess-project-development-handbook",

        priceCurrency: productData.currency,

        price: productData.price.toFixed(2),

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
        "https://www.solardev.ai/solar-bess-project-development-handbook#book",

      name:
        "AI for Utility-Scale Solar & BESS Project Development — Volume 1",

      author: {
        "@type": "Person",
        name: "Tiago Pires",
      },

      publisher: {
        "@type": "Organization",
        name: "SolarDev AI",
        url: "https://www.solardev.ai",
      },

      bookFormat: "https://schema.org/EBook",

      inLanguage: "en",

      numberOfPages: 218,

      image:
        "https://www.solardev.ai/volume-1-cover.png",

      description:
        "A professional digital handbook covering AI-supported workflows for utility-scale Solar PV and BESS project development.",
    },
  ],
};
export default function HandbookPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-lg font-bold"
          >
            SolarDev <span className="text-amber-400">AI</span>
          </Link>

          <Link
            href="/"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Back to homepage
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
        <div>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl">
            <Image
              src="/volume-1-cover.png"
              alt="SolarDev AI utility-scale solar and BESS project development handbook cover"
              width={708}
              height={1000}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            SolarDev AI · Volume 1
          </p>

          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Utility-Scale Solar &amp; BESS Project Development Handbook
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            A professional handbook and AI prompt library designed
            for utility-scale Solar PV and battery energy storage
            project development.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-white/10 p-4">
              <p className="text-xs uppercase text-slate-500">
                Pages
              </p>
              <p className="mt-1 text-xl font-semibold">218</p>
            </div>

            <div className="rounded-lg border border-white/10 p-4">
              <p className="text-xs uppercase text-slate-500">
                Chapters
              </p>
              <p className="mt-1 text-xl font-semibold">10</p>
            </div>

            <div className="rounded-lg border border-white/10 p-4">
              <p className="text-xs uppercase text-slate-500">
                Format
              </p>
              <p className="mt-1 text-xl font-semibold">PDF</p>
            </div>

            <div className="rounded-lg border border-white/10 p-4">
              <p className="text-xs uppercase text-slate-500">
                Edition
              </p>
              <p className="mt-1 text-xl font-semibold">v4.0</p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-7">
            <p className="text-sm text-slate-400">
              One-time payment
            </p>

            <p className="mt-2 text-5xl font-bold">
              €{productData.price}
            </p>

            <TrackedCheckoutLink
              href={productData.checkoutUrl}
              buttonLocation="product_page"
              itemId={productData.itemId}
              itemName={productData.itemName}
              itemCategory={productData.itemCategory}
              price={productData.price}
              currency={productData.currency}
              ariaLabel={`Buy SolarDev AI Volume 1 for €${productData.price}`}
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              Buy Volume 1 — €{productData.price}
            </TrackedCheckoutLink>

            <p className="mt-4 text-center text-xs text-slate-500">
              Secure payment through Stripe. Immediate PDF download
              after successful payment.
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
                <p className="text-sm font-semibold text-amber-400">
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

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-bold">
          Who this handbook is for
        </h2>

        <p className="mt-5 leading-8 text-slate-300">
          Designed for project development engineers, solar and BESS
          engineers, technical advisors, owner&apos;s engineers, EPC
          professionals, developers and investors involved in real
          utility-scale renewable-energy projects.
        </p>

        <h2 className="mt-12 text-3xl font-bold">
          Professional-use disclaimer
        </h2>

        <p className="mt-5 leading-8 text-slate-300">
          The handbook is an educational and methodological resource.
          It does not replace project-specific engineering, legal,
          financial, environmental or regulatory advice. All AI
          outputs and project assumptions must be independently
          reviewed by appropriately qualified professionals.
        </p>
      </section>
    </main>
  );
}