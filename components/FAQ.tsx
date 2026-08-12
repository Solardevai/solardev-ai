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
      className="relative scroll-mt-24 overflow-hidden border-b border-[#10271f]/10 bg-[#edf0e9] py-20 text-[#10271f] sm:py-24"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-400/[0.05] blur-3xl" />

        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-emerald-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
            Frequently asked questions
          </p>

          <h2
            id={`${sectionId}-title`}
            className="mt-4 text-3xl font-bold tracking-tight text-[#10271f] sm:text-4xl"
          >
            Important information before purchasing
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#536860] sm:text-lg">
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
                className={`overflow-hidden rounded-2xl border bg-white/70 transition ${
                  isOpen
                    ? "border-emerald-600/25 bg-white"
                    : "border-[#10271f]/10 hover:border-[#10271f]/20"
                }`}
              >
                <h3>
                  <button
                    id={questionId}
                    type="button"
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400 sm:px-7 sm:py-6"
                  >
                    <span className="text-base font-semibold leading-7 text-[#10271f] sm:text-lg">
                      {item.question}
                    </span>

                    <span
                      aria-hidden="true"
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xl transition duration-200 ${
                        isOpen
                          ? "rotate-45 border-emerald-600/30 bg-emerald-100 text-emerald-800"
                          : "border-[#10271f]/10 bg-[#edf0e9] text-[#536860]"
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
                    <p className="px-6 pb-6 leading-7 text-[#29483c] sm:px-7 sm:pb-7">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Support note */}
        <p className="mt-8 text-center text-sm leading-6 text-[#536860]">
          Additional payment or access questions can
          be sent to{" "}
          <a
            href="mailto:support@solardev.ai"
            className="font-semibold text-emerald-400 transition hover:text-emerald-300"
          >
            support@solardev.ai
          </a>
          .
        </p>
      </div>
    </section>
  );
}
