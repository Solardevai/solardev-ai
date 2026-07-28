import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import AuthPageShell, {
  AuthenticationUnavailable,
} from "@/components/AuthPageShell";
import { isAuthenticationAvailable } from "@/lib/auth-config";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create a free SolarDev AI account for the protected engineering workspace.",
  alternates: {
    canonical: "/sign-up",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpPage() {
  return (
    <AuthPageShell
      eyebrow="Free account"
      title="Create your SolarDev AI account"
      description="Create the account that will bring saved solar and BESS projects, professional reports and your engineering workspace together."
    >
      {isAuthenticationAvailable() ? (
        <div className="w-full">
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/dashboard"
          />
          <p className="mx-auto mt-5 max-w-sm text-center text-xs leading-5 text-slate-400">
            By creating an account, you confirm that you accept the{" "}
            <Link
              href="/terms"
              className="font-semibold text-slate-200 underline underline-offset-4"
            >
              Terms of Service and Sale
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-semibold text-slate-200 underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      ) : (
        <AuthenticationUnavailable />
      )}
    </AuthPageShell>
  );
}
