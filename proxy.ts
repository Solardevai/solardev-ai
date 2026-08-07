import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAuthenticationAvailable } from "@/lib/auth-config";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/platform(.*)",
  "/projects(.*)",
  "/reports(.*)",
  "/library(.*)",
  "/account(.*)",
  "/api/projects(.*)",
  "/api/reports(.*)",
  "/api/ai(.*)",
]);

const protectWithClerk = clerkMiddleware(
  async (auth, request) => {
    if (isProtectedRoute(request)) {
      await auth.protect();
    }
  },
  {
    signInUrl: "/sign-in",
    signUpUrl: "/sign-up",
  },
);

export default function proxy(
  request: NextRequest,
  event: NextFetchEvent,
) {
  if (isAuthenticationAvailable()) {
    return protectWithClerk(request, event);
  }

  if (isProtectedRoute(request)) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("configuration", "required");

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
