import Image from "next/image";
import { navigationItems, siteConfig } from "@/data/siteData";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <a
          href="#home"
          aria-label="SolarDev AI homepage"
          className="flex items-center gap-3 transition hover:opacity-90"
        >
          <Image
            src="/logo-mark.svg"
            alt="SolarDev AI"
            width={44}
            height={44}
            priority
            className="rounded-xl"
          />

          <span className="text-2xl font-bold tracking-tight text-white">
            SolarDev <span className="text-amber-400">AI</span>
          </span>
        </a>

        {/* Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 text-sm lg:flex"
        >
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-medium text-slate-300 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href={siteConfig.checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-amber-400/20 transition hover:-translate-y-0.5 hover:bg-amber-300"
        >
          Get Volume 1
        </a>
      </div>
    </header>
  );
}