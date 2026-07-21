import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import VolumeOne from "@/components/VolumeOne";
import BookPreview from "@/components/BookPreview";
import AudienceApplications from "@/components/AudienceApplications";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Roadmap from "@/components/Roadmap";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { siteConfig } from "@/data/siteData";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.solardev.ai/#organization",

  name: siteConfig.name,
  alternateName: "SolarDevAI",

  url: "https://www.solardev.ai/",

  logo: {
    "@type": "ImageObject",
    url: "https://www.solardev.ai/logo-mark.svg",
    contentUrl:
      "https://www.solardev.ai/logo-mark.svg",
    caption: `${siteConfig.name} logo`,
  },

  email: siteConfig.infoEmail,

  description: siteConfig.description,

  founder: {
    "@type": "Person",
    name: siteConfig.product.author,
  },

  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "general enquiries",
      email: siteConfig.infoEmail,
      url: "https://www.solardev.ai/#contact",
    },
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: siteConfig.supportEmail,
      url: "https://www.solardev.ai/#contact",
    },
  ],

  knowsAbout: [
    "Utility-scale Solar PV project development",
    "Battery energy storage systems",
    "BESS project development",
    "Solar project feasibility",
    "Technical due diligence",
    "Project development engineering",
    "Artificial intelligence for engineering workflows",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            organizationJsonLd,
          ).replace(/</g, "\\u003c"),
        }}
      />

      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white">
        <Hero />
        <Features />
        <VolumeOne />
        <BookPreview />
        <AudienceApplications />
        <Pricing />
        <FAQ />
        <Roadmap />
        <Contact />
      </main>

      <Footer />
    </>
  );
}