import "server-only";

export function billingReturnBase(requestOrigin: string) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configured) return configured;
  return process.env.NODE_ENV === "production"
    ? "https://www.solardev.ai"
    : requestOrigin;
}
