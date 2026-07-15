import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Features from "@/components/Features";
import VolumeOne from "@/components/VolumeOne";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <VolumeOne />

      {/* Temporary continuation */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
            Coming next
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight">
            Preview the handbook before purchasing
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            The next section will display selected pages, professional tables,
            workflows and prompt examples from Volume 1.
          </p>
        </div>
      </section>
    </main>
  );
}