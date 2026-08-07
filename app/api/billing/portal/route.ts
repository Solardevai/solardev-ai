import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { billingReturnBase } from "@/lib/billing/url";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });
  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account is connected." },
      { status: 404 },
    );
  }

  const session = await getStripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${billingReturnBase(request.nextUrl.origin)}/dashboard`,
  });
  return NextResponse.redirect(session.url, 303);
}
