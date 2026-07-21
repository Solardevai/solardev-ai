ChatGPT Plus













Pasted code(6).ts
TypeScript
how do it remain the current success page: 

Worked for 1m 15s
The homepage currently repeats the same information in several places:

Repeated information	Where it appears
218 pages, 10 chapters, prompt levels	Hero and Pricing
Target professionals	Hero trust strip and “Built for Professionals”
Screening, due diligence, risk and CAPEX	Chapter section, Preview and Practical Applications
Volume title and product description	Hero, Volume 1 section and Pricing
Corporate licensing	Dedicated section, FAQ and Contact
Contact invitation	Contact cards and final collaboration CTA
The chapter section alone occupies ten detailed cards, then the Preview and Practical Applications sections explain many of those same workflows again. 
 The separate handbook page already gives you a suitable destination for visitors who want the complete product detail. 

Recommended homepage structure
Navbar
Hero
Why SolarDev AI
Compact Volume 1 overview
Preview
Professionals + Applications
Pricing
FAQ
Roadmap
Compact Contact
Footer
Remove these standalone components from the homepage:

TrustBar
PracticalApplications
CorporateLicensing
Their useful information will be merged into other sections.

1. Replace components/VolumeOne.tsx
This removes the ten large chapter cards and replaces them with a compact chapter index. The detailed information remains accessible through the dedicated handbook page.

import Link from "next/link";
import {
  chapters,
  siteConfig,
} from "@/data/siteData";

export default function VolumeOne() {
  return (
    <section
      id="volume-1"
      aria-labelledby="volume-one-title"
      className="relative scroll-mt-24 overflow-hidden border-y border-white/10 bg-slate-950 py-20 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Volume 1
            </p>

            <h2
              id="volume-one-title"
              className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              {siteConfig.product.subtitle}
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              A structured methodology for using AI
              responsibly across early-stage
              utility-scale Solar PV and BESS project
              development.
            </p>

            <p className="mt-4 max-w-xl leading-7 text-slate-400">
              Progress from controlled AI practice and
              technical due diligence through site
              screening, development planning, project
              risk and initial CAPEX assessment.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/solar-bess-project-development-handbook"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-emerald-400/40 hover:bg-white/5"
              >
                View handbook details
              </Link>

              <a
                href={siteConfig.checkoutUrl}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-emerald-300"
              >
                Get Volume 1
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="grid md:grid-cols-2">
              {chapters.map((chapter) => (
                <article
                  key={chapter.number}
                  className="flex gap-4 border-b border-white/10 p-5 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 md:[&:nth-child(odd)]:border-r md:[&:nth-child(odd)]:border-white/10"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-xs font-bold text-emerald-300">
                    {chapter.number}
                  </span>

                  <div>
                    <h3 className="font-semibold leading-6 text-white">
                      {chapter.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {chapter.shortTitle}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
Result
The homepage still shows all ten chapters, but removes:

Ten repeated descriptions

Thirty repeated deliverables

Ten “Example outputs” labels

Excessive scrolling

2. Add merged audience and applications data
Add this new export to data/siteData.ts:

export const applications = [
  {
    number: "01",
    title: "Opportunity screening",
    description:
      "Compare sites, identify fatal flaws and define the next technical actions.",
    tags: [
      "Site screening",
      "Constraints",
      "Go / No-Go",
    ],
  },
  {
    number: "02",
    title: "Technical due diligence",
    description:
      "Review project evidence, identify information gaps and structure decision-ready findings.",
    tags: [
      "Evidence",
      "Information gaps",
      "Technical risk",
    ],
  },
  {
    number: "03",
    title: "Development planning",
    description:
      "Coordinate workstreams, dependencies, decision gates and Ready-to-Build activities.",
    tags: [
      "Roadmap",
      "Responsibilities",
      "Programme",
    ],
  },
  {
    number: "04",
    title: "Risk and CAPEX",
    description:
      "Translate findings into accountable risks and transparent initial investment ranges.",
    tags: [
      "Risk register",
      "CAPEX",
      "Sensitivity",
    ],
  },
];
Replace the existing professionalAudience array with this shorter version:

export const professionalAudience = [
  "Project development and design engineers",
  "Owner’s engineers and technical advisors",
  "EPC and project-management teams",
  "Renewable-energy developers and utilities",
  "Investors and independent engineers",
  "Engineering consultancies",
];
This reduces twelve overlapping role labels to six broader professional groups.

3. Create components/AudienceApplications.tsx
This replaces both the current Built for Professionals and Practical Applications sections.

import {
  applications,
  professionalAudience,
} from "@/data/siteData";

export default function AudienceApplications() {
  return (
    <section
      id="audience"
      aria-labelledby="audience-title"
      className="scroll-mt-24 bg-slate-950 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Professional use
          </p>

          <h2
            id="audience-title"
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Built for real project-development work
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Controlled AI workflows for professionals
            responsible for technical reviews,
            development decisions and investment
            recommendations.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {professionalAudience.map((audience) => (
            <span
              key={audience}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300"
            >
              {audience}
            </span>
          ))}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {applications.map((application) => (
            <article
              key={application.number}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-sm font-bold text-emerald-300">
                  {application.number}
                </span>

                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {application.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {application.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {application.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
4. Shorten the pricing feature list
Your pricing card currently repeats details already given in the Hero, Volume 1 and Preview sections. Replace pricingFeatures with:

export const pricingFeatures = [
  `${siteConfig.product.pages}-page Publisher Edition PDF`,
  `${siteConfig.product.chapters} chapters and ${siteConfig.product.prompts}+ professional prompts`,
  "Quick, Professional and Expert prompt levels",
  "Worked examples, review checklists and decision-support frameworks",
  "Secure Stripe checkout and immediate PDF access",
];
This condenses eight items into five without losing buying information.

5. Simplify the FAQ
Remove questions whose answers are already obvious elsewhere:

“Who is this handbook designed for?”

“What format will I receive?”

Keep the questions that resolve real purchase objections.

Replace faqItems with:

export const faqItems = [
  {
    question: "Is this a general AI book?",
    answer:
      "No. The handbook focuses specifically on applying AI within controlled utility-scale Solar PV and BESS project-development workflows.",
  },
  {
    question:
      "Which AI tools can be used with the prompts?",
    answer:
      "The methodology is model-independent and can be adapted to capable general-purpose AI systems. Outputs must always be reviewed against project information and authoritative sources.",
  },
  {
    question:
      "Does AI replace professional engineering judgement?",
    answer:
      "No. AI is treated as a professional assistant. Responsibility for validation, recommendations and issued deliverables remains with qualified professionals.",
  },
  {
    question: "Are updates included?",
    answer:
      "The purchase includes the purchased edition and minor corrections issued for that edition. Major future volumes or expanded editions may be sold separately.",
  },
  {
    question:
      "Can I share the PDF with my company?",
    answer: `The standard purchase is for individual professional use. Team and corporate licensing can be requested through ${siteConfig.infoEmail}.`,
  },
  {
    question:
      "How do I obtain customer support?",
    answer: `For payment, access or delivery questions, contact ${siteConfig.supportEmail}.`,
  },
];
6. Replace the contact section
The current contact area presents general enquiries, support, corporate licensing and another collaboration CTA. Corporate licensing and general enquiries can use the same contact address. 

Replace components/Contact.tsx with:

import { siteConfig } from "@/data/siteData";

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-24 border-t border-white/10 bg-slate-950 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Contact
          </p>

          <h2
            id="contact-title"
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Contact SolarDev AI
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
            Product enquiries, professional licensing
            and customer support.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <a
            href={`mailto:${siteConfig.infoEmail}`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400">
              Product and licensing
            </p>

            <h3 className="mt-3 text-xl font-bold text-white">
              General and corporate enquiries
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Handbook questions, professional
              collaboration, team licensing and
              corporate implementation.
            </p>

            <p className="mt-6 font-semibold text-emerald-300">
              {siteConfig.infoEmail}
            </p>
          </a>

          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-emerald-400/30 hover:bg-white/[0.05]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400">
              Customer support
            </p>

            <h3 className="mt-3 text-xl font-bold text-white">
              Payment and product access
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Checkout, payment confirmation, PDF
              delivery and access assistance.
            </p>

            <p className="mt-6 font-semibold text-emerald-300">
              {siteConfig.supportEmail}
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
7. Update app/page.tsx
Your exact imports may use slightly different file names, but the component order should become:

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

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
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
Remove these old imports and JSX elements:

import TrustBar from "@/components/TrustBar";
import Audience from "@/components/Audience";
import PracticalApplications from "@/components/PracticalApplications";
import CorporateLicensing from "@/components/CorporateLicensing";
And remove:

<TrustBar />
<Audience />
<PracticalApplications />
<CorporateLicensing />
Expected improvement
This restructuring should reduce the homepage by roughly:

One full audience section

One practical-applications section

One corporate-licensing section

Most of the chapter-card vertical length

Three pricing bullets

Two FAQ entries

One duplicate contact CTA

The core sales information remains, but each section gets a distinct job:

Section	Single purpose
Hero	Positioning and primary CTA
Features	Why the methodology is different
Volume 1	Product scope
Preview	Visual proof
Audience + Applications	Who uses it and for what
Pricing	Purchase decision
FAQ	Resolve objections
Roadmap	Future direction
Contact	Enquiries and support

Use this as the complete replacement for data/siteData.ts. It keeps one chapter source, adds the consolidated applications data, and removes repeated audience, pricing, and FAQ content.

export const siteConfig = {
  name: "SolarDev AI",
  tagline: "AI for Utility-Scale Solar & BESS Professionals",
  description:
    "Professional engineering methodologies, controlled AI workflows and consultant-grade prompts for utility-scale Solar PV and BESS project development.",

  infoEmail: "info@solardev.ai",
  supportEmail: "support@solardev.ai",

  checkoutUrl:
    "https://buy.stripe.com/dRm5kEaLNdcf8id49Ycs800",

  product: {
    name:
      "AI for Utility-Scale Solar & BESS Project Development",
    subtitle:
      "AI Foundations & Professional Prompt Library",
    edition: "Publisher Edition v4.0",
    author: "Tiago Pires",

    pages: 218,
    chapters: 10,
    prompts: 100,
    promptLevels: 3,

    launchPrice: 39,
    standardPrice: 49,
  },
};

export const navigationItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Handbook",
    href: "/#volume-1",
  },
  {
    label: "Preview",
    href: "/#preview",
  },
  {
    label: "Professionals",
    href: "/#audience",
  },
  {
    label: "Roadmap",
    href: "/#roadmap",
  },
  {
    label: "Pricing",
    href: "/#pricing",
  },
  {
    label: "FAQ",
    href: "/#faq",
  },
  {
    label: "Contact",
    href: "/#contact",
  },
];

export const trustAudiences = [
  "Developers",
  "EPC Contractors",
  "Owner’s Engineers",
  "Technical Advisors",
  "Utilities",
  "Investors",
];

export const features = [
  {
    number: "01",
    title: "Engineering first",
    description:
      "Professional project-development methodology comes before the AI tool.",
  },
  {
    number: "02",
    title: "AI with control",
    description:
      "Every workflow addresses evidence, assumptions, uncertainty, traceability and professional validation.",
  },
  {
    number: "03",
    title: "Practitioner-led",
    description:
      "Developed around real utility-scale Solar PV and BESS project-development activities.",
  },
];

export const chapters = [
  {
    number: "01",
    title: "AI Foundations & Professional Prompting",
    shortTitle: "AI Foundations",
    description:
      "Engineering philosophy, structured prompting, validation and professional accountability.",
  },
  {
    number: "02",
    title: "Research & Technical Due Diligence",
    shortTitle: "Due Diligence",
    description:
      "Research strategy, evidence traceability, information gaps and decision-ready findings.",
  },
  {
    number: "03",
    title: "Site Identification & Feasibility Screening",
    shortTitle: "Site Screening",
    description:
      "Constraint screening, site scoring, fatal flaws and development prioritisation.",
  },
  {
    number: "04",
    title: "Preliminary Development Roadmap",
    shortTitle: "Development Roadmap",
    description:
      "Workstreams, dependencies, decision gates and Ready-to-Build planning.",
  },
  {
    number: "05",
    title: "Landowner Assessment & Land Control",
    shortTitle: "Land Strategy",
    description:
      "Ownership evidence, parcel strategy, project rights and ethical land engagement.",
  },
  {
    number: "06",
    title: "Satellite & Aerial Image Interpretation",
    shortTitle: "Remote Imagery",
    description:
      "Access, terrain, drainage, receptors and targeted field verification.",
  },
  {
    number: "07",
    title: "Site Visit Planning & Field Due Diligence",
    shortTitle: "Field Due Diligence",
    description:
      "Field planning, HSE, evidence capture, issue ownership and reporting.",
  },
  {
    number: "08",
    title: "Environmental & Social Screening",
    shortTitle: "E&S Screening",
    description:
      "Environmental and social baseline, surveys, mitigation and permitting risk.",
  },
  {
    number: "09",
    title: "Initial Project Risk Register",
    shortTitle: "Risk Register",
    description:
      "Risk causes, consequences, ownership, treatment, triggers and residual exposure.",
  },
  {
    number: "10",
    title: "Initial CAPEX Benchmark",
    shortTitle: "CAPEX Benchmark",
    description:
      "Estimate basis, benchmarking, contingency, sensitivities and uncertainty.",
  },
];

export const professionalAudience = [
  "Project development and design engineers",
  "Owner’s engineers and technical advisors",
  "EPC and project-management teams",
  "Renewable-energy developers and utilities",
  "Investors and independent engineers",
  "Engineering consultancies",
];

export const applications = [
  {
    number: "01",
    title: "Opportunity screening",
    description:
      "Compare potential sites, identify fatal flaws and define the next technical actions.",
    tags: [
      "Site screening",
      "Constraints",
      "Go / No-Go",
    ],
  },
  {
    number: "02",
    title: "Technical due diligence",
    description:
      "Review project evidence, identify information gaps and structure decision-ready findings.",
    tags: [
      "Evidence",
      "Information gaps",
      "Technical risk",
    ],
  },
  {
    number: "03",
    title: "Development planning",
    description:
      "Coordinate workstreams, dependencies, decision gates and Ready-to-Build activities.",
    tags: [
      "Roadmap",
      "Responsibilities",
      "Programme",
    ],
  },
  {
    number: "04",
    title: "Risk and CAPEX",
    description:
      "Translate technical findings into accountable risks and transparent initial investment ranges.",
    tags: [
      "Risk register",
      "CAPEX",
      "Sensitivity",
    ],
  },
];

export const roadmapItems = [
  {
    volume: "Volume 1",
    title: "AI Foundations & Professional Prompt Library",
    status: "Available",
    active: true,
  },
  {
    volume: "Volume 2",
    title: "Advanced Project Development Applications",
    status: "In development",
    active: false,
  },
  {
    volume: "Professional Toolkit",
    title: "Templates, checklists and engineering workflows",
    status: "Planned",
    active: false,
  },
  {
    volume: "Prompt Platform",
    title: "Searchable professional prompt library",
    status: "Planned",
    active: false,
  },
];

export const pricingFeatures = [
  `${siteConfig.product.pages}-page Publisher Edition PDF`,
  `${siteConfig.product.chapters} chapters and ${siteConfig.product.prompts}+ professional prompts`,
  "Quick, Professional and Expert prompt levels",
  "Worked examples, review checklists and decision-support frameworks",
  "Secure Stripe checkout and immediate PDF access",
];

export const faqItems = [
  {
    question: "Is this a general AI book?",
    answer:
      "No. The handbook focuses specifically on applying AI within controlled utility-scale Solar PV and BESS project-development workflows.",
  },
  {
    question: "Which AI tools can be used with the prompts?",
    answer:
      "The methodology is model-independent and can be adapted to capable general-purpose AI systems. Outputs must always be reviewed against project information and authoritative sources.",
  },
  {
    question: "Does AI replace professional engineering judgement?",
    answer:
      "No. AI is treated as a professional assistant. Responsibility for validation, recommendations and issued deliverables remains with qualified professionals.",
  },
  {
    question: "Are updates included?",
    answer:
      "The purchase includes the purchased edition and minor corrections issued for that edition. Major future volumes or expanded editions may be sold separately.",
  },
  {
    question: "Can I share the PDF with my company?",
    answer: `The standard purchase is for individual professional use. Team and corporate licensing can be requested through ${siteConfig.infoEmail}.`,
  },
  {
    question: "How do I obtain customer support?",
    answer: `For payment, access or delivery questions, contact ${siteConfig.supportEmail}.`,
  },
];
Then run:

npm run build
The new applications export is ready to be used by the combined professionals and applications component.


what do i do with this export const siteConfig = {
  name: "SolarDev AI",
  tagline: "AI for Utility-Scale Solar & BESS Professionals",
  description:
    "Professional engineering methodologies, controlled AI workflows and consultant-grade prompts for utility-scale Solar PV and BESS project development.",

  infoEmail: "info@solardev.ai",
  supportEmail: "support@solardev.ai",

  checkoutUrl:
    "https://buy.stripe.com/dRm5kEaLNdcf8id49Ycs800",

  product: {
    name:
      "AI for Utility-Scale Solar & BESS Project Development",
    subtitle:
      "AI Foundations & Professional Prompt Library",
    edition: "Publisher Edition v4.0",
    author: "Tiago Pires",

    pages: 218,
    chapters: 10,
    prompts: 100,
    promptLevels: 3,

    launchPrice: 39,
    standardPrice: 49,
  },
};

export const navigationItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Handbook",
    href: "/#volume-1",
  },
  {
    label: "Preview",
    href: "/#preview",
  },
  {
    label: "Professionals",
    href: "/#audience",
  },
  {
    label: "Roadmap",
    href: "/#roadmap",
  },
  {
    label: "Pricing",
    href: "/#pricing",
  },
  {
    label: "FAQ",
    href: "/#faq",
  },
  {
    label: "Contact",
    href: "/#contact",
  },
];

export const trustAudiences = [
  "Developers",
  "EPC Contractors",
  "Owner’s Engineers",
  "Technical Advisors",
  "Utilities",
  "Investors",
];

export const features = [
  {
    number: "01",
    title: "Engineering first",
    description:
      "Professional project-development methodology comes before the AI tool.",
  },
  {
    number: "02",
    title: "AI with control",
    description:
      "Every workflow addresses evidence, assumptions, uncertainty, traceability and professional validation.",
  },
  {
    number: "03",
    title: "Practitioner-led",
    description:
      "Developed around real utility-scale Solar PV and BESS project-development activities.",
  },
];

export const chapters = [
  {
    number: "01",
    title: "AI Foundations & Professional Prompting",
    shortTitle: "AI Foundations",
    description:
      "Engineering philosophy, structured prompting, validation and professional accountability.",
  },
  {
    number: "02",
    title: "Research & Technical Due Diligence",
    shortTitle: "Due Diligence",
    description:
      "Research strategy, evidence traceability, information gaps and decision-ready findings.",
  },
  {
    number: "03",
    title: "Site Identification & Feasibility Screening",
    shortTitle: "Site Screening",
    description:
      "Constraint screening, site scoring, fatal flaws and development prioritisation.",
  },
  {
    number: "04",
    title: "Preliminary Development Roadmap",
    shortTitle: "Development Roadmap",
    description:
      "Workstreams, dependencies, decision gates and Ready-to-Build planning.",
  },
  {
    number: "05",
    title: "Landowner Assessment & Land Control",
    shortTitle: "Land Strategy",
    description:
      "Ownership evidence, parcel strategy, project rights and ethical land engagement.",
  },
  {
    number: "06",
    title: "Satellite & Aerial Image Interpretation",
    shortTitle: "Remote Imagery",
    description:
      "Access, terrain, drainage, receptors and targeted field verification.",
  },
  {
    number: "07",
    title: "Site Visit Planning & Field Due Diligence",
    shortTitle: "Field Due Diligence",
    description:
      "Field planning, HSE, evidence capture, issue ownership and reporting.",
  },
  {
    number: "08",
    title: "Environmental & Social Screening",
    shortTitle: "E&S Screening",
    description:
      "Environmental and social baseline, surveys, mitigation and permitting risk.",
  },
  {
    number: "09",
    title: "Initial Project Risk Register",
    shortTitle: "Risk Register",
    description:
      "Risk causes, consequences, ownership, treatment, triggers and residual exposure.",
  },
  {
    number: "10",
    title: "Initial CAPEX Benchmark",
    shortTitle: "CAPEX Benchmark",
    description:
      "Estimate basis, benchmarking, contingency, sensitivities and uncertainty.",
  },
];

export const professionalAudience = [
  "Project development and design engineers",
  "Owner’s engineers and technical advisors",
  "EPC and project-management teams",
  "Renewable-energy developers and utilities",
  "Investors and independent engineers",
  "Engineering consultancies",
];

export const applications = [
  {
    number: "01",
    title: "Opportunity screening",
    description:
      "Compare potential sites, identify fatal flaws and define the next technical actions.",
    tags: [
      "Site screening",
      "Constraints",
      "Go / No-Go",
    ],
  },
  {
    number: "02",
    title: "Technical due diligence",
    description:
      "Review project evidence, identify information gaps and structure decision-ready findings.",
    tags: [
      "Evidence",
      "Information gaps",
      "Technical risk",
    ],
  },
  {
    number: "03",
    title: "Development planning",
    description:
      "Coordinate workstreams, dependencies, decision gates and Ready-to-Build activities.",
    tags: [
      "Roadmap",
      "Responsibilities",
      "Programme",
    ],
  },
  {
    number: "04",
    title: "Risk and CAPEX",
    description:
      "Translate technical findings into accountable risks and transparent initial investment ranges.",
    tags: [
      "Risk register",
      "CAPEX",
      "Sensitivity",
    ],
  },
];

export const roadmapItems = [
  {
    volume: "Volume 1",
    title: "AI Foundations & Professional Prompt Library",
    status: "Available",
    active: true,
  },
  {
    volume: "Volume 2",
    title: "Advanced Project Development Applications",
    status: "In development",
    active: false,
  },
  {
    volume: "Professional Toolkit",
    title: "Templates, checklists and engineering workflows",
    status: "Planned",
    active: false,
  },
  {
    volume: "Prompt Platform",
    title: "Searchable professional prompt library",
    status: "Planned",
    active: false,
  },
];

export const pricingFeatures = [
  ${siteConfig.product.pages}-page Publisher Edition PDF,
  ${siteConfig.product.chapters} chapters and ${siteConfig.product.prompts}+ professional prompts,
  "Quick, Professional and Expert prompt levels",
  "Worked examples, review checklists and decision-support frameworks",
  "Secure Stripe checkout and immediate PDF access",
];

export const faqItems = [
  {
    question: "Is this a general AI book?",
    answer:
      "No. The handbook focuses specifically on applying AI within controlled utility-scale Solar PV and BESS project-development workflows.",
  },
  {
    question: "Which AI tools can be used with the prompts?",
    answer:
      "The methodology is model-independent and can be adapted to capable general-purpose AI systems. Outputs must always be reviewed against project information and authoritative sources.",
  },
  {
    question: "Does AI replace professional engineering judgement?",
    answer:
      "No. AI is treated as a professional assistant. Responsibility for validation, recommendations and issued deliverables remains with qualified professionals.",
  },
  {
    question: "Are updates included?",
    answer:
      "The purchase includes the purchased edition and minor corrections issued for that edition. Major future volumes or expanded editions may be sold separately.",
  },
  {
    question: "Can I share the PDF with my company?",
    answer: The standard purchase is for individual professional use. Team and corporate licensing can be requested through ${siteConfig.infoEmail}.,
  },
  {
    question: "How do I obtain customer support?",
    answer: For payment, access or delivery questions, contact ${siteConfig.supportEmail}.,
  },
];

Use that code as the complete contents of:

data/siteData.ts
1. Replace the existing file
In VS Code:

Open data/siteData.ts.

Select everything with Ctrl + A.

Paste the code you included.

Save with Ctrl + S.

Do not create another siteData file.

Your structure should be:

solardev-ai/
├── app/
├── components/
├── data/
│   └── siteData.ts
├── public/
└── package.json
2. What changed in this file
The file now contains the shared data used across the website:

siteConfig
navigationItems
trustAudiences
features
chapters
professionalAudience
applications
roadmapItems
pricingFeatures
faqItems
The new part is:

export const applications = [
  // ...
];
This data will be used by the combined Professionals and Applications section.

3. Create the new combined component
Create:

components/AudienceApplications.tsx
Paste:

import {
  applications,
  professionalAudience,
} from "@/data/siteData";

export default function AudienceApplications() {
  return (
    <section
      id="audience"
      aria-labelledby="audience-title"
      className="scroll-mt-24 bg-slate-950 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Professional use
          </p>

          <h2
            id="audience-title"
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Built for real project-development work
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Controlled AI workflows for professionals
            responsible for technical reviews,
            development decisions and investment
            recommendations.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {professionalAudience.map((audience) => (
            <span
              key={audience}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300"
            >
              {audience}
            </span>
          ))}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {applications.map((application) => (
            <article
              key={application.number}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-sm font-bold text-emerald-300">
                  {application.number}
                </span>

                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {application.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {application.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {application.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
4. Update the homepage
Open:

app/page.tsx
Add:

import AudienceApplications from "@/components/AudienceApplications";
Then place:

<AudienceApplications />
where your existing audience and practical applications sections currently appear.

Remove the old components, likely:

<Audience />
<PracticalApplications />
Also remove their imports.

5. Test
Run:

npm run build
Then:

npm run dev
Open:

http://localhost:3000/#audience
The navbar Professionals button should now scroll to the new combined section.


4. what's the updated code for this const productBenefits = [
  "218-page Publisher Edition PDF",
  "10 professional project-development chapters",
  "100+ professional AI prompts",
  "Quick, Professional and Expert prompt levels",
  "Worked utility-scale Solar PV and BESS examples",
  "Engineering validation and review checklists",
  "Risk, CAPEX and decision-support frameworks",
  "Minor editorial updates to Publisher Edition v4.0 included",
];

const CHECKOUT_URL = "https://buy.stripe.com/dRm5kEaLNdcf8id49Ycs800";

export default function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="relative scroll-mt-24 overflow-hidden border-y border-white/10 bg-slate-950 py-20 sm:py-24"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-400/5 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">
            Publisher Edition
          </p>

          <h2
            id="pricing-title"
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Get Volume 1
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Access the complete professional handbook for AI-assisted
            utility-scale Solar PV and BESS project development.
          </p>
        </div>

        {/* Compact pricing box */}
        <div className="mx-auto mt-12 w-full max-w-2xl">
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/25 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-amber-400/[0.055]"
            />

            <div className="relative">
              {/* Product information */}
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
                  Volume 1
                </p>

                <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  AI Foundations &amp; Professional Prompt Library
                </h3>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                  A professional engineering handbook combining controlled AI
                  workflows, worked examples, review checklists and
                  consultant-grade prompts.
                </p>
              </div>

              {/* Price */}
              <div className="mt-7 text-center">
                <div className="flex items-end justify-center gap-4">
                  <del className="pb-2 text-2xl font-semibold text-slate-500 decoration-slate-500">
                    €49
                  </del>

                  <span className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
                    €39
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-emerald-400">
                  Save €10
                </p>

                <p className="mt-1 text-sm font-medium text-slate-400">
                  Introductory price · One-time purchase
                </p>
              </div>

              {/* Benefits */}
              <div className="mt-7 border-t border-white/10 pt-7">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {productBenefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-300"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-bold text-emerald-400"
                      >
                        ✓
                      </span>

                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Purchase button */}
              <div className="mt-8">
                <a
                  href={CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Purchase SolarDev AI Volume 1 for 39 euros"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-base font-bold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  Get Immediate Access 
                </a>

                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  Secure checkout and immediate digital delivery through
                  Stripe.
                </p>
              </div>

              {/* Delivery information */}
              <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-xs font-medium text-slate-400">
                <span>PDF format</span>
                <span>Immediate access</span>
                <span>Secure payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}?

Replace the entire components/Pricing.tsx file with this version. It removes the duplicated local data and uses siteConfig and pricingFeatures from data/siteData.ts.

import {
  pricingFeatures,
  siteConfig,
} from "@/data/siteData";

export default function Pricing() {
  const {
    checkoutUrl,
    product,
  } = siteConfig;

  const savings =
    product.standardPrice - product.launchPrice;

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="relative scroll-mt-24 overflow-hidden border-y border-white/10 bg-slate-950 py-20 sm:py-24"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-400/5 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">
            {product.edition}
          </p>

          <h2
            id="pricing-title"
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Get Volume 1
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Immediate access to the complete
            professional handbook for utility-scale
            Solar PV and BESS project development.
          </p>
        </div>

        {/* Pricing card */}
        <div className="mx-auto mt-12 w-full max-w-2xl">
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/25 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-amber-400/[0.055]"
            />

            <div className="relative">
              {/* Product name */}
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
                  Volume 1
                </p>

                <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  {product.subtitle}
                </h3>
              </div>

              {/* Price */}
              <div className="mt-7 text-center">
                <div className="flex items-end justify-center gap-4">
                  <del className="pb-2 text-2xl font-semibold text-slate-500 decoration-slate-500">
                    €{product.standardPrice}
                  </del>

                  <span className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
                    €{product.launchPrice}
                  </span>
                </div>

                {savings > 0 && (
                  <p className="mt-2 text-sm font-semibold text-emerald-400">
                    Save €{savings}
                  </p>
                )}

                <p className="mt-1 text-sm font-medium text-slate-400">
                  Introductory price · One-time purchase
                </p>
              </div>

              {/* Product benefits */}
              <div className="mt-7 border-t border-white/10 pt-7">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {pricingFeatures.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-300"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-bold text-emerald-400"
                      >
                        ✓
                      </span>

                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Purchase button */}
              <div className="mt-8">
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Purchase ${product.name} for ${product.launchPrice} euros`}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-base font-bold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  Get Immediate Access
                </a>

                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  Secure Stripe checkout. The PDF is
                  available immediately after payment
                  confirmation.
                </p>
              </div>

              {/* Purchase details */}
              <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-white/10 pt-6 text-xs font-medium text-slate-400">
                <span>Individual licence</span>
                <span>One-time payment</span>
                <span>Secure digital delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
The following duplicated declarations are no longer needed inside Pricing.tsx:

const productBenefits = [...];

const CHECKOUT_URL = "...";
The component now reads all product details from:

data/siteData.ts
Run:

npm run build
This version also updates the price, benefits and checkout address automatically whenever you edit siteConfig.


