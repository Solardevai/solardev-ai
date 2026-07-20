/**
 * IMPORTANT — REPLACE ALL BRACKETED PLACEHOLDERS BEFORE DEPLOYMENT.
 *
 * These values are intentionally centralised so the legal pages can be
 * completed without editing the policy copy in multiple locations.
 */
export const legalConfig = {
  tradingName: "SolarDev AI",
  websiteUrl: "https://www.solardev.ai",

  operatorName: "TIAGO PIRES",
  legalForm: "INDIVIDUAL PROFESSIONAL",
  taxId: "231631693",
  businessAddress: "Lisbon",
  countryOfEstablishment: "Portugal",
  commercialRegistryDetails:
    "NOT APPLICABLE",

  generalEmail: "info@solardev.ai",
  supportEmail: "support@solardev.ai",
  privacyEmail: "privacy@solardev.ai",

  hostingProvider: "VERCEL INC.",
  analyticsProvider: "Google Analytics",
  merchantOfRecord: "Stripe",

  privacyRetentionPeriod:
    "support records for 3 years; invoicing records for the statutory period; Analytics data is retained according to the retention period configured within the applicable analytics platform.",

  refundRequestWindowDays: 14,
  lastUpdated: "16 July 2026",
} as const;

export type LegalConfig = typeof legalConfig;
