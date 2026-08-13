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

      <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#10271f]/10 bg-white/70 px-4 py-2 text-sm font-semibold text-[#29483c] shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,.45)]" />
            Three connected project-development tools
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
            Screen · Develop · Decide
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[1.03] tracking-[-0.045em] text-[#10271f] sm:text-6xl lg:text-7xl">
            Solar and Storage Platform.
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

        <Link
          href="/agents/project-development"
          aria-label="Open the SolarDev Solar and BESS Agent"
          className="group relative block"
        >
          <div className="absolute inset-6 rounded-full bg-emerald-300/30 blur-3xl transition group-hover:bg-emerald-300/40" />

          <div className="relative overflow-hidden rounded-[2rem] border border-[#10271f]/10 bg-white/75 p-5 shadow-2xl shadow-[#10271f]/10 backdrop-blur sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                  Project Development Agent
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#10271f] sm:text-2xl">
                  Ask a project question
                </h2>
              </div>

              <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#10271f]/10 bg-[#edf0e9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#29483c]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            </div>

            <div className="mt-6 min-h-48 rounded-[1.75rem] border border-[#10271f]/15 bg-white px-5 py-5 shadow-[0_14px_35px_rgba(16,39,31,0.08)] sm:min-h-52 sm:px-7 sm:py-6">
              <p className="text-base leading-7 text-[#7b8c85] sm:text-lg">
                Ask a solar PV, BESS or project-development question…
              </p>

              <div className="mt-20 flex items-end justify-between gap-4 sm:mt-24">
                <span className="text-[10px] text-[#899790] sm:text-xs">
                  Enter to send · Shift + Enter for a new line
                </span>

                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ced8d3] text-[#71827b] transition group-hover:bg-emerald-400 group-hover:text-[#071d17]">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                  >
                    <path
                      d="M12 19V5M6.5 10.5 12 5l5.5 5.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <p className="mt-5 text-sm font-semibold text-emerald-700">
              Open the Solar and BESS Agent →
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
