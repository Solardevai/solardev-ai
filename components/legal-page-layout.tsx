import Link from "next/link";
import type { ReactNode } from "react";
import { legalConfig } from "../lib/legal-config";

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  introduction: string;
  children: ReactNode;
};

type LegalSectionProps = {
  title: string;
  children: ReactNode;
};

export function LegalPageLayout({
  eyebrow,
  title,
  introduction,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-300 transition hover:text-amber-200"
          >
            <span aria-hidden="true">←</span>
            Back to SolarDev AI
          </Link>
        </div>
      </section>

      <section className="border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
            {eyebrow}
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            {introduction}
          </p>
          <p className="mt-6 text-sm text-slate-400">
            Last updated: {legalConfig.lastUpdated}
          </p>
        </div>
      </section>

      <section className="bg-slate-950">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_260px] lg:px-8 lg:py-20">
          <article className="space-y-10">{children}</article>

          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-24">
            <p className="text-sm font-semibold text-white">Legal contact</p>
            <dl className="mt-5 space-y-4 text-sm text-slate-300">
              <div>
                <dt className="text-slate-500">Operator</dt>
                <dd className="mt-1">{legalConfig.operatorName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Trading name</dt>
                <dd className="mt-1">{legalConfig.tradingName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">General enquiries</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${legalConfig.generalEmail}`}
                    className="text-amber-300 hover:text-amber-200"
                  >
                    {legalConfig.generalEmail}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Customer support</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${legalConfig.supportEmail}`}
                    className="text-amber-300 hover:text-amber-200"
                  >
                    {legalConfig.supportEmail}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-slate-500">
              Replace every bracketed placeholder before publishing these pages.
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-7 text-slate-300">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ children }: { children: ReactNode }) {
  return (
    <ul className="ml-5 list-disc space-y-2 marker:text-amber-300">{children}</ul>
  );
}

export function LegalOrderedList({ children }: { children: ReactNode }) {
  return (
    <ol className="ml-5 list-decimal space-y-2 marker:font-semibold marker:text-amber-300">
      {children}
    </ol>
  );
}

export function LegalCallout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-5 text-sm leading-6 text-slate-200">
      {children}
    </div>
  );
}
