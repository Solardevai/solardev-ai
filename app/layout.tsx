import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://solardev.ai"),

  title: {
    default: "SolarDev AI",
    template: "%s | SolarDev AI",
  },

  description:
    "Professional AI methodologies, engineering workflows and consultant-grade prompts for utility-scale Solar PV and BESS project development.",

  keywords: [
    "SolarDev AI",
    "Utility Scale Solar",
    "Solar PV",
    "Battery Energy Storage System",
    "BESS",
    "Renewable Energy",
    "Artificial Intelligence",
    "AI",
    "Project Development",
    "Engineering",
    "Solar Engineering",
    "Renewable Energy Engineering",
    "ChatGPT",
    "AI Prompt Library",
    "Solar Development",
    "Utility Scale BESS",
  ],

  authors: [
    {
      name: "Tiago Pires",
    },
  ],

  creator: "SolarDev AI",

  publisher: "SolarDev AI",

  applicationName: "SolarDev AI",

  category: "Engineering",

  openGraph: {
    title: "SolarDev AI",
    description:
      "AI for Utility-Scale Solar & BESS Project Development.",
    url: "https://solardev.ai",
    siteName: "SolarDev AI",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "SolarDev AI",
    description:
      "Professional AI for Utility-Scale Solar & BESS Project Development.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}