"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { navigationItems } from "@/data/siteData";
import { productData } from "@/data/productData";
import TrackedCheckoutLink from "@/components/TrackedCheckoutLink";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function resolveNavigationHref(href: string) {
    return href.startsWith("#") ? `/${href}` : href;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        {/* Logo */}
        <Link
          href="/#home"
          aria-label="Go to the SolarDev AI homepage"
          onClick={closeMenu}
          className="flex items-center gap-3 whitespace-nowrap transition hover:opacity-90 lg:justify-self-start"
        >
          <Image
            src="/icon.png"
            alt=""
            width={44}
            height={44}
            priority
            className="h-11 w-11 shrink-0 rounded-xl object-cover"
          />

          <span className="hidden text-xl font-bold tracking-tight text-white sm:inline lg:text-2xl">
            SolarDev <span className="text-amber-400">AI</span>
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
                    Products
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
                      href="/solar-bess-project-development-handbook"
                      className="block rounded-xl px-4 py-3 transition hover:bg-white/[0.06] focus:outline-none focus-visible:bg-white/[0.06]"
                    >
                      <span className="block font-semibold text-white">
                        Professional Handbooks
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-400">
                        Utility-scale Solar and BESS development volumes.
                      </span>
                    </Link>

                    <div
                      aria-disabled="true"
                      className="mt-1 rounded-xl px-4 py-3 opacity-75"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-white">
                          Prompt Library
                        </span>
                        <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
                          Coming soon
                        </span>
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-400">
                        Searchable professional prompts and workflows.
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

        {/* Desktop checkout CTA */}
        <div className="hidden justify-self-end lg:block">
          <TrackedCheckoutLink
            href={productData.checkoutUrl}
            buttonLocation="navbar"
            itemId={productData.itemId}
            itemName={productData.itemName}
            itemCategory={productData.itemCategory}
            price={productData.price}
            currency={productData.currency}
            ariaLabel={`Buy SolarDev AI Volume 1 for €${productData.price}`}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Get Volume 1
          </TrackedCheckoutLink>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <TrackedCheckoutLink
            href={productData.checkoutUrl}
            buttonLocation="navbar-mobile"
            itemId={productData.itemId}
            itemName={productData.itemName}
            itemCategory={productData.itemCategory}
            price={productData.price}
            currency={productData.currency}
            ariaLabel={`Buy SolarDev AI Volume 1 for €${productData.price}`}
            className="hidden items-center justify-center whitespace-nowrap rounded-lg bg-amber-400 px-3 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:inline-flex"
          >
            Get Volume 1
          </TrackedCheckoutLink>

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
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition hover:border-amber-400/30 hover:bg-amber-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
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
        className={`overflow-hidden bg-slate-950 transition-all duration-300 lg:hidden ${
          isMenuOpen
            ? "max-h-[650px] border-t border-white/10 opacity-100"
            : "max-h-0 border-t border-transparent opacity-0"
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
                      Products
                    </p>
                    <Link
                      href="/solar-bess-project-development-handbook"
                      onClick={closeMenu}
                      className="flex min-h-12 items-center justify-between rounded-lg px-3 py-3 font-semibold text-white transition hover:bg-white/[0.05] focus:outline-none focus-visible:bg-white/[0.05]"
                    >
                      Professional Handbooks
                      <span
                        aria-hidden="true"
                        className="text-amber-400"
                      >
                        →
                      </span>
                    </Link>
                    <div
                      aria-disabled="true"
                      className="flex min-h-12 items-center justify-between gap-3 rounded-lg px-3 py-3 text-slate-400"
                    >
                      <span className="font-semibold">
                        Prompt Library
                      </span>
                      <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
                        Coming soon
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

          {/* CTA shown inside menu on very small screens */}
          <div className="mt-5 border-t border-white/10 pt-5 sm:hidden">
            <TrackedCheckoutLink
              href={productData.checkoutUrl}
              buttonLocation="mobile-menu"
              itemId={productData.itemId}
              itemName={productData.itemName}
              itemCategory={productData.itemCategory}
              price={productData.price}
              currency={productData.currency}
              ariaLabel={`Buy SolarDev AI Volume 1 for €${productData.price}`}
              className="inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-3.5 font-semibold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Get Volume 1
            </TrackedCheckoutLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
