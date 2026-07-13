export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20">
        <div className="max-w-4xl">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
            SolarDev AI
          </p>

          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            AI for Utility-Scale Solar & BESS Project Development
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-8 text-slate-300">
            Professional engineering methodologies, controlled AI workflows and
            consultant-grade prompts for renewable energy professionals.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button className="rounded-xl bg-amber-500 px-7 py-4 font-semibold text-slate-950 transition hover:bg-amber-400">
              Volume 1 — Coming Soon
            </button>

            <button className="rounded-xl border border-slate-700 px-7 py-4 font-semibold transition hover:border-slate-500 hover:bg-slate-900">
              Explore SolarDev AI
            </button>
          </div>

          <div className="mt-12 grid gap-4 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
            <div>218-page publisher edition</div>
            <div>10 professional chapters</div>
            <div>Engineering workflows</div>
            <div>Prompt library and checklists</div>
          </div>
        </div>
      </section>
    </main>
  );
}