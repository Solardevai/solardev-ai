import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is missing. Add it to the Vercel environment variables."
    );
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey);
  }

  return stripeInstance;
}