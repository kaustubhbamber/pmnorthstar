"use client";

import { ArrowUpRight } from "lucide-react";

interface HeroBannerProps {
  onNavChange: (nav: string) => void;
}

export function HeroBanner({ onNavChange }: HeroBannerProps) {
  return (
    <div
      className="dot-grid relative mx-4 sm:mx-6 mt-4 sm:mt-6 rounded-2xl overflow-hidden"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      <div className="relative z-10 px-5 sm:px-10 py-10 sm:py-14 max-w-2xl">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="eyebrow">// pm.library</span>
          <span className="w-px h-3" style={{ background: "var(--card-border)" }} />
          <span className="eyebrow">curated · 2026</span>
        </div>

        <h1
          className="text-2xl sm:text-4xl font-bold leading-[1.1] mb-4"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
        >
          Your product management library,
          <br className="hidden sm:block" />
          <span style={{ color: "var(--text-muted)" }}>built for builders.</span>
        </h1>

        <p
          className="text-sm sm:text-base leading-relaxed mb-7 max-w-md"
          style={{ color: "var(--text-muted)" }}
        >
          Books, case studies, frameworks, and playlists — curated for first-timers and seasoned PMs.
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavChange("casestudies")}
            className="btn-primary group"
          >
            Browse case studies
            <ArrowUpRight size={14} strokeWidth={1.8} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <button onClick={() => onNavChange("learn")} className="btn-ghost">
            Learn
          </button>
        </div>
      </div>
    </div>
  );
}
