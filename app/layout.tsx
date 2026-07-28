import type { Metadata } from "next";
import type { ReactNode } from "react";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import "./globals.css";

const SITE_URL = "https://www.solardev.ai";
const SITE_TITLE =
  "Utility-Scale Solar & BESS Development Tools | SolarDev AI";

const SITE_DESCRIPTION =
  "Engineering-led tools, professional handbooks and controlled AI workflows for utility-scale Solar PV and BESS project development, screening and due diligence.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_TITLE,
    template: "%s | SolarDev AI",
  },

  description: SITE_DESCRIPTION,

  applicationName: "SolarDev AI",

  authors: [
    {
      name: "Tiago Pires",
      url: `${SITE_URL}/about-tiago-pires`,
    },
  ],

  creator: "Tiago Pires",
  publisher: "SolarDev AI",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
    shortcut: "/favicon.ico",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "SolarDev AI",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "SolarDev AI utility-scale solar and BESS development tools",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image.jpg"],
  },

  category: "technology",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
