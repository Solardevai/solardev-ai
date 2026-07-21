import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const PDF_PATHNAME =
  "products/solardev-ai-volume-1-v4.pdf";

const DOWNLOAD_FILENAME =
  "SolarDev-AI-Volume-1-v4.pdf";

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

    const expectedProductId =
      process.env.STRIPE_VOLUME1_PRODUCT_ID;

    if (!expectedProductId) {
      console.error(
        "Missing STRIPE_VOLUME1_PRODUCT_ID environment variable.",
      );

      return errorResponse(
        "The product download is not configured correctly.",
        500,
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
     * Retrieve the purchased items directly from
     * Stripe so that the route can confirm that
     * this session purchased Volume 1.
     */
    const lineItems =
      await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          limit: 100,
          expand: ["data.price.product"],
        },
      );

    const correctProductPurchased =
      lineItems.data.some((lineItem) => {
        const product =
          lineItem.price?.product;

        if (!product) {
          return false;
        }

        const productId =
          typeof product === "string"
            ? product
            : product.id;

        return productId === expectedProductId;
      });

    if (!correctProductPurchased) {
      return errorResponse(
        "This Checkout Session does not include SolarDev AI Volume 1.",
        403,
      );
    }

    /*
     * Retrieve the PDF from the private Vercel
     * Blob store only after payment and product
     * verification have succeeded.
     */
    const result = await get(PDF_PATHNAME, {
      access: "private",
    });

    if (
      !result ||
      result.statusCode !== 200 ||
      !result.stream
    ) {
      console.error(
        `Private PDF not found at: ${PDF_PATHNAME}`,
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
          `attachment; filename="${DOWNLOAD_FILENAME}"`,
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