"use client";

import Script from "next/script";
import {
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

const GA_MEASUREMENT_ID = "G-MM2D3CS1FS";
const CONSENT_STORAGE_KEY = "solardev-analytics-consent";
const OPEN_PREFERENCES_EVENT = "solardev:open-cookie-preferences";
const CONSENT_CHANGED_EVENT = "solardev:cookie-consent-changed";

type ConsentChoice = "accepted" | "rejected" | null;
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function getConsentSnapshot(): ConsentChoice {
  const storedConsent = window.localStorage.getItem(
    CONSENT_STORAGE_KEY,
  );

  return storedConsent === "accepted" ||
    storedConsent === "rejected"
    ? storedConsent
    : null;
}

function subscribeToConsent(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CONSENT_CHANGED_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
  };
}

function disableAnalytics() {
  const analyticsWindow = window as AnalyticsWindow;

  analyticsWindow.gtag?.("consent", "update", {
    analytics_storage: "denied",
  });
  analyticsWindow.gtag = undefined;
  analyticsWindow.dataLayer = [];

  document.cookie.split(";").forEach((cookie) => {
    const cookieName = cookie.split("=")[0]?.trim();

    if (!cookieName?.startsWith("_ga")) {
      return;
    }

    for (const domain of [
      "",
      "domain=solardev.ai;",
      "domain=.solardev.ai;",
    ]) {
      document.cookie =
        `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; ${domain} SameSite=Lax`;
    }
  });
}

export default function AnalyticsConsent() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    () => null,
  );
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    function openPreferences() {
      setIsPreferencesOpen(true);
    }

    window.addEventListener(
      OPEN_PREFERENCES_EVENT,
      openPreferences,
    );

    return () => {
      window.removeEventListener(
        OPEN_PREFERENCES_EVENT,
        openPreferences,
      );
    };
  }, []);

  function saveConsent(choice: Exclude<ConsentChoice, null>) {
    if (choice === "rejected") {
      disableAnalytics();
    }

    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
    setIsPreferencesOpen(false);
  }

  const shouldShowPanel =
    consent === null || isPreferencesOpen;

  return (
    <>
      {consent === "accepted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag("js", new Date());
              gtag("config", "${GA_MEASUREMENT_ID}", {
                anonymize_ip: true
              });
            `}
          </Script>
        </>
      )}

      {shouldShowPanel && (
        <section
          role="dialog"
          aria-modal={isPreferencesOpen ? "true" : undefined}
          aria-labelledby="cookie-consent-title"
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-2xl border border-white/15 bg-slate-900 p-5 shadow-2xl shadow-black/50 sm:p-6"
        >
          <h2
            id="cookie-consent-title"
            className="text-lg font-bold text-white"
          >
            Analytics preferences
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            SolarDev AI uses optional Google Analytics cookies to
            understand site usage and improve the experience. The site
            works without them.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => saveConsent("rejected")}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              Reject analytics
            </button>
            <button
              type="button"
              onClick={() => saveConsent("accepted")}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Accept analytics
            </button>
          </div>
        </section>
      )}
    </>
  );
}
