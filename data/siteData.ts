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