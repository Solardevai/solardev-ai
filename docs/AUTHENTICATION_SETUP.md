# SolarDev AI authentication setup

The application code includes Clerk-powered sign-in, sign-up, account controls,
and a protected `/dashboard`. Public tools remain available without an
account. Project persistence, onboarding storage, usage metering, and Stripe
subscriptions are separate implementation phases.

## 1. Create the Clerk environments

Create separate Clerk development and production instances. Copy
`.env.example` to `.env.local` for local work and add the matching values:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

Use development keys locally and in non-production previews. Add production
keys only to the production deployment environment. Never commit either
secret key or `.clerk/keyless.json`.

Interactive local development can use Clerk keyless mode temporarily. Builds,
automated tests, preview deployments, and production deployments should use an
explicit key pair.

## 2. Configure first-release sign-up

In the Clerk Dashboard, configure the instance to match the SolarDev AI launch
scope:

- Enable email address and password sign-up.
- Require first name and last name.
- Require email verification before a session can access the workspace.
- Enable password reset.
- Set the password policy to at least 10 characters.
- Enable Google as a social connection.
- Keep Microsoft sign-in, organisations, SSO/SAML, and mandatory user MFA for a
  later team or enterprise phase.
- Enable Clerk legal acceptance and link it to
  `https://www.solardev.ai/terms` and
  `https://www.solardev.ai/privacy`.
- Keep marketing consent separate and optional; collect it later in
  onboarding rather than treating it as account consent.

Confirm the allowed origins and redirect URLs for localhost, preview
deployments, and `https://www.solardev.ai`.

## 3. Verify before production

Test each of these flows in the development instance, then repeat with the
production instance before launch:

1. Email/password registration.
2. Required email verification.
3. Google registration and sign-in.
4. Password reset.
5. Redirect to `/dashboard` after successful sign-in or sign-up.
6. Redirect from `/dashboard` to `/sign-in` when signed out.
7. Account-profile access and sign-out from the header avatar.
8. Rejection of protected routes when Clerk credentials are absent or invalid.

The application must not store passwords or payment-card details. When project
storage and subscriptions are added, keep the Clerk user ID as the
authentication identifier and grant paid access only after a verified Stripe
webhook confirms the subscription.
