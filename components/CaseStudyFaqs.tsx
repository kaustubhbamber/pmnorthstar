"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ } from "@/data/caseStudyFaqs";

interface CaseStudyFaqsProps {
  faqs: FAQ[];
}

export function CaseStudyFaqs({ faqs }: CaseStudyFaqsProps) {
  // Open the first FAQ by default — improves engagement + signals to
  // viewers the section is interactive.
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
        <span
          className="text-xs"
          style={{ color: "var(--text-faint)" }}
        >
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
              style={{ borderRadius: 10 }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full flex items-start gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 text-left"
                aria-expanded={isOpen}
              >
                <span
                  className="flex-1 text-sm sm:text-base font-medium leading-snug"
                  style={{
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  size={18}
                  strokeWidth={1.6}
                  style={{
                    color: "var(--text-muted)",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
              </button>

              {isOpen && (
                <div
                  className="px-4 sm:px-5 pb-4 sm:pb-5"
                  style={{
                    borderTop: "1.5px solid var(--card-border)",
                    paddingTop: "14px",
                  }}
                >
                  <p
                    className="text-sm sm:text-base leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
