"use client";

import type { ReactNode } from "react";
import { trackBeginCheckout } from "@/lib/analytics";

type TrackedCheckoutLinkProps = {
  href: string | null;
  buttonLocation: string;
  itemId: string;
  itemName: string;
  itemCategory: string;
  price: number;
  currency: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
};

export default function TrackedCheckoutLink({
  href,
  buttonLocation,
  itemId,
  itemName,
  itemCategory,
  price,
  currency,
  className,
  ariaLabel,
  children,
}: TrackedCheckoutLinkProps) {
  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={`${className ?? ""} cursor-not-allowed opacity-60 grayscale`}
        title="Handbook checkout is temporarily unavailable"
      >
        Checkout temporarily unavailable
      </span>
    );
  }

  function handleClick(): void {
    trackBeginCheckout({
      buttonLocation,
      itemId,
      itemName,
      itemCategory,
      price,
      currency,
    });
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
