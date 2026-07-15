import { trustAudiences } from "@/data/siteData";

export default function TrustBar() {
  return (
    <section className="border-b border-white/10 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Designed for utility-scale renewable-energy professionals
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {trustAudiences.map((audience) => (
            <div
              key={audience}
              className="flex min-h-16 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] px-4 text-center text-sm font-medium text-slate-300 transition hover:border-amber-400/25 hover:bg-amber-400/[0.04] hover:text-white"
            >
              {audience}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}