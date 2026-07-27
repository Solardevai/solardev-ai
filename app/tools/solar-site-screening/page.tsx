import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SolarSiteScreeningMap from "@/components/SolarSiteScreeningMap";

export const metadata: Metadata = {
  title: "Free Solar Site Screening Map",
  description:
    "Draw a potential solar site, calculate its area and retrieve a preliminary PVGIS solar resource estimate.",
  alternates: { canonical: "/tools/solar-site-screening" },
};

export default function SolarSiteScreeningPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 lg:px-8">
          <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.14),transparent_65%)]" />
          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Free early-stage tool
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Solar Site <span className="text-emerald-400">Quick Check</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Locate a potential site, draw its boundary and obtain an instant area calculation and preliminary PVGIS solar resource estimate.
              </p>
            </div>
            <SolarSiteScreeningMap />
            <div className="mt-6 grid gap-4 text-sm text-slate-400 sm:grid-cols-3">
              <p><strong className="block text-white">1. Find</strong>Search by address, place name or coordinates.</p>
              <p><strong className="block text-white">2. Draw</strong>Click around the site to calculate gross area.</p>
              <p><strong className="block text-white">3. Check</strong>Retrieve a preliminary PVGIS yield estimate.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
