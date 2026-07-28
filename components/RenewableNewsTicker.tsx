"use client";

import { useEffect, useState } from "react";
import type { RenewableNewsItem } from "@/lib/renewableNews";

type RenewableNewsTickerProps = {
  headlines: RenewableNewsItem[];
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function TickerHeadlineContent({ headline }: { headline: RenewableNewsItem }) {
  const publishedDate = formatDate(headline.publishedAt);
  return (
    <>
      <span className="mx-3 font-black uppercase tracking-[0.12em] text-slate-900">
        {headline.category}
      </span>
      <span className="max-w-[32rem] overflow-hidden text-ellipsis text-slate-950 group-hover:underline">
        {headline.title}
      </span>
      <span className="mx-2 font-normal text-slate-700">
        {headline.source}
        {publishedDate ? ` · ${publishedDate}` : ""}
      </span>
      <span aria-hidden="true" className="mx-4 text-slate-700">
        •
      </span>
    </>
  );
}

export default function RenewableNewsTicker({
  headlines,
}: RenewableNewsTickerProps) {
  const visibleHeadlines = headlines.slice(0, 8);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (visibleHeadlines.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visibleHeadlines.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [visibleHeadlines.length]);

  const repeatedHeadlines = [...visibleHeadlines, ...visibleHeadlines];
  const activeHeadline = visibleHeadlines[activeIndex];

  return (
    <aside
      aria-label="Renewable energy industry headlines, updated hourly"
      className="relative overflow-hidden border-b border-white/80 bg-gradient-to-r from-slate-200 via-white to-slate-200 text-slate-950 shadow-[0_0_24px_rgba(255,255,255,0.14)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_15%,rgba(255,255,255,0.8)_45%,transparent_70%)] opacity-60"
      />
      <div className="flex h-8 items-center overflow-hidden">
        <div className="relative z-10 flex h-full shrink-0 items-center border-r border-white/15 bg-slate-900 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-[8px_0_18px_rgba(2,6,23,0.2)] sm:px-4">
          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
          Industry Updates · Hourly
        </div>

        <div className="relative z-10 hidden min-w-0 flex-1 overflow-hidden md:block">
          <div className="renewables-ticker-track flex w-max items-center whitespace-nowrap">
            {repeatedHeadlines.map((headline, index) =>
              index < visibleHeadlines.length ? (
                <a
                  key={`${headline.href}-${index}`}
                  href={headline.href}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="group flex h-8 items-center text-[11px] font-semibold"
                  aria-label={`${headline.category}: ${headline.title}, ${headline.source}`}
                >
                  <TickerHeadlineContent headline={headline} />
                </a>
              ) : (
                <span
                  key={`${headline.href}-${index}`}
                  aria-hidden="true"
                  className="group flex h-8 items-center text-[11px] font-semibold"
                >
                  <TickerHeadlineContent headline={headline} />
                </span>
              ),
            )}
          </div>
        </div>

        <a
          href={activeHeadline.href}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="relative z-10 min-w-0 flex-1 px-3 text-[11px] font-bold md:hidden"
        >
          <span className="mr-2 font-black uppercase">
            {activeHeadline.category}
          </span>
          <span className="inline-block max-w-[62vw] overflow-hidden text-ellipsis whitespace-nowrap align-bottom">
            {activeHeadline.title}
          </span>
        </a>
      </div>
    </aside>
  );
}
