import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import { isAuthenticationAvailable } from "@/lib/auth-config";
import "./globals.css";

const SITE_URL = "https://www.solardev.ai";
const SITE_TITLE =
  "Professional Solar & BESS Development Platform | SolarDev AI";

const SITE_DESCRIPTION =
  "GIS site intelligence, engineering-led workflows, traceable project outputs and the SolarDev Engineering Copilot for utility-scale Solar PV and BESS development.";

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
      name: "SolarDev AI",
      url: SITE_URL,
    },
  ],

  creator: "SolarDev AI",
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
  const content = (
    <>
      {children}
      <AnalyticsConsent />
    </>
  );

  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        {isAuthenticationAvailable() ? (
          <ClerkProvider
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
            signInFallbackRedirectUrl="/dashboard"
            signUpFallbackRedirectUrl="/dashboard"
            appearance={{
              variables: {
                colorPrimary: "#fbbf24",
                colorBackground: "#0b2a21",
                colorForeground: "#f4f5f0",
                colorMutedForeground: "#9cafaa",
                borderRadius: "0.875rem",
              },
              elements: {
                card: "border border-white/10 shadow-2xl shadow-black/30",
                footerActionLink:
                  "text-amber-400 hover:text-amber-300",
                formButtonPrimary:
                  "bg-amber-400 text-slate-950 hover:bg-amber-300",
                socialButtonsBlockButton:
                  "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]",
                userButtonPopoverActionButton:
                  "!text-white hover:bg-white/[0.08]",
                userButtonPopoverActionButtonIcon:
                  "!text-white",
              },
            }}
          >
            {content}
          </ClerkProvider>
        ) : (
          content
        )}
      </body>
    </html>
  );
}
