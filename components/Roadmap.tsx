import Link from "next/link";

const projectMetrics = [
  ["Site area", "82.4 ha"],
  ["Indicative yield", "1,782 kWh/kWp"],
  ["Constraint status", "Moderate"],
  ["Grid context", "Review required"],
  ["Development gaps", "4"],
];

const screeningChecks = [
  { label: "Terrain", status: "clear" },
  { label: "Protected areas", status: "clear" },
  { label: "Flood", status: "review" },
  { label: "Surface water", status: "clear" },
  { label: "Grid evidence", status: "review" },
] as const;

const roadmapItems = [
  { label: "Delivered", title: "Handbooks", detail: "Two professional reference volumes" },
  { label: "Available", title: "Engineering tools", detail: "GIS Site Check and Solar Geometry" },
  { label: "Live", title: "Project workspace + agent", detail: "Evidence-led project assessment" },
  { label: "Next", title: "Evidence expansion", detail: "More sources, spatial intelligence and review" },
];

function AssessmentCard() {
  return (
    <article className="overflow-hidden rounded-3xl border border-[#10271f]/10 bg-white shadow-2xl shadow-[#10271f]/10">
      <header className="flex flex-col gap-5 bg-[#071d17] px-6 py-6 text-white sm:flex-row sm:items-start sm:justify-between sm:px-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">Example project assessment</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight">50 MWp Solar PV</h3>
          <p className="mt-1 text-sm text-slate-300">Andalusia, Spain</p>
        </div>
        <span className="w-fit rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-300">Illustrative</span>
      </header>

      <div className="p-6 sm:p-8">
        <dl className="divide-y divide-[#10271f]/10 border-y border-[#10271f]/10">
          {projectMetrics.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[1fr_auto] gap-5 py-3.5 text-sm">
              <dt className="text-[#536860]">{label}</dt>
              <dd className={`text-right font-semibold ${label === "Constraint status" ? "text-amber-700" : "text-[#10271f]"}`}>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#778a82]">Preliminary screening</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {screeningChecks.map((check) => {
              const needsReview = check.status === "review";
              return (
                <li key={check.label} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold ${needsReview ? "border-amber-700/15 bg-amber-50 text-amber-900" : "border-emerald-700/10 bg-emerald-50 text-[#29483c]"}`}>
                  <span aria-hidden="true" className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${needsReview ? "bg-amber-200 text-amber-900" : "bg-emerald-200 text-emerald-900"}`}>{needsReview ? "!" : "✓"}</span>
                  {check.label}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-7 rounded-2xl bg-emerald-500 p-5 text-[#071d17] sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-950/65">SolarDev recommendation</p>
          <p className="mt-2 text-xl font-black tracking-tight sm:text-2xl">Proceed to next screening stage</p>
          <p className="mt-1 text-sm font-medium text-emerald-950/75">Subject to grid and hydrology verification</p>
        </div>
      </div>
    </article>
  );
}

export default function Roadmap() {
  return (
    <section id="roadmap" aria-labelledby="assessment-title" className="relative scroll-mt-24 overflow-hidden border-y border-[#10271f]/10 bg-[#f4f5f0] py-16 text-[#10271f] sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-12 h-80 w-80 rounded-full bg-emerald-400/[0.06] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <AssessmentCard />

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">See the decision, not just the data</p>
            <h2 id="assessment-title" className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Know what to do next with a potential site</h2>
            <p className="mt-6 text-lg leading-8 text-[#536860]">SolarDev turns an early project boundary into a structured screening view: the core metrics, the constraints that need attention and a clear recommendation for the next development gate.</p>
            <Link href="/tools/solar-site-screening" className="mt-7 inline-flex rounded-xl bg-[#10271f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#29483c]">Assess a site now</Link>

            <div className="mt-10 border-t border-[#10271f]/10 pt-7">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#778a82]">Product roadmap</p>
                  <h3 className="mt-2 text-lg font-semibold">From reference to live workflow</h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-800">Live today</span>
              </div>

              <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {roadmapItems.map((item, index) => (
                  <li key={item.title} className="flex gap-3 rounded-xl border border-[#10271f]/10 bg-white/65 p-3.5">
                    <span aria-hidden="true" className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${index < 3 ? "bg-emerald-500" : "bg-[#c7d1cc]"}`} />
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-700">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-[#778a82]">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
