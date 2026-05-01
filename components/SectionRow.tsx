"use client";

import { ReactNode, useRef, Children } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SectionRowProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  accentColor?: string;
}

export function SectionRow({ title, subtitle, children }: SectionRowProps) {
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

  return (
    <section className="animate-section">
      <div className="flex items-end justify-between mb-4 px-4 sm:px-6">
        <div>
          <p className="eyebrow mb-1.5">// {title.toLowerCase().replace(/\s+/g, ".")}</p>
          <div className="flex items-baseline gap-3">
            <h2
              className="text-base sm:text-lg font-semibold"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
            >
              {title}
            </h2>
            <span
              className="font-mono"
              style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.06em" }}
            >
              [{String(count).padStart(2, "0")}]
            </span>
          </div>
          {subtitle && (
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex gap-1.5">
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
