"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { BookFAQ } from "@/data/bookFaqs";

interface BookFaqsProps {
  faqs: BookFAQ[];
}

export function BookFaqs({ faqs }: BookFaqsProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section
      className="py-8 sm:py-10"
      style={{ borderTop: "1.5px solid var(--card-border)" }}
    >
      <div className="flex items-baseline gap-3 mb-5 sm:mb-6">
        <h2
          className="text-xl sm:text-2xl font-semibold"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
        >
          Frequently asked
        </h2>
        <span className="text-xs" style={{ color: "var(--text-faint)" }}>
          {faqs.length} questions
        </span>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="surface overflow-hidden"
              style={{ borderRadius: 12 }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left transition-colors"
                style={{
                  color: "var(--text-primary)",
                  background: isOpen ? "var(--tag-bg)" : "transparent",
                }}
              >
                <span
                  className="text-sm sm:text-base font-semibold leading-snug"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  size={16}
                  strokeWidth={1.8}
                  className="flex-shrink-0 mt-0.5 transition-transform"
                  style={{
                    color: "var(--text-muted)",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
              {isOpen && (
                <div
                  className="px-5 pb-5 pt-1 text-sm sm:text-[15px] leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
