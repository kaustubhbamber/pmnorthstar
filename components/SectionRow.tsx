"use client";

import { ReactNode, useRef, Children } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SectionRowProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  accentColor?: string;
}

export function SectionRow({ title, subtitle, children, accentColor }: SectionRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const distance = Math.min(scrollRef.current.clientWidth * 0.7, 500);
    scrollRef.current.scrollBy({
      left: dir === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  const count = Children.count(children);

  // Title becomes a solid-colored "section chip" so each row reads
  // as its own labeled segment, magazine-style. accentColor sets the
  // chip background; falls back to brand red.
  const chipColor = accentColor || "var(--brand-primary)";

  return (
    <section className="animate-section">
      <div className="flex items-end justify-between mb-4 px-4 sm:px-6 gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span
              className="inline-block text-[10px] sm:text-xs font-bold uppercase px-2.5 py-1 rounded-md"
              style={{
                background: chipColor,
                color: "#ffffff",
                letterSpacing: "0.12em",
              }}
            >
              {title}
            </span>
            <span
              className="font-mono text-[11px]"
              style={{ color: "var(--text-faint)" }}
            >
              {count} {count === 1 ? "item" : "items"}
            </span>
          </div>
          {subtitle && (
            <p
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "transparent",
              border: "1px solid var(--card-border)",
              color: "var(--text-muted)",
            }}
          >
            <ChevronLeft size={14} strokeWidth={1.6} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "transparent",
              border: "1px solid var(--card-border)",
              color: "var(--text-muted)",
            }}
          >
            <ChevronRight size={14} strokeWidth={1.6} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scroll-container px-4 sm:px-6 pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {children}
      </div>
    </section>
  );
}
