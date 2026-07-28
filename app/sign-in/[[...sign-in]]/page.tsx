import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import AuthPageShell, {
  AuthenticationUnavailable,
} from "@/components/AuthPageShell";
import { isAuthenticationAvailable } from "@/lib/auth-config";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to the protected SolarDev AI engineering workspace.",
  alternates: {
    canonical: "/sign-in",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInPage() {
  return (
    <AuthPageShell
      eyebrow="Account access"
      title="Welcome back to SolarDev AI"
      description="Sign in to return to your solar and BESS development workspace."
    >
      {isAuthenticationAvailable() ? (
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
        />
      ) : (
        <AuthenticationUnavailable />
      )}
    </AuthPageShell>
  );
}
