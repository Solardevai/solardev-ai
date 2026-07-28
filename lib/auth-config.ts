const hasPublishableKey = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
);

const hasSecretKey = Boolean(process.env.CLERK_SECRET_KEY);

const canUseKeylessDevelopment =
  process.env.NODE_ENV === "development" &&
  !process.env.CI &&
  !hasPublishableKey &&
  !hasSecretKey;

/**
 * Clerk can create a temporary keyless instance during interactive local
 * development. Production and automated environments require an explicit
 * publishable/secret key pair.
 */
export function isAuthenticationAvailable() {
  return canUseKeylessDevelopment || (hasPublishableKey && hasSecretKey);
}
