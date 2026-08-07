export type BillingPlan = "free" | "pro";
export type UsageKind = "site-score" | "screening-report";

export type UsageAllowance = {
  used: number;
  limit: number;
  remaining: number;
};

export type UsageSummary = {
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
