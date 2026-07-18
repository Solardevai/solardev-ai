type GtagFunction = (
  command: "event",
  eventName: string,
  parameters?: Record<string, unknown>
) => void;

type BrowserWindow = Window & {
  gtag?: GtagFunction;
};

type CheckoutTrackingOptions = {
  buttonLocation: string;
  itemId: string;
  itemName: string;
  itemCategory: string;
  price: number;
  currency: string;
};

export function trackBeginCheckout({
  buttonLocation,
  itemId,
  itemName,
  itemCategory,
  price,
  currency,
}: CheckoutTrackingOptions): void {
  if (typeof window === "undefined") {
    return;
  }

  const browserWindow = window as BrowserWindow;

  if (typeof browserWindow.gtag !== "function") {
    console.warn("Google Analytics is not available yet.");
    return;
  }

  browserWindow.gtag("event", "begin_checkout", {
    currency,
    value: price,
    button_location: buttonLocation,
    items: [
      {
        item_id: itemId,
        item_name: itemName,
        item_category: itemCategory,
        price,
        quantity: 1,
      },
    ],
  });
}