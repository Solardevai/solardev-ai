import Link from "next/link";
import { workflowGuides } from "@/data/workflowGuides";

function GisPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/30">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">SolarDev GIS</p>
          <p className="mt-1 text-xs font-semibold text-white">Candidate site workspace</p>
        </div>
        <span className="rounded-full bg-emerald-300/10 px-2.5 py-1 text-[9px] font-bold text-emerald-200">LIVE</span>
      </div>
      <div className="grid grid-cols-[72px_1fr_92px]">
        <div className="space-y-2 border-r border-white/10 p-3">
          {["Satellite", "Roads", "Grid", "Water", "Terrain"].map((item, index) => (
            <div key={item} className="flex items-center gap-1.5 text-[7px] text-slate-500">
              <span className={`h-2 w-2 rounded-sm ${index < 4 ? "bg-emerald-400" : "bg-orange-400"}`} />
              {item}
            </div>
          ))}
        </div>
        <div className="relative min-h-64 overflow-hidden bg-[#294333] [background-image:linear-gradient(25deg,transparent_44%,rgba(217,180,104,.24)_45%,rgba(217,180,104,.24)_53%,transparent_54%),linear-gradient(112deg,transparent_52%,rgba(17,41,30,.42)_53%,rgba(17,41,30,.42)_61%,transparent_62%),radial-gradient(circle_at_22%_25%,#526b3d_0,transparent_30%),radial-gradient(circle_at_75%_70%,#19382e_0,transparent_32%)]">
          <svg viewBox="0 0 420 280" aria-hidden="true" className="absolute inset-0 h-full w-full">
            <path d="M65 55L345 38L376 205L222 252L48 180Z" fill="rgba(52,211,153,.12)" stroke="#020617" strokeWidth="8" strokeLinejoin="round" />
            <path d="M65 55L345 38L376 205L222 252L48 180Z" fill="none" stroke="#34d399" strokeWidth="4" strokeLinejoin="round" />
            <path d="M95 92L170 77L211 112L182 156L104 149Z" fill="none" stroke="#f97316" strokeWidth="5" strokeLinejoin="round" />
            <path d="M238 60C254 96 277 109 314 124C335 133 348 150 365 170" fill="none" stroke="#020617" strokeWidth="10" />
            <path d="M238 60C254 96 277 109 314 124C335 133 348 150 365 170" fill="none" stroke="#22d3ee" strokeWidth="5" />
          </svg>
          <div className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-slate-950/85 px-3 py-2 text-[8px] text-slate-300 backdrop-blur">
            <span className="font-bold text-emerald-200">42.8 ha</span> · 2.9 km perimeter
          </div>
        </div>
        <div className="space-y-3 border-l border-white/10 p-3">
          {[['Score','82/100'],['Coverage','100%'],['Yield','1,684']].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-white/[0.04] p-2">
              <p className="text-[7px] uppercase text-slate-600">{label}</p>
              <p className="mt-1 text-[10px] font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportPreview() {
  return (
    <div className="relative mx-auto h-72 max-w-xs rounded-2xl border border-white/10 bg-slate-100 p-5 text-slate-950 shadow-2xl shadow-black/30">
      <div className="h-20 rounded-lg bg-slate-950 p-4 text-white">
        <p className="text-[7px] font-bold tracking-[0.14em] text-emerald-300">SOLARDEV AI</p>
        <p className="mt-2 text-sm font-bold">Preliminary screening report</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {[['Score','82/100'],['Area','42.8 ha'],['Perimeter','2.9 km'],['Yield','1,684 kWh/kWp']].map(([label, value]) => (
          <div key={label} className="rounded-md border border-slate-200 p-2">
            <p className="text-[6px] font-bold uppercase text-slate-400">{label}</p>
            <p className="mt-1 text-[9px] font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 h-20 rounded-lg bg-[#35533d] p-2">
        <svg viewBox="0 0 260 80" aria-hidden="true" className="h-full w-full">
          <path d="M28 15L217 9L240 57L133 72L20 51Z" fill="rgba(52,211,153,.12)" stroke="#052e2b" strokeWidth="5" />
          <path d="M28 15L217 9L240 57L133 72L20 51Z" fill="none" stroke="#34d399" strokeWidth="2.5" />
        </svg>
      </div>
      <div className="absolute -right-3 -top-3 rounded-full bg-emerald-400 px-3 py-2 text-[8px] font-black text-slate-950">PDF</div>
    </div>
  );
}

export default function PlatformExperience() {
  return (
    <>
      <section id="platform" className="border-b border-white/10 bg-slate-900/40 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">One professional platform</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Move from site boundary to decision-ready evidence</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">Use free engineering tools now, preserve project evidence in a GIS workspace and follow the platform toward controlled specialist agents.</p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1.35fr_.65fr] lg:items-center">
            <GisPreview />
            <div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-200">Free now</span>
              <h3 className="mt-5 text-3xl font-semibold">GIS Site Check</h3>
              <p className="mt-4 leading-7 text-slate-300">Draw or upload a boundary, use satellite mapping, quantify area and perimeter, estimate PVGIS yield, inspect grid context and continue into constraint screening.</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li>✓ Satellite and topographic basemaps</li>
                <li>✓ Terrain, environmental, water and infrastructure screening</li>
                <li>✓ Saved projects, GIS exports and professional reports</li>
              </ul>
              <Link href="/tools/solar-site-screening" className="mt-7 inline-flex rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300">Launch free GIS Site Check</Link>
            </div>
          </div>

          <div className="mt-16 grid gap-8 rounded-3xl border border-white/10 bg-white/[0.025] p-6 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:p-10">
            <ReportPreview />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-300">Tangible project outputs</p>
              <h3 className="mt-4 text-3xl font-semibold">See what the platform produces</h3>
              <p className="mt-5 leading-7 text-slate-300">Every saved assessment can become a dated evidence package with a satellite boundary exhibit, perimeter, indicative yield, criterion results, source register, constraints CSV and clear professional limitations.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {['Explainable score','Dated map exhibit','PDF + CSV exports'].map((item) => <div key={item} className="rounded-xl border border-white/10 bg-slate-950 p-4 text-sm font-semibold text-slate-200">{item}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-slate-950 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300">Platform direction</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Meet the Project Development Agent</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">A specialist agent designed around real development stages, evidence registers, information gaps, risk ownership and decision gates—not generic chat.</p>
            <Link href="/agents/project-development" className="mt-7 inline-flex rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-300">Try the interactive preview</Link>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div><p className="text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-300">Project Development Agent</p><p className="mt-1 text-sm font-semibold">Evidence-led action brief</p></div>
              <span className="rounded-full bg-amber-300/10 px-3 py-1 text-[9px] font-bold text-amber-200">PREVIEW</span>
            </div>
            <div className="mt-4 rounded-xl bg-white/[0.035] p-4 text-sm leading-6 text-slate-300">“Review this feasibility-stage site and define the three actions needed before the next investment gate.”</div>
            <div className="mt-4 space-y-2">
              {["Validate the usable-area bridge against mapped exclusions.","Confirm the grid option, route and authority evidence.","Close material survey gaps before fixing capacity and CAPEX."].map((item,index)=><div key={item} className="flex gap-3 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.04] p-3 text-sm text-slate-300"><span className="font-mono font-bold text-emerald-300">0{index+1}</span>{item}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-slate-900/35 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Workflow library</p><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Engineering guidance built around real decisions</h2></div>
            <Link href="/insights" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">Explore all {workflowGuides.length} guides →</Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {workflowGuides.slice(0,8).map((guide)=><Link key={guide.slug} href={`/insights/${guide.slug}`} className="rounded-2xl border border-white/10 bg-slate-950 p-5 transition hover:-translate-y-0.5 hover:border-emerald-300/30"><span className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-300">{guide.category}</span><h3 className="mt-3 font-semibold leading-6 text-white">{guide.title}</h3></Link>)}
          </div>
        </div>
      </section>
    </>
  );
}
