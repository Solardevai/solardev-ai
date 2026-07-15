import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Features from "@/components/Features";
import VolumeOne from "@/components/VolumeOne";
import BookPreview from "@/components/BookPreview";
import Audience from "@/components/Audience";
import Roadmap from "@/components/Roadmap";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <VolumeOne />
      <BookPreview />
      <Audience />
      <Roadmap />
      <Pricing />

      {/* Temporary continuation */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
            Coming next
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight">
            Frequently asked questions and contact
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            The final homepage sections will answer important purchasing,
            licensing and customer-support questions.
          </p>
        </div>
      </section>
    </main>
  );
}