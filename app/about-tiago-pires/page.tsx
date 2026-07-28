import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const PAGE_URL = "https://www.solardev.ai/about-tiago-pires";

export const metadata: Metadata = {
  title: "Tiago Pires — Founder & Author",
  description:
    "About Tiago Pires, founder and author of SolarDev AI, and the engineering principles behind its utility-scale Solar PV and BESS tools and handbooks.",
  alternates: { canonical: "/about-tiago-pires" },
  openGraph: {
    title: "Tiago Pires — Founder & Author of SolarDev AI",
    description:
      "The professional scope and engineering principles behind SolarDev AI tools, workflows and handbooks.",
    url: PAGE_URL,
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiago Pires — Founder & Author of SolarDev AI",
    description:
      "The professional scope and engineering principles behind SolarDev AI tools, workflows and handbooks.",
    images: ["/opengraph-image.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${PAGE_URL}#person`,
  name: "Tiago Pires",
  url: PAGE_URL,
  jobTitle: "Founder and Author",
  worksFor: {
    "@id": "https://www.solardev.ai/#organization",
  },
  knowsAbout: [
    "Utility-scale Solar PV project development",
    "Battery energy storage project development",
    "Solar site screening",
    "Technical due diligence",
    "Engineering workflows",
    "Responsible use of AI in professional work",
  ],
};

export default function AboutTiagoPiresPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="relative overflow-hidden border-b border-white/10 px-6 py-20 sm:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(52,211,153,.12),transparent_48%)]" />
          <div className="relative mx-auto max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
              Founder and author
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
              Tiago Pires
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Tiago Pires is the founder and author of SolarDev AI. His work
              focuses on practical tools, structured knowledge and controlled
              AI-assisted workflows for utility-scale Solar PV and battery
              energy storage project development.
            </p>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_.8fr]">
            <div className="space-y-8">
              <article className="rounded-3xl border border-white/10 bg-white/[0.025] p-7 sm:p-9">
                <h2 className="text-2xl font-bold">Professional focus</h2>
                <p className="mt-4 leading-8 text-slate-400">
                  SolarDev AI is built around the decisions and evidence needs
                  that shape renewable-energy development: site screening,
                  technical due diligence, development planning, design basis,
                  grid strategy, project risk and the transition from
                  development into delivery and operations.
                </p>
                <p className="mt-4 leading-8 text-slate-400">
                  The objective is not to automate professional judgement. It is
                  to make early-stage analysis more structured, assumptions
                  more visible and follow-up actions easier to define.
                </p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/[0.025] p-7 sm:p-9">
                <h2 className="text-2xl font-bold">Engineering principles</h2>
                <ul className="mt-5 space-y-4 text-slate-300">
                  {[
                    "Separate measured, modelled and assumed information.",
                    "State calculation limitations before recommendations are used.",
                    "Preserve evidence, uncertainty and professional accountability.",
                    "Use AI as an assistant within controlled and reviewable workflows.",
                    "Treat public tools as screening aids rather than issued engineering studies.",
                  ].map((principle) => (
                    <li key={principle} className="flex gap-3">
                      <span className="text-emerald-300">✓</span>
                      {principle}
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <aside className="h-fit rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.05] p-7">
              <h2 className="text-xl font-bold">Published work and tools</h2>
              <div className="mt-5 space-y-3">
                {[
                  ["Professional handbook series", "/handbooks"],
                  ["Solar Site Check", "/tools/solar-site-screening"],
                  ["Sun Position & Shadings", "/tools/sun-path"],
                ].map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="block rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-white transition hover:border-emerald-400/35 hover:text-emerald-200"
                  >
                    {label} →
                  </Link>
                ))}
              </div>
              <p className="mt-7 border-t border-white/10 pt-6 text-sm leading-6 text-slate-400">
                For product, licensing or professional enquiries, contact{" "}
                <a
                  href="mailto:info@solardev.ai"
                  className="font-semibold text-emerald-300 hover:text-emerald-200"
                >
                  info@solardev.ai
                </a>
                .
              </p>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
