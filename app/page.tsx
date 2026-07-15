import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Features from "@/components/Features";
import VolumeOne from "@/components/VolumeOne";
import BookPreview from "@/components/BookPreview";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <VolumeOne />
      <BookPreview />

      {/* Temporary continuation */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
            Coming next
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight">
            Built for professionals responsible for real projects
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            The next section will present the professional audience, use cases
            and roles supported by the SolarDev AI methodology.
          </p>
        </div>
      </section>
    </main>
  );
}