import Image from "next/image";

const CHECKOUT_URL =
  "https://solardevai.lemonsqueezy.com/checkout/buy/14ca4fa1-0396-49e8-9213-d3770d70a36a";

const chapters = [
  {
    number: "01",
    title: "AI Foundations & Professional Prompting",
  },
  {
    number: "02",
    title: "Research & Technical Due Diligence",
  },
  {
    number: "03",
    title: "Site Identification & Feasibility Screening",
  },
  {
    number: "04",
    title: "Preliminary Development Roadmap",
  },
  {
    number: "05",
    title: "Landowner Assessment & Land Control",
  },
  {
    number: "06",
    title: "Satellite & Aerial Image Interpretation",
  },
  {
    number: "07",
    title: "Site Visit Planning & Field Due Diligence",
  },
  {
    number: "08",
    title: "Environmental & Social Screening",
  },
  {
    number: "09",
    title: "Initial Project Risk Register",
  },
  {
    number: "10",
    title: "Initial CAPEX Benchmark",
  },
];

const audiences = [
  "Project Development Engineers",
  "Solar & BESS Engineers",
  "Owner’s Engineers",
  "Technical Advisors",
  "EPC Professionals",
  "Developers and Investors",
];

const productFeatures = [
  "218-page PDF edition",
  "10 professional chapters",
  "Quick, Professional and Expert prompts",
  "Worked examples and checklists",
  "Engineering risk controls",
  "Minor corrections for this edition",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030817] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#030817]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a
            href="#top"
            className="text-sm font-semibold tracking-tight text-white"
            aria-label="SolarDev AI homepage"
          >
            SolarDev AI
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-7 text-sm text-slate-300 md:flex"
          >
            <a
              href="#volume-1"
              className="transition hover:text-white"
            >
              Volume 1
            </a>

            <a
              href="#whats-inside"
              className="transition hover:text-white"
            >
              What’s Inside
            </a>

            <a
              href="#about"
              className="transition hover:text-white"
            >
              About
            </a>

            <a
              href="#contact"
              className="transition hover:text-white"
            >
              Contact
            </a>
          </nav>

          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Get Volume 1
          </a>
        </div>
      </header>

      {/* Hero */}
      <section
        id="top"
        className="relative overflow-hidden border-b border-white/10"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden="true"
        >
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-900/40 blur-3xl" />
          <div className="absolute right-0 top-10 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.75fr] lg:px-8 lg:py-28">
          <div>
            {/* SEO-focused introductory label */}
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
              Professional Solar &amp; BESS Development Resources
            </p>

            {/* Primary page heading — keep only one H1 */}
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl">
              AI Tools for Utility-Scale Solar &amp; BESS Project Development
            </h1>

            {/* SEO-focused supporting text */}
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Professional handbooks, engineering workflows and AI prompt
              libraries designed to support utility-scale solar PV and battery
              energy storage projects from early-stage screening through
              construction readiness.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                Get Volume 1 — €49
              </a>

              <a
                href="#volume-1"
                className="inline-flex items-center justify-center rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Explore the Handbook
              </a>
            </div>

            <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-7 border-t border-white/10 pt-8 sm:grid-cols-4">
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-500">
                  Pages
                </dt>
                <dd className="mt-1 text-lg font-semibold text-white">218</dd>
              </div>

              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-500">
                  Chapters
                </dt>
                <dd className="mt-1 text-lg font-semibold text-white">10</dd>
              </div>

              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-500">
                  Prompt levels
                </dt>
                <dd className="mt-1 text-lg font-semibold text-white">3</dd>
              </div>

              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-500">
                  Methodology
                </dt>
                <dd className="mt-1 text-lg font-semibold text-white">
                  1 system
                </dd>
              </div>
            </dl>
          </div>

          {/* Handbook cover */}
          <div className="mx-auto w-full max-w-md lg:max-w-lg">
            <div className="relative">
              <div
                className="absolute -inset-6 rounded-3xl bg-amber-400/10 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white shadow-2xl shadow-black/50">
                <Image
                  src="/volume-1-cover.png"
                  alt="SolarDev AI utility-scale solar PV and BESS project development handbook cover, Volume 1"
                  width={708}
                  height={1000}
                  sizes="(max-width: 1024px) 90vw, 36vw"
                  loading="eager"
                  fetchPriority="high"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering approach */}
      <section
        id="whats-inside"
        className="border-b border-white/10 bg-[#060c1d]"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
              Engineering first
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Not another generic AI prompt book
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-300">
              SolarDev AI places artificial intelligence inside controlled
              engineering workflows. The objective is not to replace
              professional judgement, but to improve the consistency,
              traceability and speed of project-development work.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <article className="rounded-xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-sm font-semibold text-amber-400">01</p>
              <h3 className="mt-4 text-xl font-semibold">
                Engineering methodology
              </h3>
              <p className="mt-4 leading-7 text-slate-400">
                Structured workflows based on real utility-scale solar PV and
                BESS development activities.
              </p>
            </article>

            <article className="rounded-xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-sm font-semibold text-amber-400">02</p>
              <h3 className="mt-4 text-xl font-semibold">
                Consultant-grade prompts
              </h3>
              <p className="mt-4 leading-7 text-slate-400">
                Prompts built around roles, inputs, deliverables, constraints,
                risks and validation requirements.
              </p>
            </article>

            <article className="rounded-xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-sm font-semibold text-amber-400">03</p>
              <h3 className="mt-4 text-xl font-semibold">
                Professional controls
              </h3>
              <p className="mt-4 leading-7 text-slate-400">
                Assumptions, evidence, traceability, peer review and
                accountability remain explicit.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Volume 1 */}
      <section
        id="volume-1"
        className="border-b border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
              Volume 1
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              AI Foundations &amp; Professional Prompt Library
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-300">
              A structured early-stage development system covering responsible
              AI use, due diligence, site screening, development planning,
              land, field evidence, environmental constraints, risk and CAPEX.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-2">
            {chapters.map((chapter) => (
              <article
                key={chapter.number}
                className="bg-[#060c1d] p-6 transition hover:bg-white/[0.05]"
              >
                <div className="flex gap-5">
                  <span className="text-sm font-semibold text-amber-400">
                    {chapter.number}
                  </span>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Chapter {Number(chapter.number)}
                    </p>
                    <h3 className="mt-2 font-semibold leading-6 text-white">
                      {chapter.title}
                    </h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="border-b border-white/10 bg-[#060c1d]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
              Built for professionals
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Designed for people responsible for real projects
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((audience) => (
              <div
                key={audience}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-5 font-medium text-slate-200"
              >
                {audience}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Purchase */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 lg:grid-cols-[1fr_0.7fr] lg:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
                Publisher Edition
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Start with Volume 1
              </h2>

              <p className="mt-5 max-w-2xl leading-8 text-slate-300">
                Immediate digital access to the complete professional handbook
                and prompt library.
              </p>

              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {productFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 text-sm leading-6 text-slate-300"
                  >
                    <span
                      className="font-semibold text-amber-400"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#030817] p-7">
              <p className="text-sm text-slate-400">Launch price</p>

              <div className="mt-3 flex items-end gap-3">
                <span className="text-xl text-slate-500 line-through">€59</span>
                <span className="text-5xl font-bold tracking-tight text-white">
                  €49
                </span>
              </div>

              <p className="mt-3 text-sm text-amber-400">
                Save €10 during the launch period
              </p>

              <p className="mt-6 text-sm text-slate-400">One-time payment</p>

              <a
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-amber-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                Get Instant Access
              </a>

              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                Secure checkout and digital delivery through Lemon Squeezy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="border-b border-white/10 bg-[#060c1d]"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
              About SolarDev AI
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Practitioner-led AI for renewable-energy development
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-300">
              SolarDev AI develops professional methodologies, handbooks and
              tools for the responsible use of artificial intelligence across
              utility-scale solar PV and Battery Energy Storage System project
              development.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="border-b border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
                Contact
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Questions about the handbook or SolarDev AI?
              </h2>

              <p className="mt-6 max-w-2xl leading-8 text-slate-300">
                Contact us regarding Volume 1, digital delivery, professional
                use, future volumes or corporate licensing.
              </p>
            </div>

            <address className="not-italic">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-7">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  General enquiries
                </p>

                <a
                  href="mailto:info@solardev.ai"
                  className="mt-2 block font-semibold text-white hover:text-amber-400"
                >
                  info@solardev.ai
                </a>

                <div className="my-6 border-t border-white/10" />

                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Customer support
                </p>

                <a
                  href="mailto:support@solardev.ai"
                  className="mt-2 block font-semibold text-white hover:text-amber-400"
                >
                  support@solardev.ai
                </a>
              </div>
            </address>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#020611]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="font-semibold text-white">SolarDev AI</p>
            <p className="mt-2 text-sm text-slate-500">
              AI for Utility-Scale Solar &amp; BESS Professionals.
            </p>
          </div>

          <div className="text-sm text-slate-500 lg:text-right">
            <p>
              <a
                href="mailto:info@solardev.ai"
                className="hover:text-white"
              >
                info@solardev.ai
              </a>
            </p>

            <p className="mt-1">
              <a
                href="mailto:support@solardev.ai"
                className="hover:text-white"
              >
                support@solardev.ai
              </a>
            </p>

            <p className="mt-5">
              © {new Date().getFullYear()} SolarDev AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}