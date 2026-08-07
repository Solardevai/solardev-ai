import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  BillingPlan,
  UsageAllowance,
  UsageKind,
  UsageSummary,
} from "@/types/billing";

const ACTIVE_SUBSCRIPTION_STATUSES = new Set(["active", "trialing"]);

export function isBillingEnforcementEnabled() {
  return process.env.BILLING_ENFORCEMENT_ENABLED === "true";
}

function positiveLimit(name: string, fallback: number) {
  const configured = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isInteger(configured) && configured > 0
    ? configured
    : fallback;
}

const PLAN_LIMITS: Record<BillingPlan, Record<UsageKind, number>> = {
  free: {
    "site-score": positiveLimit("FREE_SITE_SCORE_MONTHLY_LIMIT", 3),
    "screening-report": positiveLimit("FREE_REPORT_MONTHLY_LIMIT", 2),
  },
  pro: {
    "site-score": positiveLimit("PRO_SITE_SCORE_MONTHLY_LIMIT", 50),
    "screening-report": positiveLimit("PRO_REPORT_MONTHLY_LIMIT", 50),
  },
};

function usagePeriod(now = new Date()) {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 1));
  return {
    key: `${year}-${String(month + 1).padStart(2, "0")}`,
    start,
    end,
  };
}

function effectivePlan(user: {
  plan: string;
  subscriptionStatus: string;
} | null): BillingPlan {
  return user?.plan === "pro" &&
    ACTIVE_SUBSCRIPTION_STATUSES.has(user.subscriptionStatus)
    ? "pro"
    : "free";
}

function allowance(used: number, limit: number | null): UsageAllowance {
  return {
    used,
    limit,
    remaining: limit === null ? null : Math.max(0, limit - used),
  };
}

export class UsageLimitError extends Error {
  readonly code = "USAGE_LIMIT_REACHED";
  readonly kind: UsageKind;
  readonly limit: number;

  constructor(kind: UsageKind, limit: number) {
    super(
      kind === "site-score"
        ? `Monthly site-score allowance reached (${limit}). Upgrade or wait for the next UTC month.`
        : `Monthly report allowance reached (${limit}). Upgrade or wait for the next UTC month.`,
    );
    this.name = "UsageLimitError";
    this.kind = kind;
    this.limit = limit;
  }
}

export async function getUsageSummary(userId: string): Promise<UsageSummary> {
  const enforcementEnabled = isBillingEnforcementEnabled();
  const period = usagePeriod();
  const [user, groupedUsage] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        subscriptionStatus: true,
        subscriptionPeriodEnd: true,
        stripeCustomerId: true,
      },
    }),
    prisma.usageEvent.groupBy({
      by: ["kind"],
      where: { userId, periodKey: period.key },
      _sum: { units: true },
    }),
  ]);
  const plan = effectivePlan(user);
  const usedByKind = new Map(
    groupedUsage.map((item) => [item.kind, item._sum.units ?? 0]),
  );

  return {
    enforcementEnabled,
    plan,
    subscriptionStatus: user?.subscriptionStatus ?? "inactive",
    subscriptionPeriodEnd:
      user?.subscriptionPeriodEnd?.toISOString() ?? null,
    canManageBilling: Boolean(user?.stripeCustomerId),
    checkoutConfigured: Boolean(process.env.STRIPE_WORKSPACE_PRO_PRICE_ID),
    periodKey: period.key,
    periodStart: period.start.toISOString(),
    periodEnd: period.end.toISOString(),
    allowances: {
      "site-score": allowance(
        usedByKind.get("site-score") ?? 0,
        enforcementEnabled ? PLAN_LIMITS[plan]["site-score"] : null,
      ),
      "screening-report": allowance(
        usedByKind.get("screening-report") ?? 0,
        enforcementEnabled ? PLAN_LIMITS[plan]["screening-report"] : null,
      ),
    },
  };
}

type UsageContext = {
  projectId?: string;
  snapshotId?: string;
  idempotencyKey?: string;
};

export async function reserveUsage(
  userId: string,
  kind: UsageKind,
  context: UsageContext = {},
) {
  const period = usagePeriod();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (transaction) => {
          if (context.idempotencyKey) {
            const existing = await transaction.usageEvent.findUnique({
              where: { idempotencyKey: context.idempotencyKey },
            });
            if (existing) {
              return { eventId: existing.id, newlyConsumed: false };
            }
          }

          const user = await transaction.user.findUnique({
            where: { id: userId },
            select: { plan: true, subscriptionStatus: true },
          });
          const plan = effectivePlan(user);
          const limit = PLAN_LIMITS[plan][kind];
          if (isBillingEnforcementEnabled()) {
            const aggregate = await transaction.usageEvent.aggregate({
              where: { userId, kind, periodKey: period.key },
              _sum: { units: true },
            });
            const used = aggregate._sum.units ?? 0;
            if (used >= limit) throw new UsageLimitError(kind, limit);
          }

          const event = await transaction.usageEvent.create({
            data: {
              userId,
              kind,
              periodKey: period.key,
              projectId: context.projectId,
              snapshotId: context.snapshotId,
              idempotencyKey: context.idempotencyKey,
            },
          });
          return { eventId: event.id, newlyConsumed: true };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034" &&
        attempt < 2
      ) {
        continue;
      }
      throw error;
    }
  }
  throw new Error("Usage reservation could not be completed.");
}

export async function releaseUsage(eventId: string) {
  await prisma.usageEvent.deleteMany({ where: { id: eventId } });
}

export async function attachUsageSnapshot(eventId: string, snapshotId: string) {
  await prisma.usageEvent.updateMany({
    where: { id: eventId },
    data: { snapshotId },
  });
}
