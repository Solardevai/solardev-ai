import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Fictional GIS Screening Report Sample",
  description:
    "A fictional SolarDev AI screening-report example showing the intended evidence structure and professional limitations.",
  robots: { index: false, follow: false },
};

const findings = [
  {
    criterion: "Natura 2000",
    status: "No mapped overlap returned",
    evidence: "EEA example response · national verification still required",
  },
  {
    criterion: "Flood reporting context",
    status: "Further review required",
    evidence: "Fictional reporting-area intersection · not an inundation map",
  },
  {
    criterion: "Terrain assumption",
    status: "6.0 ha preliminary mask",
    evidence: "North-facing cells above a selected 5° threshold · ~30 m DEM",
  },
  {
    criterion: "Grid context",
    status: "Unconfirmed",
    evidence: "Mapped assets only · no operator capacity or connection offer",
  },
] as const;

export default function ScreeningReportSamplePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 px-6 py-14 text-white">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-slate-100 text-slate-950 shadow-2xl shadow-black/30">
          <header className="bg-slate-950 p-7 text-white sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                  SolarDev AI · fictional sample
                </p>
                <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
                  Preliminary screening-index report
                </h1>
                <p className="mt-3 text-slate-300">Illustrative Iberian candidate</p>
              </div>
              <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-amber-200">
                Not a real project
              </span>
            </div>
          </header>

          <div className="p-7 sm:p-10">
            <dl className="grid gap-4 sm:grid-cols-4">
              <Metric label="Screening index" value="72/100" />
              <Metric label="Source coverage" value="75%" />
              <Metric label="Gross area" value="50.0 ha" />
              <Metric label="Perimeter" value="3.1 km" />
            </dl>

            <section className="mt-10">
              <h2 className="text-2xl font-bold">Development-envelope assumptions</h2>
              <dl className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                <BridgeRow label="Gross boundary" value="50.0 ha" />
                <BridgeRow label="Selected north-facing terrain mask" value="−6.0 ha" />
                <BridgeRow label="Other land allowance at 15%" value="−6.6 ha" />
                <BridgeRow label="Indicative usable-area assumption" value="37.4 ha" strong />
                <BridgeRow label="Indicative DC capacity at 0.65 MWp/ha" value="24.3 MWp" strong />
                <BridgeRow label="Indicative AC capacity at 1.25 DC/AC" value="19.4 MW" />
                <BridgeRow label="Illustrative production at 1,600 kWh/kWp" value="38.9 GWh/year" />
              </dl>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-bold">Criterion evidence</h2>
              <div className="mt-5 space-y-3">
                {findings.map((finding) => (
                  <article key={finding.criterion} className="rounded-2xl border border-slate-200 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="font-bold">{finding.criterion}</h3>
                      <span className="text-sm font-semibold text-slate-700">{finding.status}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{finding.evidence}</p>
                  </article>
                ))}
              </div>
            </section>

            <aside className="mt-10 rounded-2xl border border-amber-300 bg-amber-50 p-6">
              <h2 className="font-bold">Professional limitation</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                This fictional example demonstrates report structure only. It
                does not establish land rights, consentability, grid capacity,
                flood safety, constructability, project yield, valuation or an
                investment recommendation.
              </p>
            </aside>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/samples/solardev-sample-constraint-register.csv" download className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">
                Download matching sample CSV
              </a>
              <Link href="/methodology" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold">
                Review methodology disclosure
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">{label}</dt>
      <dd className="mt-2 text-xl font-black">{value}</dd>
    </div>
  );
}

function BridgeRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-slate-200 bg-white px-5 py-4 last:border-b-0">
      <dt className="text-sm text-slate-600">{label}</dt>
      <dd className={strong ? "font-black text-emerald-700" : "font-semibold"}>{value}</dd>
    </div>
  );
}
