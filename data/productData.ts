export const volumeOneProductData = {
  volume: 1,
  checkoutUrl:
    "https://buy.stripe.com/14A28s079egjcyt7macs801",
  stripeProductId: "prod_UuLZ6NyLniEzvt",
  itemId: "solardev-volume-1",
  itemName:
    "AI for Utility-Scale Solar & BESS Project Development - Volume 1",
  itemCategory: "Digital Handbook",
  title: "AI Foundations & Professional Workflows",
  pages: 215,
  chapters: 10,
  edition: "Edition v1.1",
  price: 29,
  currency: "EUR",
  blobPathname:
    "products/solardev-ai-volume-1-v1.1.pdf",
  downloadFilename:
    "SolarDev-AI-Volume-1-v1.1.pdf",
} as const;

export const volumeTwoProductData = {
  volume: 2,
  checkoutUrl:
    "https://buy.stripe.com/5kQ7sMbPR8VZcyt7macs802",
  stripeProductId: "prod_UwjPCZO55zSGuI",
  itemId: "solardev-volume-2",
  itemName:
    "AI for Utility-Scale Solar & BESS Project Development - Volume 2",
  itemCategory: "Digital Handbook",
  title: "From Development to Operations",
  pages: 64,
  chapters: 10,
  edition: "Edition v1.1",
  price: 29,
  currency: "EUR",
  blobPathname:
    "products/solardev-ai-volume-2-v1.1.pdf",
  downloadFilename:
    "SolarDev-AI-Volume-2-v1.1.pdf",
} as const;

export const handbookProducts = [
  volumeOneProductData,
  volumeTwoProductData,
] as const;

// Backwards-compatible alias for existing Volume 1 components.
export const productData = volumeOneProductData;
