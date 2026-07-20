import type { Metadata } from "next";
import Link from "next/link";
import PurchaseTracker from "@/components/PurchaseTracker";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

function formatAmount(
  amount: number | null | undefined,
  currency: string,
) {
  if (amount === null || amount === undefined) {
    return null;
  }

  try {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency,
    }).format(amount / 100);
  } catch {
    return `${(amount / 100).toFixed(2)} ${currency}`;
  }
}

function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-amber-400"
        >
          <span aria-hidden="true">←</span>
          Return to SolarDev AI
        </Link>

        {children}
      </div>
    </main>
  );
}

function StatusCard({
  status,
  eyebrow,
  title,
  description,
}: {
  status: "success" | "processing" | "error";
  eyebrow: string;
  title: string;
  description: string;
}) {
  const styles = {
    success: {
      container: "border-emerald-400/20 bg-emerald-400/[0.04]",
      icon: "bg-emerald-400/10 text-emerald-400",
      eyebrow: "text-emerald-300",
      symbol: "✓",
    },
    processing: {
      container: "border-amber-400/20 bg-amber-400/[0.04]",
      icon: "bg-amber-400/10 text-amber-400",
      eyebrow: "text-amber-400",
      symbol: "…",
    },
    error: {
      container: "border-red-400/20 bg-red-400/[0.04]",
      icon: "bg-red-400/10 text-red-300",
      eyebrow: "text-red-300",
      symbol: "!",
    },
  };

  const currentStyles = styles[status];

  return (
    <section
      className={`mt-10 rounded-3xl border p-8 text-center shadow-2xl shadow-black/20 sm:p-12 ${currentStyles.container}`}
    >
      <div
        aria-hidden="true"
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl font-bold ${currentStyles.icon}`}
      >
        {currentStyles.symbol}
      </div>

      <p
        className={`mt-8 text-sm font-semibold uppercase tracking-[0.2em] ${currentStyles.eyebrow}`}
      >
        {eyebrow}
      </p>

      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>

      <p className="mx-auto mt-5 max-w-xl leading-8 text-slate-300">
        {description}
      </p>
    </section>
  );
}

function SupportSection() {
  return (
    <section className="mt-10 text-center">
      <p className="text-sm leading-6 text-slate-400">
        Need help with payment, access or delivery?
      </p>

      <a
        href="mailto:support@solardev.ai"
        className="mt-2 inline-block font-semibold text-amber-400 transition hover:text-amber-300"
      >
        support@solardev.ai
      </a>

      <div className="mt-8 flex flex-wrap justify-center gap-5 text-sm">
        <Link
          href="/terms"
          className="text-slate-400 transition hover:text-white"
        >
          Terms of Sale
        </Link>

        <Link
          href="/refund-policy"
          className="text-slate-400 transition hover:text-white"
        >
          Refund Policy
        </Link>

        <Link
          href="/privacy"
          className="text-slate-400 transition hover:text-white"
        >
          Privacy Policy
        </Link>
      </div>
    </section>
  );
}

function OrderReference({
  sessionId,
}: {
  sessionId: string;
}) {
  const shortReference = sessionId.slice(-10).toUpperCase();

  return (
    <p className="mt-8 text-center text-sm text-slate-500">
      Order reference:{" "}
      <span className="font-mono font-semibold text-slate-300">
        {shortReference}
      </span>
    </p>
  );
}

export default async function SuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;

  const sessionId = Array.isArray(params.session_id)
    ? params.session_id[0]
    : params.session_id;

  if (!sessionId) {
    return (
      <PageShell>
        <StatusCard
          status="error"
          eyebrow="Order reference missing"
          title="We could not locate your checkout session"
          description="The Stripe Checkout Session identifier is missing from this page address. If you completed a payment, do not pay again. Contact support using the email address below."
        />

        <SupportSection />
      </PageShell>
    );
  }

  try {
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.retrieve(
      sessionId,
      {
        expand: ["line_items"],
      },
    );

    if (session.payment_status !== "paid") {
      return (
        <PageShell>
          <StatusCard
            status="processing"
            eyebrow="Payment processing"
            title="Your payment is still being processed"
            description="Stripe has not yet confirmed this payment as paid. Some payment methods can take longer to complete. Check your email for updates and do not submit another payment."
          />

          <OrderReference sessionId={session.id} />

          <SupportSection />
        </PageShell>
      );
    }

    const stripeLineItems =
      session.line_items?.data ?? [];

    const analyticsItems = stripeLineItems.map(
      (lineItem) => {
        const quantity = lineItem.quantity ?? 1;

        const netLineTotal =
          lineItem.amount_subtotal -
          lineItem.amount_discount;

        const unitPrice =
          netLineTotal / quantity / 100;

        return {
          item_id:
            lineItem.price?.id ?? lineItem.id,
          item_name:
            lineItem.description ??
            "AI for Utility-Scale Solar & BESS Project Development — Volume 1",
          item_category: "Digital Handbook",
          price: Number(unitPrice.toFixed(2)),
          quantity,
        };
      },
    );

    const fallbackNetSubtotal =
      (session.amount_subtotal ??
        session.amount_total ??
        0) -
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
              price: Number(
                (fallbackNetSubtotal / 100).toFixed(2),
              ),
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
            0,
          ) / 100
        : fallbackNetSubtotal / 100;

    const currency = (
      session.currency ?? "eur"
    ).toUpperCase();

    const tax =
      (session.total_details?.amount_tax ?? 0) /
      100;

    const shipping =
      (session.total_details?.amount_shipping ??
        0) / 100;

    const formattedAmount = formatAmount(
      session.amount_total,
      currency,
    );

    const customerEmail =
      session.customer_details?.email ??
      session.customer_email;

    return (
      <PageShell>
        <PurchaseTracker
          transactionId={session.id}
          value={Number(
            purchaseValue.toFixed(2),
          )}
          currency={currency}
          tax={Number(tax.toFixed(2))}
          shipping={Number(
            shipping.toFixed(2),
          )}
          items={items}
          debugMode={
            process.env.NODE_ENV !== "production"
          }
        />

        <StatusCard
          status="success"
          eyebrow="Payment confirmed"
          title="Thank you for your purchase"
          description="Stripe has confirmed your payment for SolarDev AI Volume 1."
        />

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white">
            Order summary
          </h2>

          <dl className="mt-5 divide-y divide-white/10">
            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-sm text-slate-500">
                Product
              </dt>

              <dd className="font-semibold text-slate-200">
                SolarDev AI Volume 1
              </dd>
            </div>

            {formattedAmount && (
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-sm text-slate-500">
                  Amount paid
                </dt>

                <dd className="font-semibold text-slate-200">
                  {formattedAmount}
                </dd>
              </div>
            )}

            {customerEmail && (
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-sm text-slate-500">
                  Delivery email
                </dt>

                <dd className="break-all font-semibold text-slate-200">
                  {customerEmail}
                </dd>
              </div>
            )}

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-sm text-slate-500">
                Payment status
              </dt>

              <dd className="font-semibold text-emerald-300">
                Paid
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-400/[0.05] p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white">
            What happens next
          </h2>

          <p className="mt-4 leading-7 text-slate-300">
            Your order has been confirmed. Product
            access and delivery instructions will be
            sent to the email address used during
            checkout.
          </p>

          <p className="mt-4 leading-7 text-slate-300">
            Check your spam, junk and promotional
            folders if the message does not appear in
            your main inbox.
          </p>

          <p className="mt-4 leading-7 text-slate-300">
            Do not complete another payment if delivery
            is delayed. Contact SolarDev AI support and
            include your order reference.
          </p>
        </section>

        <OrderReference sessionId={session.id} />

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
          >
            Return to SolarDev AI
          </Link>
        </div>

        <SupportSection />
      </PageShell>
    );
  } catch (error) {
    console.error(
      "Unable to retrieve Stripe Checkout Session:",
      error,
    );

    return (
      <PageShell>
        <StatusCard
          status="error"
          eyebrow="Verification unavailable"
          title="Unable to verify the payment"
          description="We could not verify this Stripe Checkout Session at the moment. If you completed the payment, do not pay again. Contact support and provide the email address used during checkout."
        />

        <OrderReference sessionId={sessionId} />

        <SupportSection />
      </PageShell>
    );
  }
}