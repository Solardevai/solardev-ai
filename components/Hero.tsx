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
            Build the engineering basis before fixing project value.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#536860]">
            Combine project guidance, GIS site screening and sun-position
            analysis in one traceable workspace for Solar PV and BESS decisions.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/agents/project-development"
              className="rounded-xl bg-emerald-500 px-7 py-4 text-center font-semibold text-[#071d17] shadow-lg shadow-emerald-700/10 transition hover:-translate-y-0.5 hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f5f0]"
            >
              Open the Engineering Copilot
            </Link>
            <Link
              href="/tools/solar-site-screening"
              className="rounded-xl border border-[#10271f]/20 bg-white/60 px-7 py-4 text-center font-semibold text-[#10271f] transition hover:-translate-y-0.5 hover:border-emerald-600/40 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f5f0]"
            >
              Run a GIS site screen
            </Link>
            <Link
              href="/tools/sun-path"
              className="rounded-xl border border-[#10271f]/20 bg-white/60 px-7 py-4 text-center font-semibold text-[#10271f] transition hover:-translate-y-0.5 hover:border-amber-500/50 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f5f0]"
            >
              Check sun position
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-[#536860]">
            {proofPoints.map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-emerald-600">✓</span>
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
                  SolarDev Engineering Copilot
                </p>
                <p className="mt-1 text-sm font-semibold text-[#10271f]">
                  General engineering guidance
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#10271f]/10 bg-[#edf0e9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#29483c]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            </div>

            <div className="grid min-h-[500px] md:grid-cols-[1fr_150px]">
              <div className="p-5 sm:p-7">
                <div className="rounded-2xl bg-emerald-500 p-5 text-[#071d17] shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">You</p>
                  <p className="mt-3 text-sm font-semibold leading-6 sm:text-base">
                    Review this feasibility-stage site and define the actions
                    needed before the next investment gate.
                  </p>
                </div>

                <div className="mt-5 rounded-2xl border border-[#10271f]/10 bg-[#f8f9f5] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                      Engineering action brief
                    </p>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-bold text-emerald-800">
                      CALCULATED + SOURCED
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {actionBrief.map((item, index) => (
                      <div
                        key={item}
                        className="flex gap-3 rounded-xl border border-[#10271f]/8 bg-white p-3 text-xs leading-5 text-[#29483c]"
                      >
                        <span className="font-mono font-bold text-emerald-700">
                          0{index + 1}
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-wide text-[#536860]">
                    <span className="rounded-full bg-[#edf0e9] px-2.5 py-1">Sources labelled</span>
                    <span className="rounded-full bg-[#edf0e9] px-2.5 py-1">Assumptions stated</span>
                    <span className="rounded-full bg-[#edf0e9] px-2.5 py-1">Gaps flagged</span>
                  </div>
                </div>
              </div>

              <aside className="flex flex-col border-t border-[#10271f]/10 bg-[#edf0e9] p-5 md:border-l md:border-t-0">
                <div className="mx-auto mt-2 flex h-24 w-24 items-center justify-center rounded-full border border-white bg-white/70 shadow-inner">
                  <div className="h-12 w-12 rounded-full border-2 border-[#10271f] bg-[radial-gradient(circle_at_35%_30%,white,#dce4df)] shadow-lg" />
                </div>
                <p className="mt-5 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                  Sol · Copilot
                </p>
                <p className="mt-2 text-center text-xs text-[#536860]">
                  Ready when you are
                </p>
                <div className="mt-auto space-y-2 pt-8">
                  <MiniCapability label="DC/AC ratio" />
                  <MiniCapability label="Land capacity" />
                  <MiniCapability label="BESS sizing" />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniCapability({ label }: { label: string }) {
  return (
    <span className="block rounded-lg border border-[#10271f]/10 bg-white/65 px-3 py-2 text-center text-[9px] font-semibold text-[#29483c]">
      {label}
    </span>
  );
}
