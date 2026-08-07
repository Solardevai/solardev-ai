import "server-only";

import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

const ACTIVE_STATUSES = new Set<Stripe.Subscription.Status>([
  "active",
  "trialing",
]);

function customerId(subscription: Stripe.Subscription) {
  return typeof subscription.customer === "string"
    ? subscription.customer
    : subscription.customer.id;
}

function periodEnd(subscription: Stripe.Subscription) {
  const timestamps = subscription.items.data.map(
    (item) => item.current_period_end,
  );
  return timestamps.length
    ? new Date(Math.max(...timestamps) * 1_000)
    : null;
}

export async function syncWorkspaceSubscription(
  subscription: Stripe.Subscription,
  fallbackUserId?: string | null,
) {
  const configuredPriceId = process.env.STRIPE_WORKSPACE_PRO_PRICE_ID;
  const matchesWorkspacePrice = Boolean(
    configuredPriceId &&
      subscription.items.data.some(
        (item) => item.price.id === configuredPriceId,
      ),
  );
  if (!matchesWorkspacePrice) {
    return { isEntitled: false, updatedUsers: 0, ignored: true };
  }
  const isEntitled =
    ACTIVE_STATUSES.has(subscription.status);
  const clerkUserId =
    subscription.metadata.clerkUserId || fallbackUserId || null;
  const stripeCustomerId = customerId(subscription);
  const data = {
    plan: isEntitled ? "pro" : "free",
    stripeCustomerId,
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    subscriptionPeriodEnd: periodEnd(subscription),
  };

  const result = clerkUserId
    ? await prisma.user.updateMany({
        where: { id: clerkUserId },
        data,
      })
    : await prisma.user.updateMany({
        where: { stripeCustomerId },
        data,
      });

  if (!result.count) {
    console.warn("[Stripe subscription] no matching workspace user", {
      subscriptionId: subscription.id,
      hasClerkUserId: Boolean(clerkUserId),
    });
  }

  return { isEntitled, updatedUsers: result.count, ignored: false };
}

export async function syncWorkspaceCheckout(
  session: Stripe.Checkout.Session,
) {
  if (session.mode !== "subscription" || !session.subscription) return null;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription.id;
  const subscription = await getStripe().subscriptions.retrieve(
    subscriptionId,
  );
  return syncWorkspaceSubscription(
    subscription,
    session.client_reference_id || session.metadata?.clerkUserId,
  );
}
