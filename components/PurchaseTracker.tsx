"use client";

import { useEffect } from "react";

const GA_MEASUREMENT_ID = "G-MM2D3CS1FS";

type PurchaseItem = {
  item_id: string;
  item_name: string;
  item_category: string;
  price: number;
  quantity: number;
};

type PurchaseTrackerProps = {
  transactionId: string;
  value: number;
  currency: string;
  tax?: number;
  shipping?: number;
  items: PurchaseItem[];
  debugMode?: boolean;
};

type GtagFunction = (
  command: "event",
  eventName: string,
  parameters?: Record<string, unknown>
) => void;

type BrowserWindow = Window & {
  gtag?: GtagFunction;
};

export default function PurchaseTracker({
  transactionId,
  value,
  currency,
  tax = 0,
  shipping = 0,
  items,
  debugMode = false,
}: PurchaseTrackerProps) {
  useEffect(() => {
    const storageKey = `ga4-purchase-${transactionId}`;

    // Prevent the same browser from sending the purchase again on refresh.
    if (window.localStorage.getItem(storageKey) === "sent") {
      return;
    }

    let attempts = 0;

    function sendPurchase(): boolean {
      const browserWindow = window as BrowserWindow;

      if (typeof browserWindow.gtag !== "function") {
        return false;
      }

      const eventData: Record<string, unknown> = {
        send_to: GA_MEASUREMENT_ID,
        transaction_id: transactionId,
        value,
        currency,
        items,
      };

      if (tax > 0) {
        eventData.tax = tax;
      }

      if (shipping > 0) {
        eventData.shipping = shipping;
      }

      if (debugMode) {
        eventData.debug_mode = true;
      }

      browserWindow.gtag("event", "purchase", eventData);

      window.localStorage.setItem(storageKey, "sent");

      console.info("GA4 purchase event sent:", {
        transactionId,
        value,
        currency,
        tax,
        shipping,
        items,
      });

      return true;
    }

    // Try immediately.
    if (sendPurchase()) {
      return;
    }

    // GA may still be loading, so retry for up to five seconds.
    const intervalId = window.setInterval(() => {
      attempts += 1;

      if (sendPurchase() || attempts >= 10) {
        window.clearInterval(intervalId);
      }
    }, 500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    transactionId,
    value,
    currency,
    tax,
    shipping,
    items,
    debugMode,
  ]);

  return null;
}