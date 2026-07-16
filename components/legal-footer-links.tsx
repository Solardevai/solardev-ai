import Link from "next/link";

/**
 * Add this component to the Legal column of the existing site footer.
 */
export function LegalFooterLinks() {
  return (
    <ul className="space-y-3 text-sm text-slate-400">
      <li>
        <Link href="/privacy" className="transition hover:text-white">
          Privacy Policy
        </Link>
      </li>
      <li>
        <Link href="/terms" className="transition hover:text-white">
          Terms of Sale
        </Link>
      </li>
      <li>
        <Link href="/refund-policy" className="transition hover:text-white">
          Refund Policy
        </Link>
      </li>
    </ul>
  );
}
