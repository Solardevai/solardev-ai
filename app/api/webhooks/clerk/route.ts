import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: NextRequest) {
  let event;

  try {
    event = await verifyWebhook(request);
  } catch (error) {
    console.error("Clerk webhook signature verification failed:", error);
    return Response.json(
      { error: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  if (event.type !== "session.created") {
    return Response.json({ received: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notificationEmail =
    process.env.SIGN_IN_NOTIFICATION_EMAIL;
  const fromEmail = process.env.SIGN_IN_NOTIFICATION_FROM;

  if (!apiKey || !notificationEmail || !fromEmail) {
    console.error(
      "Sign-in email configuration is incomplete. Set RESEND_API_KEY, SIGN_IN_NOTIFICATION_EMAIL and SIGN_IN_NOTIFICATION_FROM.",
    );
    return Response.json(
      { error: "Email configuration is incomplete." },
      { status: 500 },
    );
  }

  const session = event.data;
  const user = session.user;
  const primaryEmail =
    user?.email_addresses.find(
      (email) => email.id === user.primary_email_address_id,
    )?.email_address ??
    user?.email_addresses[0]?.email_address ??
    "Not available";
  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    "Not provided";
  const activity = session.latest_activity;
  const signInTime = new Date(session.created_at).toLocaleString(
    "en-GB",
    {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: "Europe/Berlin",
    },
  );
  const location =
    [activity?.city, activity?.country].filter(Boolean).join(", ") ||
    "Not available";
  const browser =
    [activity?.browser_name, activity?.browser_version]
      .filter(Boolean)
      .join(" ") || "Not available";
  const device = activity?.device_type || "Not available";
  const safe = {
    email: escapeHtml(primaryEmail),
    name: escapeHtml(fullName),
    time: escapeHtml(signInTime),
    location: escapeHtml(location),
    browser: escapeHtml(browser),
    device: escapeHtml(device),
    userId: escapeHtml(session.user_id),
    sessionId: escapeHtml(session.id),
  };

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send(
    {
      from: fromEmail,
      to: notificationEmail,
      subject: `New SolarDev AI sign-in: ${primaryEmail}`,
      text: [
        "A new SolarDev AI session was created.",
        "",
        `User: ${fullName}`,
        `Email: ${primaryEmail}`,
        `Time: ${signInTime}`,
        `Location: ${location}`,
        `Browser: ${browser}`,
        `Device: ${device}`,
        `User ID: ${session.user_id}`,
        `Session ID: ${session.id}`,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#0f172a">
          <h1 style="font-size:22px">New SolarDev AI sign-in</h1>
          <p>A new authenticated session was created.</p>
          <table style="border-collapse:collapse;width:100%">
            <tbody>
              <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>User</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${safe.name}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Email</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${safe.email}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Time</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${safe.time}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Location</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${safe.location}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Browser</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${safe.browser}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Device</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${safe.device}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>User ID</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${safe.userId}</td></tr>
              <tr><td style="padding:8px"><strong>Session ID</strong></td><td style="padding:8px">${safe.sessionId}</td></tr>
            </tbody>
          </table>
        </div>
      `,
    },
    {
      idempotencyKey: `clerk-session-${session.id}`,
    },
  );

  if (error) {
    console.error("Sign-in notification email failed:", error);
    return Response.json(
      { error: "Notification email failed." },
      { status: 502 },
    );
  }

  return Response.json({ received: true });
}
