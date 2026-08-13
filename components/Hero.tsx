import Link from "next/link";

const proofPoints = [
  "Project-aware guidance",
  "Deterministic calculations",
  "Sources and assumptions labelled",
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-[#10271f]/10 bg-[#f4f5f0] text-[#10271f]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 -top-40 h-[34rem] w-[34rem] rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute -right-40 top-8 h-[38rem] w-[38rem] rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#edf0e9] to-transparent" />
      </div>

      <div className="relative mx-auto grid min-h-[790px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[0.82fr_1.18fr] lg:py-24">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-[#10271f]/10 bg-white/70 px-4 py-2 text-sm font-semibold text-[#29483c] shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,.45)]" />
            Three connected project-development tools
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
            Screen · Develop · Decide
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[1.03] tracking-[-0.045em] text-[#10271f] sm:text-6xl lg:text-7xl">
            Solar and Storage Platform
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#536860]">
            Combine project guidance, GIS site screening and sun-position
            analysis in one traceable workspace for Solar PV and BESS decisions.
          </p>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-[#536860]">
            {proofPoints.map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-emerald-600">
                  ✓
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-8 rounded-full bg-emerald-300/25 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-[#10271f]/10 bg-white/75 shadow-2xl shadow-[#10271f]/10 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#10271f]/10 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                  SolarDev project-development workspace
                </p>
                <p className="mt-1 text-sm font-semibold text-[#10271f]">
                  Three tools, one evidence trail
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#10271f]/10 bg-[#edf0e9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#29483c]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Available now
              </span>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
              <Link
                href="/agents/project-development"
                className="group flex min-h-80 flex-col rounded-2xl border border-emerald-700/15 bg-[#f8f9f5] p-4 transition hover:-translate-y-1 hover:border-emerald-600/40 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                    Project Development Agent
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
                    AI
                  </span>
                </div>
                <strong className="mt-4 block text-base leading-5 text-[#10271f] group-hover:text-emerald-800">
                  Turn project evidence into next actions
                </strong>
                <div className="mt-5 rounded-xl bg-emerald-500 p-3 text-[#071d17]">
                  <span className="text-[8px] font-bold uppercase tracking-wide">
                    Action brief
                  </span>
                  <span className="mt-2 block text-[11px] font-semibold leading-4">
                    Validate the grid route before the next investment gate.
                  </span>
                </div>
                <div className="mt-3 space-y-2 rounded-xl border border-[#10271f]/10 bg-white p-3">
                  <span className="block h-1.5 w-full rounded-full bg-[#dfe6e1]" />
                  <span className="block h-1.5 w-4/5 rounded-full bg-[#dfe6e1]" />
                  <span className="block h-1.5 w-2/5 rounded-full bg-emerald-300" />
                </div>
                <span className="mt-auto pt-5 text-xs font-semibold text-emerald-700">
                  Open the agent →
                </span>
              </Link>

              <Link
                href="/tools/solar-site-screening"
                className="group flex min-h-80 flex-col rounded-2xl border border-cyan-700/15 bg-[#f8f9f5] p-4 transition hover:-translate-y-1 hover:border-cyan-600/40 hover:shadow-lg"
              >
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-800">
                  GIS Site Screening
                </span>
                <strong className="mt-4 block text-base leading-5 text-[#10271f] group-hover:text-cyan-800">
                  Define and quantify a candidate site
                </strong>
                <div className="relative mt-5 h-28 overflow-hidden rounded-xl bg-[#dce9df]">
                  <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(30deg,transparent_46%,rgba(71,85,105,.35)_47%,rgba(71,85,105,.35)_50%,transparent_51%),radial-gradient(circle_at_70%_30%,#b6d5bf_0,transparent_35%)]" />
                  <svg
                    viewBox="0 0 180 110"
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full"
                  >
                    <path
                      d="M28 28L136 21L157 76L103 96L19 69Z"
                      fill="rgba(16,185,129,.2)"
                      stroke="#059669"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-1 font-mono text-[9px] font-bold text-[#29483c]">
                    42.8 ha
                  </span>
                </div>
                <span className="mt-3 block text-xs leading-5 text-[#536860]">
                  Boundaries, constraints, grid context and indicative yield.
                </span>
                <span className="mt-auto pt-5 text-xs font-semibold text-cyan-800">
                  Screen a site →
                </span>
              </Link>

              <Link
                href="/tools/sun-path"
                className="group flex min-h-80 flex-col rounded-2xl border border-amber-700/15 bg-[#f8f9f5] p-4 transition hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-lg"
              >
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-amber-700">
                  Sun Position
                </span>
                <strong className="mt-4 block text-base leading-5 text-[#10271f] group-hover:text-amber-700">
                  Test solar geometry at any point
                </strong>
                <div className="relative mt-5 h-28 overflow-hidden rounded-xl bg-[linear-gradient(to_bottom,#e9f3f0_0%,#f8e8bd_68%,#d8e2d9_69%)]">
                  <span className="absolute right-5 top-4 h-10 w-10 rounded-full bg-amber-400 shadow-[0_0_24px_rgba(251,191,36,.65)]" />
                  <span className="absolute bottom-4 left-4 right-4 h-px origin-left -rotate-[18deg] bg-amber-700/50" />
                  <span className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-1 font-mono text-[9px] font-bold text-[#29483c]">
                    154.2° · 21.8°
                  </span>
                </div>
                <span className="mt-3 block text-xs leading-5 text-[#536860]">
                  Azimuth, elevation, daylight and indicative shading.
                </span>
                <span className="mt-auto pt-5 text-xs font-semibold text-amber-700">
                  Check sun position →
                </span>
              </Link>
            </div>

            <Link
              href="/handbooks"
              className="group flex flex-col gap-2 border-t border-[#10271f]/10 bg-[#edf0e9]/70 px-5 py-4 transition hover:bg-blue-50/70 sm:flex-row sm:items-center sm:justify-between"
            >
              <span>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  Supporting knowledge · Handbooks
                </span>
                <span className="mt-1 block text-xs text-[#536860]">
                  Apply the tools within controlled Solar PV and BESS workflows.
                </span>
              </span>
              <span className="shrink-0 text-xs font-semibold text-blue-700 group-hover:text-blue-800">
                Explore both volumes →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
