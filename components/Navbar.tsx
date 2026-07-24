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
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={resolveNavigationHref(item.href)}
              className="font-medium text-slate-300 transition hover:text-white focus:outline-none focus-visible:text-white"
            >
              {item.label}
            </a>
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
            {navigationItems.map((item) => (
              <li key={item.label}>
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
