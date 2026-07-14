import Image from "next/image";

const checkoutUrl =
  "PASTE_YOUR_LEMON_SQUEEZY_CHECKOUT_URL_HERE";

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

const audiences = [
  "Project Development Engineers",
  "Solar & BESS Engineers",
  "Owner’s Engineers",
  "Technical Advisors",
  "EPC Professionals",
  "Developers and Investors",
];

const features = [
  {
    title: "Engineering methodology",
    text: "Structured workflows based on real utility-scale Solar PV and BESS development activities.",
  },
  {
    title: "Consultant-grade prompts",
    text: "Prompts built around roles, inputs, deliverables, constraints, risks and validation.",
  },
  {
    title: "Professional controls",
    text: "Assumptions, evidence, traceability, peer review and accountability remain explicit.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#" className="text-xl font-bold tracking-tight">
            SolarDev <span className="text-amber-400">AI</span>
          </a>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a
              href="#volume-1"
              className="transition hover:text-white"
            >
              Volume 1
            </a>

            <a
              href="#inside"
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
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Get Volume 1
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_35%)]" />

        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
          <div>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.28em] text-amber-400">
              Professional Handbook Series
            </p>

            <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              AI for Utility-Scale Solar &amp; BESS Project Development
            </h1>

            <p className="mt-7 max-w-2xl text-xl leading-8 text-slate-300">
              Professional engineering methodologies, controlled AI workflows
              and consultant-grade prompts for renewable-energy professionals.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-amber-400 px-7 py-4 text-center font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                Get Volume 1 — €49
              </a>

              <a
                href="#inside"
                className="rounded-xl border border-white/15 px-7 py-4 text-center font-semibold transition hover:bg-white/5"
              >
                Explore the Handbook
              </a>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-2 gap-5 text-sm text-slate-300 sm:grid-cols-4">
              <div>
                <strong className="block text-2xl text-white">218</strong>
                Pages
              </div>

              <div>
                <strong className="block text-2xl text-white">10</strong>
                Chapters
              </div>

              <div>
                <strong className="block text-2xl text-white">3</strong>
                Prompt levels
              </div>

              <div>
                <strong className="block text-2xl text-white">1</strong>
                Engineering system
              </div>
            </div>
          </div>

          {/* Book cover */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-10 rounded-full bg-amber-400/10 blur-3xl" />

              <div className="relative">
                <Image
                  src="/volume-1-cover.png"
                  alt="AI for Utility-Scale Solar and BESS Project Development, Volume 1"
                  width={900}
                  height={1273}
                  priority
                  className="h-auto w-full rounded-sm shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Positioning */}
      <section className="border-y border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              Engineering first
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Not another generic AI prompt book
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              SolarDev AI places artificial intelligence inside controlled
              engineering workflows. The objective is not to replace
              professional judgement, but to improve the consistency,
              traceability and speed of project-development work.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
              >
                <h3 className="text-xl font-semibold">{item.title}</h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Volume 1 */}
      <section
        id="volume-1"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24"
      >
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              Volume 1
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight">
              AI Foundations &amp; Professional Prompt Library
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              A structured early-stage development system covering responsible
              AI use, due diligence, site screening, development planning, land,
              field evidence, environmental constraints, risk and CAPEX.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {chapters.map((chapter, index) => (
              <div
                key={chapter}
                className="rounded-xl border border-white/10 bg-slate-900 p-5"
              >
                <span className="text-sm font-semibold text-amber-400">
                  Chapter {index + 1}
                </span>

                <p className="mt-2 font-medium leading-6">
                  {chapter}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience */}
      <section
        id="inside"
        className="scroll-mt-24 bg-white text-slate-950"
      >
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">
              Built for professionals
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight">
              Designed for people responsible for real projects
            </h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((audience) => (
              <div
                key={audience}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6 font-semibold"
              >
                {audience}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="buy"
        className="mx-auto max-w-5xl scroll-mt-24 px-6 py-24"
      >
        <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
                Publisher Edition
              </p>

              <h2 className="mt-4 text-4xl font-bold">
                Start with Volume 1
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Immediate digital access to the complete professional handbook
                and prompt library.
              </p>

              <ul className="mt-8 grid gap-3 text-slate-300 sm:grid-cols-2">
                <li>✓ 218-page PDF edition</li>
                <li>✓ 10 professional chapters</li>
                <li>✓ Quick, Professional and Expert prompts</li>
                <li>✓ Worked examples and checklists</li>
                <li>✓ Engineering risk controls</li>
                <li>✓ Minor corrections for this edition</li>
              </ul>
            </div>

            <div className="min-w-64 rounded-2xl bg-white p-7 text-slate-950">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Launch price
              </p>

              <div className="mt-3 flex items-end gap-3">
                <span className="text-2xl text-slate-400 line-through">
                  €59
                </span>

                <span className="text-5xl font-bold">€49</span>
              </div>

              <p className="mt-3 text-sm font-medium text-green-700">
                Save €10 during the launch period
              </p>

              <p className="mt-2 text-sm text-slate-500">
                One-time payment
              </p>

              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 block w-full rounded-xl bg-amber-400 px-6 py-4 text-center font-semibold transition hover:bg-amber-300"
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
        className="scroll-mt-24 border-t border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              About SolarDev AI
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              Practitioner-led AI for renewable-energy development
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              SolarDev AI develops professional methodologies, handbooks and
              tools for the responsible use of artificial intelligence across
              utility-scale Solar PV and Battery Energy Storage System project
              development.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="scroll-mt-24 border-t border-white/10 bg-slate-900/40"
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
                Contact
              </p>

              <h2 className="mt-4 text-3xl font-bold">
                Questions about the handbook or SolarDev AI?
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Contact us regarding Volume 1, digital delivery, professional
                use, future volumes or corporate licensing.
              </p>
            </div>

            <div className="space-y-5 rounded-2xl border border-white/10 bg-slate-950 p-7">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  General enquiries
                </p>

                <a
                  href="mailto:info@solardev.ai"
                  className="mt-2 inline-block text-lg font-semibold text-amber-400 transition hover:text-amber-300"
                >
                  info@solardev.ai
                </a>
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Customer support
                </p>

                <a
                  href="mailto:support@solardev.ai"
                  className="mt-2 inline-block text-lg font-semibold text-amber-400 transition hover:text-amber-300"
                >
                  support@solardev.ai
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 text-sm text-slate-400 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-white">
              SolarDev <span className="text-amber-400">AI</span>
            </p>

            <p className="mt-3 max-w-xs leading-6">
              AI for Utility-Scale Solar &amp; BESS Professionals.
            </p>
          </div>

          <div>
            <p className="font-semibold text-white">Contact</p>

            <div className="mt-3 space-y-2">
              <p>
                <a
                  href="mailto:info@solardev.ai"
                  className="transition hover:text-amber-400"
                >
                  info@solardev.ai
                </a>
              </p>

              <p>
                <a
                  href="mailto:support@solardev.ai"
                  className="transition hover:text-amber-400"
                >
                  support@solardev.ai
                </a>
              </p>
            </div>
          </div>

          <div className="md:text-right">
            <p>© 2026 SolarDev AI.</p>
            <p className="mt-2">All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}