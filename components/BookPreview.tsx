import Image from "next/image";
import { siteConfig } from "@/data/siteData";

const previewPages = [
  {
    src: "/previews/preview-8.png",
    alt: "Volume 1 contents showing the ten professional chapters",
    label: "Contents",
    title: "Complete early-stage development sequence",
    description:
      "Ten chapters covering AI foundations, due diligence, site screening, development planning, land, field evidence, environmental constraints, risk and CAPEX.",
  },
  {
    src: "/previews/preview-16.png",
    alt: "AI-assisted engineering workflow from the SolarDev AI handbook",
    label: "Engineering workflow",
    title: "Structured AI-assisted engineering",
    description:
      "A repeatable sequence connecting project information, structured prompts, draft analysis, engineering review and final deliverables.",
  },
  {
    src: "/previews/preview-18.png",
    alt: "Consultant-grade prompt and engineering commentary example",
    label: "Professional prompting",
    title: "Consultant-grade prompts",
    description:
      "Prompts are structured around professional roles, project context, evidence, deliverables, constraints, risks and validation.",
  },
  {
    src: "/previews/preview-40.png",
    alt: "Site identification and preliminary feasibility screening chapter",
    label: "Site screening",
    title: "Identify constraints and fatal flaws",
    description:
      "Methods for comparing technically plausible sites, identifying fatal flaws and prioritising development opportunities.",
  },
  {
    src: "/previews/preview-167.png",
    alt: "Initial project risk register chapter",
    label: "Risk management",
    title: "Build accountable risk registers",
    description:
      "Translate multidisciplinary findings into risks with clear causes, consequences, treatment actions, ownership and residual exposure.",
  },
  {
    src: "/previews/preview-192.png",
    alt: "Initial CAPEX benchmark chapter",
    label: "CAPEX benchmarking",
    title: "Create transparent initial investment ranges",
    description:
      "Develop estimate bases, benchmark assumptions, contingency ranges, sensitivities and uncertainty statements.",
  },
];

export default function BookPreview() {
  return (
    <section
      id="preview"
      className="relative overflow-hidden border-b border-white/10 bg-slate-900/45"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-20 h-[32rem] w-[32rem] rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute right-[-10rem] bottom-20 h-[30rem] w-[30rem] rounded-full bg-amber-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              Inside the handbook
            </p>

            <h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Preview the professional methodology before purchasing
            </h2>
          </div>

          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            Volume 1 combines engineering background, controlled workflows,
            professional tables, worked examples, consultant-grade prompts and
            final quality-control checklists.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {previewPages.map((page) => (
            <article
              key={page.src}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-950/75 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-amber-400/25"
            >
              <div className="relative aspect-[0.707/1] overflow-hidden bg-white">
                <Image
                  src={page.src}
                  alt={page.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover object-top transition duration-500 group-hover:scale-[1.025]"
                />

                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/90 to-transparent" />

                <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-slate-950/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-300 backdrop-blur">
                  {page.label}
                </span>
              </div>

              <div className="p-7">
                <h3 className="text-xl font-bold text-white">{page.title}</h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {page.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl border border-amber-400/20 bg-amber-400/[0.045] p-7 sm:flex-row sm:items-center sm:p-9">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
              Complete Publisher Edition
            </p>

            <h3 className="mt-3 text-2xl font-bold text-white">
              Access all {siteConfig.product.pages} pages and ten professional
              chapters
            </h3>

            <p className="mt-3 max-w-3xl leading-7 text-slate-300">
              The purchased edition includes the full handbook, professional
              prompt library, worked examples, review checklists and engineering
              decision-support frameworks.
            </p>
          </div>

          <a
            href={siteConfig.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-xl bg-amber-400 px-7 py-4 text-center font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300"
          >
            Get Volume 1 — €{siteConfig.product.launchPrice}
          </a>
        </div>
      </div>
    </section>
  );
}