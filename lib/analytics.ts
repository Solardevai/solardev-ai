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
  if (
    typeof window === "undefined" ||
    typeof window.gtag !== "function"
  ) {
    return;
  }

  window.gtag("event", "begin_checkout", {
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