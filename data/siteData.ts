import { productData } from "@/data/productData";

export const siteConfig = {
  name: "SolarDev AI",
  tagline: "AI for Utility-Scale Solar & BESS Professionals",
  description:
    "A professional platform combining GIS site intelligence, engineering-led workflows, traceable project outputs and the SolarDev Solar and BESS Agent for utility-scale Solar PV and BESS development.",

  infoEmail: "info@solardev.ai",
  supportEmail: "support@solardev.ai",

  checkoutUrl: productData.checkoutUrl,

  product: {
    name:
      "AI for Utility-Scale Solar & BESS Project Development",
    subtitle:
      "AI Foundations & Professional Workflows",
    edition: productData.edition,
    author: "SolarDev AI",

    pages: productData.pages,
    chapters: productData.chapters,
    prompts: 100,
    promptLevels: 3,

    launchPrice: productData.price,
  },
};

export const navigationItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Insights",
    href: "/insights",
  },
  {
    label: "Methodology",
    href: "/methodology",
  },
  {
    label: "FAQ",
    href: "/#faq",
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
      "Compare potential sites, spot issues that could stop a project and identify what to investigate next.",
    tags: [
      "Compare sites",
      "Identify constraints",
      "Decide whether to proceed",
    ],
  },
  {
    number: "02",
    title: "Technical due diligence",
    description:
      "Check project documents and source data, find missing information and organise the findings for review.",
    tags: [
      "Check evidence",
      "Find missing data",
      "Understand technical risk",
    ],
  },
  {
    number: "03",
    title: "Development planning",
    description:
      "Organise surveys, approvals and technical tasks in the order needed to move a project forward.",
    tags: [
      "Plan next steps",
      "Assign responsibilities",
      "Track the programme",
    ],
  },
  {
    number: "04",
    title: "Risk and early cost estimates",
    description:
      "Turn technical findings into a clear risk register and an initial range for capital costs (CAPEX).",
    tags: [
      "Record risks",
      "Estimate capital costs",
      "Test key assumptions",
    ],
  },
];

export const roadmapItems = [
  {
    volume: "2026 · Q1",
    title: "Professional Handbook Series",
    status: "Delivered",
    active: true,
  },
  {
    volume: "2026 · Q2",
    title: "AI Tools",
    status: "In development",
    active: true,
  },
  {
    volume: "2026 · Q4",
    title: "GIS Site Check Expansion",
    status: "Planned",
    active: false,
  },
];

export const faqItems = [
  {
    question: "What does SolarDev GIS Site Check currently assess?",
    answer:
      "The public SolarDev GIS Site Check lets you upload or draw a candidate boundary, calculate gross area, perimeter and centroid, request an indicative PVGIS specific yield, inspect OpenStreetMap infrastructure context and export boundary or TMY files. It does not run constraint analysis on the public page. After saving a project, the authenticated GIS workspace can run separate source-based terrain, protected-area, flood-reporting, surface-water and infrastructure screens, create a preliminary screening index and export evidence reports.",
  },
  {
    question: "What is available on the SolarDev AI platform today?",
    answer:
      "SolarDev GIS Site Check and the Solar Geometry Tool are available now, alongside saved GIS projects, deterministic constraint screening, a preliminary screening index, PDF reports and CSV registers. The SolarDev Solar and BESS Agent is live with project context, deterministic solar and BESS calculations, and clearly labelled sources, assumptions and results.",
  },
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
