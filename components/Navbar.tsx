import Image from "next/image";
import { navigationItems, siteConfig } from "@/data/siteData";

export default function Navbar() {
  return (
  <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
  <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 py-4">
    <a
      href="#home"
      aria-label="SolarDev AI homepage"
      className="flex items-center gap-3 justify-self-start"
    >
      {/* Logo content */}
    </a>

    <nav
      aria-label="Primary navigation"
      className="hidden items-center gap-8 justify-self-center lg:flex"
    >
      {/* Navigation links */}
    </nav>

    <div aria-hidden="true" className="justify-self-end" />
  </div>
</header>
  );
}