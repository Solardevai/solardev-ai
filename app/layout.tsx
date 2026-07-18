import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";

const SITE_URL = "https://www.solardev.ai";
const GA_MEASUREMENT_ID = "G-MM2D3CS1FS";

const SITE_TITLE =
  "SolarDev AI | Utility-Scale Solar & BESS Development Tools";

const SITE_DESCRIPTION =
  "Professional handbooks, engineering workflows and AI prompt libraries for utility-scale solar PV and battery energy storage project development.";

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
      url: SITE_URL,
    },
  ],

  creator: "Tiago Pires",
  publisher: "SolarDev AI",

  alternates: {
    canonical: "/",
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
  },

  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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

        {/* Google Analytics — loads on every page */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              window.dataLayer.push(arguments);
            }

            window.gtag = gtag;

            gtag('js', new Date());

            gtag('config', '${GA_MEASUREMENT_ID}', {
              anonymize_ip: true
            });
          `}
        </Script>
      </body>
    </html>
  );
}