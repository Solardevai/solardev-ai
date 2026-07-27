import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SunPathTool from "@/components/SunPathTool";

export const metadata: Metadata = {
  title: "Sun Path & Shadow Tool",
  description:
    "Explore solar azimuth, elevation, sunrise, sunset and flat-ground shadow length on an interactive map.",
  alternates: { canonical: "/tools/sun-path" },
};

export default function SunPathPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.13),transparent_68%)]" />
          <div className="relative mx-auto max-w-[1440px]">
            <div className="mb-9 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Free engineering tool</span>
                <span className="text-xs text-slate-500">Public beta</span>
              </div>
              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                See the sun. <span className="text-amber-400">Read the shadow.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Explore solar position and indicative flat-ground shadows at any
                location, date and time—built for early-stage PV decisions.
              </p>
            </div>
            <SunPathTool />
            <div className="mt-6 grid gap-4 text-sm text-slate-400 sm:grid-cols-3">
              <p><strong className="block text-white">1. Locate</strong>Search an address, paste coordinates or click the map.</p>
              <p><strong className="block text-white">2. Explore</strong>Move the time slider to animate sun and shadow direction.</p>
              <p><strong className="block text-white">3. Export</strong>Share the scenario or download the full daily solar path.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
