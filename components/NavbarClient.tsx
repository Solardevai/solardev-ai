"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { navigationItems } from "@/data/siteData";

type NavbarClientProps = {
  authEnabled: boolean;
};

type AuthControlsProps = {
  authEnabled: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
};

function SignedOutControls({
  mobile = false,
  onNavigate,
}: Omit<AuthControlsProps, "authEnabled">) {
  if (mobile) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/sign-in"
          onClick={onNavigate}
          className="flex min-h-12 items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          onClick={onNavigate}
          className="flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        >
          Start free
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/sign-in"
        className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
      >
        Start free
      </Link>
    </>
  );
}

function ClerkAuthControls({
  mobile = false,
  onNavigate,
}: Omit<AuthControlsProps, "authEnabled">) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div
        aria-label="Loading account controls"
        className={
          mobile
            ? "h-12 animate-pulse rounded-xl bg-white/[0.05]"
            : "h-10 w-40 animate-pulse rounded-xl bg-white/[0.05]"
        }
      />
    );
  }

  if (!isSignedIn) {
    return (
      <SignedOutControls
        mobile={mobile}
        onNavigate={onNavigate}
      />
    );
  }

  if (mobile) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-amber-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        >
          Dashboard
        </Link>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/dashboard"
        className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        Dashboard
      </Link>
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-9 w-9",
          },
        }}
      />
    </>
  );
}

function AuthControls({
  authEnabled,
  mobile = false,
  onNavigate,
}: AuthControlsProps) {
  if (!authEnabled) {
    return (
      <SignedOutControls
        mobile={mobile}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <ClerkAuthControls
      mobile={mobile}
      onNavigate={onNavigate}
    />
  );
}

export default function Navbar({
  authEnabled,
}: NavbarClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function resolveNavigationHref(href: string) {
    return href.startsWith("#") ? `/${href}` : href;
  }

  return (
    <header className="border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        {/* Logo */}
        <Link
          href="/#home"
          aria-label="Go to the SolarDev AI homepage"
          onClick={closeMenu}
          className="flex items-center gap-3 whitespace-nowrap transition hover:opacity-90 lg:justify-self-start"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-yellow-400/30 bg-yellow-400/10">
            <span className="h-4 w-4 rounded-full bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.75)]" />
          </span>

          <span className="hidden text-xl font-bold tracking-tight text-white sm:inline lg:text-2xl">
            SolarDev <span className="text-yellow-400">AI</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 justify-self-center text-sm lg:flex"
        >
          {navigationItems.map((item, index) => (
            <div key={item.label} className="contents">
              {index === 1 && (
                <details className="group relative">
                  <summary className="flex cursor-pointer list-none items-center gap-1.5 font-medium text-slate-300 transition marker:content-none hover:text-white focus:outline-none focus-visible:text-white">
                    Tools
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-4 w-4 transition group-open:rotate-180"
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>

                  <div className="absolute left-1/2 top-full z-50 mt-4 w-80 -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl shadow-black/40">
                    <Link
                      href="/handbooks"
                      className="block rounded-xl px-4 py-3 transition hover:bg-white/[0.06] focus:outline-none focus-visible:bg-white/[0.06]"
                    >
                      <span className="block font-semibold text-white">
                        Handbooks
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-400">
                        Utility-scale Solar and BESS development volumes.
                      </span>
                    </Link>

                    <Link
                      href="/tools/solar-site-screening"
                      className="mt-1 block rounded-xl px-4 py-3 transition hover:bg-white/[0.06] focus:outline-none focus-visible:bg-white/[0.06]"
                    >
                      <span className="block font-semibold text-white">
                        Site Check
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-400">
                        Measure a boundary and run a PVGIS solar pre-check.
                      </span>
                    </Link>

                    <Link
                      href="/tools/sun-path"
                      className="mt-1 block rounded-xl px-4 py-3 transition hover:bg-white/[0.06] focus:outline-none focus-visible:bg-white/[0.06]"
                    >
                      <span className="block font-semibold text-white">
                        Solar Angle
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-400">
                        Explore solar angles and indicative shading geometry.
                      </span>
                    </Link>

                    <div
                      aria-disabled="true"
                      className="mt-1 rounded-xl px-4 py-3 opacity-75"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-white">
                          Templates & Workflows
                        </span>
                        <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                          In development
                        </span>
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-400">
                        Searchable professional prompts and workflows.
                      </span>
                    </div>

                    <div
                      aria-disabled="true"
                      className="mt-1 rounded-xl px-4 py-3 opacity-75"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-white">
                          Templates
                        </span>
                        <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                          In development
                        </span>
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-400">
                        Reusable engineering templates and checklists.
                      </span>
                    </div>
                  </div>
                </details>
              )}

              <a
                href={resolveNavigationHref(item.href)}
                className="font-medium text-slate-300 transition hover:text-white focus:outline-none focus-visible:text-white"
              >
                {item.label}
              </a>
            </div>
          ))}
        </nav>

        {/* Desktop account controls */}
        <div className="hidden items-center gap-2 justify-self-end lg:flex">
          <AuthControls authEnabled={authEnabled} />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() =>
              setIsMenuOpen((currentValue) => !currentValue)
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition hover:border-emerald-400/30 hover:bg-emerald-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {isMenuOpen ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
              >
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
              >
                <path
                  d="M4 7H20M4 12H20M4 17H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-navigation"
        className={`bg-slate-950 transition-[max-height,opacity] duration-300 lg:hidden ${
          isMenuOpen
            ? "max-h-[80vh] overflow-y-auto border-t border-white/10 opacity-100"
            : "max-h-0 overflow-hidden border-t border-transparent opacity-0"
        }`}
      >
        <nav
          aria-label="Mobile navigation"
          className="mx-auto max-w-7xl px-4 py-5 sm:px-6"
        >
          <ul className="space-y-1">
            {navigationItems.map((item, index) => (
              <li key={item.label}>
                {index === 1 && (
                  <div className="mb-2 rounded-xl border border-white/10 bg-white/[0.025] p-2">
                    <p className="px-2 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Tools
                    </p>
                    <Link
                      href="/handbooks"
                      onClick={closeMenu}
                      className="flex min-h-12 items-center justify-between rounded-lg px-3 py-3 font-semibold text-white transition hover:bg-white/[0.05] focus:outline-none focus-visible:bg-white/[0.05]"
                    >
                      Handbooks
                      <span
                        aria-hidden="true"
                        className="text-emerald-400"
                      >
                        →
                      </span>
                    </Link>
                    <Link
                      href="/tools/solar-site-screening"
                      onClick={closeMenu}
                      className="flex min-h-12 items-center justify-between rounded-lg px-3 py-3 font-semibold text-white transition hover:bg-white/[0.05] focus:outline-none focus-visible:bg-white/[0.05]"
                    >
                      Site Check
                    </Link>
                    <Link
                      href="/tools/sun-path"
                      onClick={closeMenu}
                      className="flex min-h-12 items-center justify-between rounded-lg px-3 py-3 font-semibold text-white transition hover:bg-white/[0.05] focus:outline-none focus-visible:bg-white/[0.05]"
                    >
                      Solar Angle
                    </Link>
                    <div
                      aria-disabled="true"
                      className="flex min-h-12 items-center justify-between gap-3 rounded-lg px-3 py-3 text-slate-400"
                    >
                      <span className="font-semibold">
                        Templates & Workflows
                      </span>
                      <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                        In development
                      </span>
                    </div>
                    <div
                      aria-disabled="true"
                      className="flex min-h-12 items-center justify-between gap-3 rounded-lg px-3 py-3 text-slate-400"
                    >
                      <span className="font-semibold">
                        Templates
                      </span>
                      <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                        In development
                      </span>
                    </div>
                  </div>
                )}

                <a
                  href={resolveNavigationHref(item.href)}
                  onClick={closeMenu}
                  className="flex min-h-12 items-center rounded-xl px-4 py-3 font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white focus:outline-none focus-visible:bg-white/[0.05] focus-visible:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-5 border-t border-white/10 pt-5">
            <AuthControls
              authEnabled={authEnabled}
              mobile
              onNavigate={closeMenu}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
