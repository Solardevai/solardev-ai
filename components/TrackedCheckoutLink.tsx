"use client";

import type { ReactNode } from "react";
import { trackBeginCheckout } from "@/lib/analytics";

type TrackedCheckoutLinkProps = {
  href: string;
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
  function handleClick() {
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