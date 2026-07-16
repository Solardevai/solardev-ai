import Image from "next/image";
import { navigationItems } from "@/data/siteData";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6">
        {/* Logo */}
        <a
          href="#home"
          aria-label="SolarDev AI homepage"
          className="flex items-center gap-3 justify-self-start whitespace-nowrap transition hover:opacity-90"
        >
          <Image
            src="/logo-mark.svg"
            alt=""
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
          className="hidden items-center gap-8 justify-self-center text-sm lg:flex"
        >
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-medium text-slate-300 transition hover:text-white focus:outline-none focus-visible:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Empty column keeps navigation centred */}
        <div aria-hidden="true" className="justify-self-end" />
      </div>
    </header>
  );
}