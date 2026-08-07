import type { UsageKind, UsageSummary } from "@/types/billing";

type BillingUsagePanelProps = {
  usage: UsageSummary;
  notice?: string;
};

const usageLabels: Record<UsageKind, string> = {
  "site-score": "Full site-score runs",
  "screening-report": "New report generations",
};

const noticeText: Record<string, string> = {
  success:
    "Stripe Checkout completed. Pro access activates after signed webhook confirmation.",
  cancelled: "Checkout was cancelled and no plan change was made.",
  "already-active": "Workspace Pro is already active for this account.",
  "report-limit":
    "Your monthly new-report allowance is exhausted. Existing generated reports remain downloadable.",
};

function UsageMeter({
  kind,
  usage,
}: {
  kind: UsageKind;
  usage: UsageSummary["allowances"][UsageKind];
}) {
  const percent = Math.min(100, Math.round((usage.used / usage.limit) * 100));
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-300">{usageLabels[kind]}</span>
        <span className="text-slate-500">
          {usage.used}/{usage.limit}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`${usageLabels[kind]} used`}
        aria-valuemin={0}
        aria-valuemax={usage.limit}
        aria-valuenow={usage.used}
        className="mt-3 h-2 overflow-hidden rounded-full bg-white/8"
      >
        <div
          className={`h-full rounded-full ${percent >= 100 ? "bg-rose-400" : "bg-emerald-400"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-[10px] text-slate-500">
        {usage.remaining} remaining this UTC month
      </p>
    </div>
  );
}

export default function BillingUsagePanel({
  usage,
  notice,
}: BillingUsagePanelProps) {
  return (
    <section
      className="mb-12 rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8"
      aria-labelledby="account-usage-title"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
            Account and usage
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2
              id="account-usage-title"
              className="text-3xl font-semibold tracking-tight"
            >
              Workspace {usage.plan === "pro" ? "Pro" : "Free"}
            </h2>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
              {usage.subscriptionStatus}
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Allowances reset at the start of each UTC month. Failed analyses are
            released automatically, and downloading an already-generated
            snapshot report does not consume another report unit.
          </p>
          {notice && noticeText[notice] ? (
            <p
              role="status"
              className="mt-4 rounded-xl border border-sky-300/15 bg-sky-300/[0.05] p-3 text-xs leading-5 text-sky-100"
            >
              {noticeText[notice]}
            </p>
          ) : null}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(Object.keys(usage.allowances) as UsageKind[]).map((kind) => (
              <UsageMeter key={kind} kind={kind} usage={usage.allowances[kind]} />
            ))}
          </div>
          <p className="mt-3 text-[10px] text-slate-600">
            Current usage period: {usage.periodKey}
          </p>
        </div>

        <div className="flex min-w-48 flex-col gap-2">
          {usage.plan === "free" && usage.checkoutConfigured ? (
            <form action="/api/billing/checkout" method="post">
              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300"
              >
                Upgrade with Stripe
              </button>
            </form>
          ) : null}
          {usage.plan === "free" && !usage.checkoutConfigured ? (
            <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-slate-400">
              Pro upgrades are not currently available.
            </p>
          ) : null}
          {usage.canManageBilling ? (
            <form action="/api/billing/portal" method="post">
              <button
                type="submit"
                className="w-full rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.06]"
              >
                Manage billing
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </section>
  );
}
