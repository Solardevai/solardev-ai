import { navigationItems, siteConfig } from "@/data/siteData";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="#home"
          aria-label="SolarDev AI homepage"
          className="flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10">
            <span className="h-4 w-4 rounded-full bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.7)]" />
          </span>

          <span className="text-xl font-bold tracking-tight text-white">
            SolarDev <span className="text-amber-400">AI</span>
          </span>
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-7 text-sm text-slate-300 lg:flex"
        >
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-md px-1 py-2 transition hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={siteConfig.checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Get Volume 1
        </a>
      </div>
    </header>
  );
}