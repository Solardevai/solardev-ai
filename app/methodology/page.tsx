import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "GIS Screening Methodology & Validation Status",
  description:
    "Review SolarDev AI GIS screening scope, source hierarchy, methodology ownership, version control, validation status and sample evidence.",
  alternates: { canonical: "/methodology" },
};

const sources = [
  {
    group: "European designations",
    source: "European Environment Agency",
    use: "Natura 2000 and nationally designated-area intersection screening",
    limitation:
      "National and regional authority datasets remain necessary before decisions.",
  },
  {
    group: "Flood reporting context",
    source: "European Environment Agency",
    use: "Floods Directive reporting-area intersection",
    limitation:
      "Reporting areas are not inundation, probability, depth or drainage maps.",
  },
  {
    group: "Infrastructure and surface water",
    source: "OpenStreetMap contributors via Overpass",
    use: "Proximity and mapped-feature context",
    limitation:
      "Coverage and tagging vary; absence is not evidence of absence or grid capacity.",
  },
  {
    group: "Terrain",
    source: "Mapzen Terrain Tiles on AWS",
    use: "Approximately 30 m elevation, slope and user-selected terrain mask",
    limitation:
      "Not a topographic survey, detailed grading model or continuous design raster.",
  },
  {
    group: "Solar resource",
    source: "European Commission Joint Research Centre PVGIS v5.3",
    use: "Indicative centroid specific yield and TMY data",
    limitation:
      "Not a project layout, loss model, P50/P90 or bankable energy-yield assessment.",
  },
] as const;

export default function MethodologyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="border-b border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,.13),transparent_55%)] px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Methodology disclosure
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
              GIS screening methodology and validation status
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              SolarDev AI publishes what the screening index uses, what it does
              not establish and how each saved run preserves its evidence.
            </p>

            <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              <Disclosure label="Methodology owner" value="SolarDev AI" />
              <Disclosure label="Current index version" value="v1.4" />
              <Disclosure label="Independent review" value="Not yet published" caution />
            </dl>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_0.72fr]">
            <div>
              <h2 className="text-3xl font-semibold">Accountability and status</h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
                <p>
                  SolarDev AI owns and maintains the current deterministic
                  screening methodology. Every immutable run records its
                  methodology version, source coverage, retrieval dates,
                  criterion evidence and unavailable sources.
                </p>
                <p>
                  No independent named engineering reviewer or certification is
                  currently published for methodology v1.4. The index must
                  therefore be treated as internally developed screening logic,
                  not an independently validated feasibility opinion.
                </p>
                <p>
                  A future independent review will be identified by reviewer,
                  competence, scope, date and reviewed methodology version. The
                  site will not imply that review before it is complete.
                </p>
              </div>
            </div>

            <aside className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.06] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
                Appropriate use
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Compare mapped exposure, identify missing evidence and define
                follow-up work. Do not use the index to establish title,
                consentability, grid capacity, flood safety, constructability,
                valuation, financing suitability or investment approval.
              </p>
            </aside>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.025] px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-semibold">Source hierarchy and limits</h2>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
              <table className="min-w-[820px] w-full text-left text-sm">
                <thead className="bg-white/[0.05] text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Evidence group</th>
                    <th className="px-4 py-3">Current source</th>
                    <th className="px-4 py-3">Screening use</th>
                    <th className="px-4 py-3">Professional limitation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {sources.map((item) => (
                    <tr key={item.group}>
                      <th className="px-4 py-4 font-semibold text-white">{item.group}</th>
                      <td className="px-4 py-4 text-slate-300">{item.source}</td>
                      <td className="px-4 py-4 text-slate-300">{item.use}</td>
                      <td className="px-4 py-4 text-slate-400">{item.limitation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.045] p-7 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              Sample evidence
            </p>
            <h2 className="mt-4 text-3xl font-semibold">Inspect the output structure</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              The downloadable sample is fictional and demonstrates the
              constraint-register fields only. It is not a real site finding,
              professional opinion or independently reviewed project report.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/samples/screening-report"
                className="rounded-xl bg-sky-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-sky-200"
              >
                View fictional sample report
              </Link>
              <a
                href="/samples/solardev-sample-constraint-register.csv"
                download
                className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300"
              >
                Download sample CSV
              </a>
              <Link
                href="/tools/solar-site-screening"
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.05]"
              >
                Open SolarDev GIS Site Check
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Disclosure({
  label,
  value,
  caution = false,
}: {
  label: string;
  value: string;
  caution?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
      <dt className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</dt>
      <dd className={`mt-2 font-semibold ${caution ? "text-amber-200" : "text-white"}`}>
        {value}
      </dd>
    </div>
  );
}
