import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Features from "@/components/Features";
import VolumeOne from "@/components/VolumeOne";
import BookPreview from "@/components/BookPreview";
import Audience from "@/components/Audience";
import Roadmap from "@/components/Roadmap";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

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
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}