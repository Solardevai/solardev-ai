import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-white/10"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 -top-32 h-[34rem] w-[34rem] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-40 top-16 h-[34rem] w-[34rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <div className="relative mx-auto grid min-h-[820px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[0.82fr_1.18fr] lg:py-24">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
            Engineering tools for Solar PV &amp; BESS
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Screen · Quantify · Export
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[1.03] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            Utility-Scale Solar &amp; BESS Project Development Tools
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Move early-stage projects forward with better site intelligence,
            transparent calculations and practitioner-led engineering
            workflows.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/tools/solar-site-screening"
              className="rounded-xl bg-emerald-400 px-7 py-4 text-center font-semibold text-slate-950 shadow-lg shadow-emerald-400/10 transition hover:-translate-y-0.5 hover:bg-emerald-300"
            >
              Open Site Assessment
            </Link>
            <Link
              href="/tools/sun-path"
              className="rounded-xl bg-amber-400 px-7 py-4 text-center font-semibold text-slate-950 shadow-lg shadow-amber-400/10 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Open Solar Angle
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-400">
            {[
              "No account required",
              "Satellite-based workflows",
              "Screening-level outputs",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-8 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between px-2 pb-4 pt-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  SolarDev engineering workspace
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  Early-stage decision support
                </p>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                Live tools
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Link
                href="/tools/solar-site-screening"
                className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-950 transition hover:border-emerald-400/35"
              >
                <div className="relative h-52 overflow-hidden bg-[#193224]">
                  <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(28deg,transparent_45%,rgba(148,163,184,.35)_46%,rgba(148,163,184,.35)_49%,transparent_50%),linear-gradient(105deg,transparent_54%,rgba(100,116,139,.3)_55%,rgba(100,116,139,.3)_58%,transparent_59%),radial-gradient(circle_at_25%_28%,#355c3c_0,transparent_30%),radial-gradient(circle_at_75%_65%,#223e32_0,transparent_34%)]" />
                  <svg viewBox="0 0 360 220" aria-hidden="true" className="absolute inset-0 h-full w-full">
                    <path d="M78 58L278 44L318 151L207 192L55 142Z" fill="rgba(52,211,153,.18)" stroke="#34d399" strokeWidth="3" />
                    {[[78,58],[278,44],[318,151],[207,192],[55,142]].map(([x,y]) => (
                      <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#020617" stroke="#6ee7b7" strokeWidth="3" />
                    ))}
                    <circle cx="294" cy="73" r="15" fill="rgba(34,211,238,.25)" stroke="#fff" strokeWidth="2" />
                    <circle cx="294" cy="73" r="6" fill="#22d3ee" />
                  </svg>
                  <span className="absolute left-4 top-4 rounded-lg border border-emerald-400/20 bg-slate-950/85 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                    Site Assessment
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2">
                    <Metric label="Area" value="42.8 ha" />
                    <Metric label="Perimeter" value="2.9 km" />
                    <Metric label="Yield" value="1,684" unit="kWh/kWp" />
                  </div>
                </div>
                <div className="p-4">
                  <strong className="block text-base text-white group-hover:text-emerald-200">
                    Define and quantify a candidate site
                  </strong>
                  <span className="mt-2 block text-xs leading-5 text-slate-400">
                    Draw the boundary, inspect grid context, run an indicative
                    PVGIS check and export boundary or TMY files.
                  </span>
                </div>
              </Link>

              <div className="contents">
                <Link
                  href="/tools/sun-path"
                  className="group rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_75%_15%,rgba(251,191,36,.14),transparent_48%),#020617] p-4 transition hover:border-amber-400/35"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-flex rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">
                        Solar Angle
                      </span>
                      <strong className="mt-2 block text-sm leading-5 text-white group-hover:text-amber-200">
                        Test solar geometry at a point
                      </strong>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-lg text-slate-950 shadow-[0_0_24px_rgba(251,191,36,.35)]">
                      ☀
                    </span>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Metric label="Azimuth" value="154.2°" />
                    <Metric label="Elevation" value="21.8°" />
                  </div>
                  <span className="mt-3 block text-xs leading-5 text-slate-400">
                    Review sun direction, elevation, daylight and indicative
                    flat-ground shading.
                  </span>
                </Link>

                <Link
                  href="/handbooks"
                  className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-blue-400/30 hover:bg-blue-400/[0.05]"
                >
                  <span className="inline-flex rounded-lg border border-blue-400/20 bg-blue-400/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300">
                    Handbooks
                  </span>
                  <strong className="mt-2 block text-sm leading-5 text-white group-hover:text-blue-200">
                    Apply the outputs within controlled workflows
                  </strong>
                  <span className="mt-2 block text-xs leading-5 text-slate-400">
                    Development methodology, due diligence and reusable AI
                    workflows for Solar PV and BESS teams.
                  </span>
                  <span className="mt-4 inline-flex text-xs font-semibold text-blue-300">
                    Explore both volumes →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <span className="rounded-lg border border-white/10 bg-slate-950/85 px-2.5 py-2 shadow-lg backdrop-blur">
      <span className="block text-[8px] uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <span className="mt-0.5 block font-mono text-xs font-semibold text-white">
        {value}
      </span>
      {unit && <span className="block text-[7px] text-slate-500">{unit}</span>}
    </span>
  );
}
