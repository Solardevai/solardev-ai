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

export default function RenewableNewsTicker({
  headlines,
}: RenewableNewsTickerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (headlines.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % headlines.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [headlines.length]);

  const repeatedHeadlines = [...headlines, ...headlines];
  const activeHeadline = headlines[activeIndex];

  return (
    <aside
      aria-label="Renewable energy industry headlines"
      className="border-b border-amber-400/20 bg-amber-400 text-slate-950"
    >
      <div className="flex h-8 items-center overflow-hidden">
        <div className="flex h-full shrink-0 items-center border-r border-slate-950/20 bg-slate-950 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300 sm:px-4">
          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
          Renewables Live
        </div>

        <div className="hidden min-w-0 flex-1 overflow-hidden md:block">
          <div className="renewables-ticker-track flex w-max items-center whitespace-nowrap">
            {repeatedHeadlines.map((headline, index) => (
              <a
                key={`${headline.href}-${index}`}
                href={headline.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-8 items-center text-[11px] font-semibold"
                aria-label={`${headline.category}: ${headline.title}, ${headline.source}`}
              >
                <span className="mx-3 font-black uppercase tracking-[0.12em] text-slate-900">
                  {headline.category}
                </span>
                <span className="max-w-[32rem] overflow-hidden text-ellipsis text-slate-950 group-hover:underline">
                  {headline.title}
                </span>
                <span className="mx-2 font-normal text-slate-700">
                  {headline.source}
                  {formatDate(headline.publishedAt)
                    ? ` · ${formatDate(headline.publishedAt)}`
                    : ""}
                </span>
                <span aria-hidden="true" className="mx-4 text-slate-700">
                  •
                </span>
              </a>
            ))}
          </div>
        </div>

        <a
          href={activeHeadline.href}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 flex-1 px-3 text-[11px] font-semibold md:hidden"
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
