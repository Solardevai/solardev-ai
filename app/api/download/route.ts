import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { handbookProducts } from "@/data/productData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function errorResponse(
  message: string,
  status: number,
) {
  return NextResponse.json(
    {
      error: message,
    },
    {
      status,
      headers: {
        "Cache-Control":
          "private, no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}

export async function GET(
  request: NextRequest,
) {
  try {
    const sessionId =
      request.nextUrl.searchParams.get(
        "session_id",
      );

    if (
      !sessionId ||
      !sessionId.startsWith("cs_")
    ) {
      return errorResponse(
        "A valid Stripe Checkout Session is required.",
        400,
      );
    }

    const stripe = getStripe();

    /*
     * Verify the Checkout Session directly with
     * Stripe. Never trust payment information
     * supplied by the browser.
     */
    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId,
      );

    if (session.payment_status !== "paid") {
      return errorResponse(
        "Stripe has not confirmed this payment as paid.",
        403,
      );
    }

    /*
     * Retrieve the purchased items directly from Stripe,
     * then match them to the configured handbook catalog.
     */
    const lineItems =
      await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          limit: 100,
          expand: ["data.price.product"],
        },
      );

    const purchasedProductIds = new Set(
      lineItems.data.flatMap((lineItem) => {
        const product =
          lineItem.price?.product;

        if (!product) {
          return [];
        }

        const productId =
          typeof product === "string"
            ? product
            : product.id;

        return [productId];
      }),
    );

    const purchasedHandbook =
      handbookProducts.find((product) =>
        purchasedProductIds.has(
          product.stripeProductId,
        ),
      );

    if (!purchasedHandbook) {
      return errorResponse(
        "This Checkout Session does not include a recognised SolarDev AI handbook.",
        403,
      );
    }

    /*
     * Retrieve the PDF from the private Vercel
     * Blob store only after payment and product
     * verification have succeeded.
     */
    const result = await get(
      purchasedHandbook.blobPathname,
      {
        access: "private",
      },
    );

    if (
      !result ||
      result.statusCode !== 200 ||
      !result.stream
    ) {
      console.error(
        `Private PDF not found at: ${purchasedHandbook.blobPathname}`,
      );

      return errorResponse(
        "The purchased file could not be found. Please contact support.",
        404,
      );
    }

    return new NextResponse(result.stream, {
      status: 200,
      headers: {
        "Content-Type":
          result.blob.contentType ??
          "application/pdf",
        "Content-Disposition":
          `attachment; filename="${purchasedHandbook.downloadFilename}"`,
        "Content-Length":
          result.blob.size?.toString() ?? "",
        "Cache-Control":
          "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (error) {
    console.error(
      "Protected download error:",
      error,
    );

    return errorResponse(
      "The download could not be authorised. Please contact support if your payment was completed.",
      500,
    );
  }
}
