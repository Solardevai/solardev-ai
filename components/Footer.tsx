import { siteConfig } from "@/data/siteData";

const productLinks = [
  {
    label: "Volume 1",
    href: "#volume-1",
  },
  {
    label: "Preview",
    href: "#preview",
  },
  {
    label: "Roadmap",
    href: "#roadmap",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
];

const companyLinks = [
  {
    label: "Professionals",
    href: "#audience",
  },
  {
    label: "FAQ",
    href: "#faq",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

const legalLinks = [
  {
    label: "Privacy Policy",
    href: "/privacy",
  },
  {
    label: "Terms of Sale",
    href: "/terms",
  },
  {
    label: "Refund Policy",
    href: "/refund-policy",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          {/* Brand */}
          <div>
            <a
              href="#home"
              aria-label="SolarDev AI homepage"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10">
                <span className="h-4 w-4 rounded-full bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.7)]" />
              </span>

              <span className="text-xl font-bold tracking-tight text-white">
                SolarDev <span className="text-amber-400">AI</span>
              </span>
            </a>

            <p className="mt-6 max-w-md leading-7 text-slate-400">
              Professional AI methodologies, engineering workflows and
              consultant-grade prompts for utility-scale Solar PV and BESS
              project development.
            </p>

            <div className="mt-7 space-y-3 text-sm">
              <p>
                <span className="text-slate-500">General enquiries: </span>

                <a
                  href={`mailto:${siteConfig.infoEmail}`}
                  className="font-semibold text-slate-300 transition hover:text-amber-400"
                >
                  {siteConfig.infoEmail}
                </a>
              </p>

              <p>
                <span className="text-slate-500">Customer support: </span>

                <a
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="font-semibold text-slate-300 transition hover:text-amber-400"
                >
                  {siteConfig.supportEmail}
                </a>
              </p>
            </div>
          </div>

          {/* Products */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Products
            </p>

            <ul className="mt-6 space-y-4">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-amber-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Company
            </p>

            <ul className="mt-6 space-y-4">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-amber-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Legal
            </p>

            <ul className="mt-6 space-y-4">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-amber-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {currentYear} SolarDev AI. All rights reserved.
            </p>

            <p>
              AI supports engineering judgement. Professional responsibility
              remains with the user.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}