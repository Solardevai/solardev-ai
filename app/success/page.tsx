import type { Metadata } from "next";
import Link from "next/link";
import PurchaseTracker from "@/components/PurchaseTracker";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Purchase confirmed",
  description: "Your SolarDev AI purchase has been confirmed.",
  robots: {
    index: false,
    follow: false,
  },
};

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string | string[];
  }>;
};

export default async function SuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;

  const sessionId = Array.isArray(params.session_id)
    ? params.session_id[0]
    : params.session_id;

  if (!sessionId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <h1 className="text-3xl font-bold">Session not found</h1>

          <p className="mt-4 leading-7 text-slate-300">
            The Stripe checkout session identifier is missing.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-lg bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Return to SolarDev AI
          </Link>
        </section>
      </main>
    );
  }

  let session;

  try {
    const stripe = getStripe();

    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
  } catch (error) {
    console.error("Unable to retrieve Stripe Checkout Session:", error);

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <h1 className="text-3xl font-bold">
            Unable to verify the payment
          </h1>

          <p className="mt-4 leading-7 text-slate-300">
            Please contact support if your payment was completed.
          </p>

          <a
            href="mailto:support@solardev.ai"
            className="mt-8 inline-flex rounded-lg bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Contact support
          </a>
        </section>
      </main>
    );
  }

  if (session.payment_status !== "paid") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
            Payment processing
          </p>

          <h1 className="mt-4 text-3xl font-bold">
            Your payment is still being processed
          </h1>

          <p className="mt-4 leading-7 text-slate-300">
            You will receive confirmation after Stripe completes the
            transaction.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
          >
            Return to SolarDev AI
          </Link>
        </section>
      </main>
    );
  }

  const stripeLineItems = session.line_items?.data ?? [];

  const analyticsItems = stripeLineItems.map((lineItem) => {
    const quantity = lineItem.quantity ?? 1;

    // GA4 value should exclude tax and shipping.
    const netLineTotal =
      lineItem.amount_subtotal - lineItem.amount_discount;

    const unitPrice = netLineTotal / quantity / 100;

    return {
      item_id: lineItem.price?.id ?? lineItem.id,
      item_name:
        lineItem.description ??
        "AI for Utility-Scale Solar & BESS Project Development — Volume 1",
      item_category: "Digital Handbook",
      price: Number(unitPrice.toFixed(2)),
      quantity,
    };
  });

  const fallbackNetSubtotal =
    (session.amount_subtotal ?? session.amount_total ?? 0) -
    (session.total_details?.amount_discount ?? 0);

  const items =
    analyticsItems.length > 0
      ? analyticsItems
      : [
          {
            item_id: "solardev-volume-1",
            item_name:
              "AI for Utility-Scale Solar & BESS Project Development — Volume 1",
            item_category: "Digital Handbook",
            price: Number((fallbackNetSubtotal / 100).toFixed(2)),
            quantity: 1,
          },
        ];

  const purchaseValue =
    stripeLineItems.length > 0
      ? stripeLineItems.reduce(
          (total, lineItem) =>
            total +
            lineItem.amount_subtotal -
            lineItem.amount_discount,
          0
        ) / 100
      : fallbackNetSubtotal / 100;

  const currency = (session.currency ?? "eur").toUpperCase();

  const tax = (session.total_details?.amount_tax ?? 0) / 100;

  const shipping =
    (session.total_details?.amount_shipping ?? 0) / 100;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <PurchaseTracker
        transactionId={session.id}
        value={Number(purchaseValue.toFixed(2))}
        currency={currency}
        tax={Number(tax.toFixed(2))}
        shipping={Number(shipping.toFixed(2))}
        items={items}
        debugMode={true}
      />

      <section className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 text-3xl text-emerald-400">
          ✓
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-amber-400">
          Payment confirmed
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          Thank you for your purchase
        </h1>

        <p className="mt-5 leading-8 text-slate-300">
          Your payment for SolarDev AI Volume 1 was successfully
          processed.
        </p>

        <div className="mt-8 rounded-xl border border-white/10 bg-slate-950 p-5 text-left">
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Amount</span>

            <span className="font-semibold">
              {new Intl.NumberFormat("en", {
                style: "currency",
                currency,
              }).format((session.amount_total ?? 0) / 100)}
            </span>
          </div>

          <div className="mt-3 flex justify-between gap-4">
            <span className="text-slate-400">Order reference</span>

            <span className="max-w-[230px] truncate font-mono text-xs text-slate-300">
              {session.id}
            </span>
          </div>
        </div>

        <p className="mt-8 text-sm leading-6 text-slate-400">
          Check the email address provided during checkout for your
          Stripe receipt and product delivery information.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-lg bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
        >
          Return to SolarDev AI
        </Link>
      </section>
    </main>
  );
}