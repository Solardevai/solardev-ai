import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FulfilmentResult =
  | {
      status: "verified";
      sessionId: string;
      customerEmail: string;
    }
  | {
      status: "ignored";
      reason: string;
    };

function getLineItemProductId(
  lineItem: Stripe.LineItem,
): string | null {
  const product = lineItem.price?.product;

  if (!product) {
    return null;
  }

  if (typeof product === "string") {
    return product;
  }

  return product.id;
}

async function verifyPaidOrder(
  sessionId: string,
): Promise<FulfilmentResult> {
  const stripe = getStripe();

  const expectedProductId =
    process.env.STRIPE_VOLUME1_PRODUCT_ID;

  if (!expectedProductId) {
    throw new Error(
      "STRIPE_VOLUME1_PRODUCT_ID is not configured.",
    );
  }

  const session =
    await stripe.checkout.sessions.retrieve(
      sessionId,
      {
        expand: [
          "line_items.data.price.product",
        ],
      },
    );

  if (session.payment_status !== "paid") {
    return {
      status: "ignored",
      reason: `Session payment status is ${session.payment_status}.`,
    };
  }

  const lineItems =
    session.line_items?.data ?? [];

  const containsVolumeOne =
    lineItems.some((lineItem) => {
      return (
        getLineItemProductId(lineItem) ===
        expectedProductId
      );
    });

  if (!containsVolumeOne) {
    return {
      status: "ignored",
      reason:
        "The Checkout Session does not contain the configured SolarDev AI Volume 1 product.",
    };
  }

  const customerEmail =
    session.customer_details?.email ??
    session.customer_email;

  if (!customerEmail) {
    throw new Error(
      `No customer email was found for Checkout Session ${session.id}.`,
    );
  }

  /*
   * The payment and product are now verified.
   *
   * The next fulfilment step will:
   * 1. Create a persistent order record.
   * 2. Prevent duplicate fulfilment.
   * 3. Generate secure product access.
   * 4. Send the delivery email.
   *
   * Do not add a public PDF URL here.
   */

  console.info("Paid SolarDev AI order verified", {
    sessionId: session.id,
    productId: expectedProductId,
    amountTotal: session.amount_total,
    currency: session.currency,
  });

  return {
    status: "verified",
    sessionId: session.id,
    customerEmail,
  };
}

export async function POST(request: Request) {
  const signature = request.headers.get(
    "stripe-signature",
  );

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    return NextResponse.json(
      {
        error:
          "Missing Stripe-Signature header.",
      },
      {
        status: 400,
      },
    );
  }

  if (!webhookSecret) {
    console.error(
      "STRIPE_WEBHOOK_SECRET is not configured.",
    );

    return NextResponse.json(
      {
        error:
          "Webhook configuration is incomplete.",
      },
      {
        status: 500,
      },
    );
  }

  /*
   * Signature verification requires the exact raw body
   * sent by Stripe. Do not call request.json() first.
   */
  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown signature error.";

    console.error(
      "Stripe webhook signature verification failed:",
      message,
    );

    return NextResponse.json(
      {
        error:
          "Invalid Stripe webhook signature.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        /*
         * Card payments normally have payment_status=paid
         * at this point. Delayed payment methods might not.
         */
        if (session.payment_status === "paid") {
          const result =
            await verifyPaidOrder(session.id);

          console.info(
            "checkout.session.completed processed",
            {
              eventId: event.id,
              result: result.status,
            },
          );
        } else {
          console.info(
            "Checkout completed but payment is not yet paid",
            {
              eventId: event.id,
              sessionId: session.id,
              paymentStatus:
                session.payment_status,
            },
          );
        }

        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        const result =
          await verifyPaidOrder(session.id);

        console.info(
          "checkout.session.async_payment_succeeded processed",
          {
            eventId: event.id,
            result: result.status,
          },
        );

        break;
      }

      case "checkout.session.async_payment_failed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        console.warn(
          "Delayed Stripe payment failed",
          {
            eventId: event.id,
            sessionId: session.id,
          },
        );

        break;
      }

      default: {
        console.info(
          "Stripe event ignored",
          {
            eventId: event.id,
            eventType: event.type,
          },
        );
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown webhook processing error.";

    console.error(
      "Stripe webhook processing failed:",
      {
        eventId: event.id,
        eventType: event.type,
        message,
      },
    );

    /*
     * Returning a 500 response tells Stripe that
     * processing failed and that the event should
     * be retried.
     */
    return NextResponse.json(
      {
        error:
          "Webhook processing failed.",
      },
      {
        status: 500,
      },
    );
  }
}