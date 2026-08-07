export type BillingPlan = "free" | "pro";
export type UsageKind = "site-score" | "screening-report";

export type UsageAllowance = {
  used: number;
  limit: number | null;
  remaining: number | null;
};

export type UsageSummary = {
  enforcementEnabled: boolean;
  plan: BillingPlan;
  subscriptionStatus: string;
  subscriptionPeriodEnd: string | null;
  canManageBilling: boolean;
  checkoutConfigured: boolean;
  periodKey: string;
  periodStart: string;
  periodEnd: string;
  allowances: Record<UsageKind, UsageAllowance>;
};
