import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-MM2D3CS1FS";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.solardev.ai"),

  title: {
    default: "SolarDev AI | Utility-Scale Solar & BESS Development Tools",
    template: "%s | SolarDev AI",
  },

  description:
    "Professional handbooks, AI prompt libraries and practical tools for utility-scale solar PV and BESS project development professionals.",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
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

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.solardev.ai",
    siteName: "SolarDev AI",
    title: "SolarDev AI | Utility-Scale Solar & BESS Development Tools",
    description:
      "Professional handbooks, AI prompt libraries and practical tools for utility-scale solar PV and BESS project development professionals.",
  },

  twitter: {
    card: "summary_large_image",
    title: "SolarDev AI | Solar & BESS Development Tools",
    description:
      "Professional handbooks and AI prompt libraries for utility-scale solar and BESS project development.",
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

      {/* Google Analytics */}
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

          gtag("js", new Date());
          gtag("config", "${GA_MEASUREMENT_ID}", {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </html>
  );
}