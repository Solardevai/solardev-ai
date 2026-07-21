import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured. Add it to .env.local.",
    );
  }

  const stripeMode = secretKey.startsWith("sk_test_")
    ? "test"
    : secretKey.startsWith("sk_live_")
      ? "live"
      : "unknown";

  console.info(`[Stripe] Server key mode: ${stripeMode}`);

  if (stripeMode === "unknown") {
    throw new Error(
      "STRIPE_SECRET_KEY does not appear to be a valid Stripe secret key.",
    );
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}