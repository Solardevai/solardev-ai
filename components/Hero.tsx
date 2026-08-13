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

      <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-6 py-20 lg:py-24">
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
      </div>
    </section>
  );
}
