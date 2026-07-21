"use client";

import { useId, useState } from "react";
import { faqItems } from "@/data/siteData";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionId = useId();

  function toggleItem(index: number) {
    setOpenIndex((currentIndex) =>
      currentIndex === index ? null : index,
    );
  }

  return (
    <section
      id="faq"
      aria-labelledby={`${sectionId}-title`}
      className="relative scroll-mt-24 overflow-hidden border-b border-white/10 bg-slate-950 py-20 sm:py-24"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">
            Frequently asked questions
          </p>

          <h2
            id={`${sectionId}-title`}
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Important information before purchasing
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Information about professional use, AI
            responsibility, licensing, updates and
            customer support.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="mt-12 space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const questionId =
              `${sectionId}-question-${index}`;
            const answerId =
              `${sectionId}-answer-${index}`;

            return (
              <article
                key={item.question}
                className={`overflow-hidden rounded-2xl border bg-white/[0.025] transition ${
                  isOpen
                    ? "border-amber-400/25 bg-white/[0.04]"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <h3>
                  <button
                    id={questionId}
                    type="button"
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400 sm:px-7 sm:py-6"
                  >
                    <span className="text-base font-semibold leading-7 text-white sm:text-lg">
                      {item.question}
                    </span>

                    <span
                      aria-hidden="true"
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xl transition duration-200 ${
                        isOpen
                          ? "rotate-45 border-amber-400/30 bg-amber-400/10 text-amber-300"
                          : "border-white/10 bg-white/[0.03] text-slate-400"
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>

                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 leading-7 text-slate-300 sm:px-7 sm:pb-7">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Support note */}
        <p className="mt-8 text-center text-sm leading-6 text-slate-500">
          Additional payment or access questions can
          be sent to{" "}
          <a
            href="mailto:support@solardev.ai"
            className="font-semibold text-amber-400 transition hover:text-amber-300"
          >
            support@solardev.ai
          </a>
          .
        </p>
      </div>
    </section>
  );
}