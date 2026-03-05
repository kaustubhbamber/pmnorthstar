"use client";

import { ReactNode, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SectionRowProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  accentColor?: string;
}

export function SectionRow({ title, subtitle, children, accentColor = "var(--north-accent)" }: SectionRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section className="animate-section">
      <div className="flex items-center justify-between mb-4 px-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 rounded-full" style={{ background: accentColor }} />
            <h2 className="font-display text-lg font-semibold" style={{ color: "var(--north-text)" }}>
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs mt-0.5 ml-3" style={{ color: "var(--north-muted)" }}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-lg transition-all"
            style={{
              background: "var(--north-card)",
              border: "1px solid var(--north-border)",
              color: "var(--north-muted)",
            }}
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-lg transition-all"
            style={{
              background: "var(--north-card)",
              border: "1px solid var(--north-border)",
              color: "var(--north-muted)",
            }}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-container px-6 pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {children}
      </div>
    </section>
  );
}
