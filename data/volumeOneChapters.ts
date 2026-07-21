export type VolumeOneChapter = {
  number: string;
  title: string;
  description: string;
  outputs: string[];
};

export const volumeOneChapters: VolumeOneChapter[] = [
  {
    number: "01",
    title: "AI Foundations & Professional Prompting",
    description:
      "Establishes the principles, controls and professional responsibilities required for reliable AI-assisted engineering work.",
    outputs: [
      "Controlled AI workflow",
      "Evidence and assumption checks",
      "Professional validation framework",
    ],
  },
  {
    number: "02",
    title: "Research & Technical Due Diligence",
    description:
      "Structures multidisciplinary technical reviews for early-stage Solar PV and BESS opportunities.",
    outputs: [
      "Due-diligence workflow",
      "Evidence register",
      "Technical findings structure",
    ],
  },
  {
    number: "03",
    title: "Site Identification & Feasibility Screening",
    description:
      "Supports the initial identification of technical, environmental, grid, land and development constraints.",
    outputs: [
      "Site-screening matrix",
      "Constraint register",
      "Preliminary go/no-go basis",
    ],
  },
  {
    number: "04",
    title: "Preliminary Development Roadmap",
    description:
      "Converts an early-stage opportunity into a structured sequence of studies, approvals, decisions and development gates.",
    outputs: [
      "Development workplan",
      "Decision-gate structure",
      "Responsibility and dependency mapping",
    ],
  },
  {
    number: "05",
    title: "Landowner Assessment & Land Control",
    description:
      "Provides a systematic approach to land requirements, ownership review, access strategy and landowner engagement.",
    outputs: [
      "Land requirements brief",
      "Landowner engagement plan",
      "Land-risk register",
    ],
  },
  {
    number: "06",
    title: "Satellite & Aerial Image Interpretation",
    description:
      "Uses available mapping and imagery to support preliminary site interpretation before field investigations.",
    outputs: [
      "Desktop site assessment",
      "Terrain and access observations",
      "Field-verification priorities",
    ],
  },
  {
    number: "07",
    title: "Site Visit Planning & Field Due Diligence",
    description:
      "Structures site visits around defined engineering questions, evidence requirements and development risks.",
    outputs: [
      "Site-visit plan",
      "Inspection checklist",
      "Observation and action register",
    ],
  },
  {
    number: "08",
    title: "Environmental & Social Screening",
    description:
      "Supports proportionate early-stage identification of environmental, permitting, community and social constraints.",
    outputs: [
      "Environmental screening matrix",
      "Stakeholder considerations",
      "Further-study recommendations",
    ],
  },
  {
    number: "09",
    title: "Initial Project Risk Register",
    description:
      "Creates a structured process for identifying, evaluating, allocating and monitoring project-development risks.",
    outputs: [
      "Development risk register",
      "Risk ownership structure",
      "Mitigation and monitoring actions",
    ],
  },
  {
    number: "10",
    title: "Initial CAPEX Benchmark",
    description:
      "Develops a transparent early-stage cost basis for Solar PV and BESS projects before detailed engineering and procurement.",
    outputs: [
      "Initial CAPEX structure",
      "Assumption register",
      "Cost sensitivity framework",
    ],
  },
];