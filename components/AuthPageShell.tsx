import Link from "next/link";
import type { ReactNode } from "react";

type AuthPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function AuthPageShell({
  eyebrow,
  title,
  description,
  children,
}: AuthPageShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_20%_10%,rgba(251,191,36,0.13),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.10),transparent_38%)]"
      />

      <header className="relative border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link
            href="/"
            aria-label="SolarDev AI homepage"
            className="inline-flex items-center gap-3 transition hover:opacity-90"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-400/30 bg-yellow-400/10">
              <span className="h-4 w-4 rounded-full bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.75)]" />
            </span>
            <span className="text-xl font-bold tracking-tight">
              SolarDev <span className="text-yellow-400">AI</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-slate-300 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            Back to website
          </Link>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(360px,480px)] lg:items-center lg:px-8 lg:py-20">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {description}
          </p>

          <div className="mt-10 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.035] p-6">
            <p className="text-sm font-semibold text-white">
              Your engineering workspace
            </p>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <li className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-400"
                />
                Site Check and Solar Angle remain available to try before
                registration.
              </li>
              <li className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-400"
                />
                Saved projects, reports, portfolio comparison and plan controls
                are available after registration.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">{children}</div>
      </section>
    </main>
  );
}

export function AuthenticationUnavailable() {
  return (
    <div className="w-full rounded-3xl border border-white/10 bg-slate-900 p-7 shadow-2xl shadow-black/30 sm:p-9">
      <span className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
        Configuration required
      </span>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight">
        Account access is being connected
      </h2>
      <p className="mt-4 leading-7 text-slate-300">
        The sign-in experience is installed, but this environment has not yet
        been connected to its authentication service. The public SolarDev AI
        tools remain available.
      </p>
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <Link
          href="/tools/solar-site-screening"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
        >
          Open Site Check
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.05]"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
