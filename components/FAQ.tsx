"use client";

import { useState } from "react";
import { faqItems } from "@/data/siteData";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative scroll-mt-24 overflow-hidden border-b border-white/10 bg-slate-950"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
            Frequently asked questions
          </p>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Important information before purchasing
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Learn more about professional use, delivery, licensing, updates and
            the role of AI within the SolarDev AI methodology.
          </p>
        </div>

        <div className="mt-14 space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article
                key={item.question}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition hover:border-amber-400/20"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left sm:px-8"
                >
                  <span className="text-lg font-semibold text-white">
                    {item.question}
                  </span>

                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xl transition ${
                      isOpen
                        ? "rotate-45 border-amber-400/30 bg-amber-400/10 text-amber-300"
                        : "border-white/10 bg-white/[0.03] text-slate-400"
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-7 leading-7 text-slate-300 sm:px-8">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}