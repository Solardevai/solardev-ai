import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { billingReturnBase } from "@/lib/billing/url";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress;
  if (!email) {
    return NextResponse.json(
      { error: "Your account has no verified email." },
      { status: 400 },
    );
  }
  const priceId = process.env.STRIPE_WORKSPACE_PRO_PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { error: "Workspace Pro checkout is not configured." },
      { status: 503 },
    );
  }

  const databaseUser = await prisma.user.upsert({
    where: { id: user.id },
    update: { email },
    create: { id: user.id, email },
  });
  if (
    databaseUser.plan === "pro" &&
    ["active", "trialing"].includes(databaseUser.subscriptionStatus)
  ) {
    return NextResponse.redirect(
      new URL("/dashboard?billing=already-active", request.url),
      303,
    );
  }

  const baseUrl = billingReturnBase(request.nextUrl.origin);
  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer: databaseUser.stripeCustomerId ?? undefined,
    customer_email: databaseUser.stripeCustomerId ? undefined : email,
    client_reference_id: user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { clerkUserId: user.id, product: "workspace-pro" },
    subscription_data: {
      metadata: { clerkUserId: user.id, product: "workspace-pro" },
    },
    success_url: `${baseUrl}/dashboard?billing=success`,
    cancel_url: `${baseUrl}/dashboard?billing=cancelled`,
  });
  if (!session.url) {
    return NextResponse.json(
      { error: "Stripe did not return a checkout URL." },
      { status: 502 },
    );
  }
  return NextResponse.redirect(session.url, 303);
}
