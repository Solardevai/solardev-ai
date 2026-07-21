import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PDF_PATHNAME =
  "products/solardev-ai-volume-1-v4.pdf";

const DOWNLOAD_FILENAME =
  "SolarDev-AI-Volume-1-v4.pdf";

export async function GET(request: NextRequest) {
  try {
    const sessionId =
      request.nextUrl.searchParams.get("session_id");

    if (!sessionId || !sessionId.startsWith("cs_")) {
      return NextResponse.json(
        { error: "A valid Checkout Session is required." },
        { status: 400 },
      );
    }

    const expectedProductId =
      process.env.STRIPE_VOLUME1_PRODUCT_ID;

    if (!expectedProductId) {
      console.error(
        "Missing STRIPE_VOLUME1_PRODUCT_ID",
      );

      return NextResponse.json(
        { error: "Download configuration error." },
        { status: 500 },
      );
    }

    const stripe = getStripe();

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
      return NextResponse.json(
        { error: "Payment has not been confirmed." },
        { status: 403 },
      );
    }

    const correctProductPurchased =
      session.line_items?.data.some((item) => {
        const product = item.price?.product;

        const productId =
          typeof product === "string"
            ? product
            : product?.id;

        return productId === expectedProductId;
      });

    if (!correctProductPurchased) {
      return NextResponse.json(
        {
          error:
            "This purchase does not include Volume 1.",
        },
        { status: 403 },
      );
    }

    const result = await get(PDF_PATHNAME, {
      access: "private",
    });

    if (!result || result.statusCode !== 200) {
      console.error(
        `Private PDF not found: ${PDF_PATHNAME}`,
      );

      return NextResponse.json(
        { error: "The purchased file was not found." },
        { status: 404 },
      );
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          `attachment; filename="${DOWNLOAD_FILENAME}"`,
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

    return NextResponse.json(
      {
        error:
          "The download could not be authorised.",
      },
      { status: 500 },
    );
  }
}