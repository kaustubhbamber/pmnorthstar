"use client";

import { ExternalLink, Star } from "lucide-react";

const floatingWords = [
  { label: "Product Strategy", top: "10%",  right: "22%", size: "15px", lightColor: "#dc2626", darkColor: "#f87171" },
  { label: "Roadmapping",      top: "30%",  right: "5%",  size: "13px", lightColor: "#4f46e5", darkColor: "#818cf8" },
  { label: "User Research",    top: "18%",  right: "38%", size: "14px", lightColor: "#d97706", darkColor: "#fbbf24" },
  { label: "Prioritization",   top: "50%",  right: "16%", size: "16px", lightColor: "#059669", darkColor: "#34d399" },
  { label: "OKRs",             top: "58%",  right: "38%", size: "22px", lightColor: "#2563eb", darkColor: "#60a5fa" },
  { label: "Agile",            top: "70%",  right: "24%", size: "18px", lightColor: "#dc2626", darkColor: "#f87171" },
  { label: "Stakeholder Mgmt", top: "40%",  right: "44%", size: "13px", lightColor: "#7c3aed", darkColor: "#c084fc" },
  { label: "Go-to-Market",     top: "75%",  right: "7%",  size: "14px", lightColor: "#d97706", darkColor: "#fbbf24" },
  { label: "Discovery",        top: "12%",  right: "52%", size: "13px", lightColor: "#059669", darkColor: "#34d399" },
  { label: "Metrics & KPIs",   top: "62%",  right: "50%", size: "15px", lightColor: "#4f46e5", darkColor: "#818cf8" },
];

interface HeroBannerProps {
  onNavChange: (nav: string) => void;
}

export function HeroBanner({ onNavChange }: HeroBannerProps) {
  return (
    <div
      className="relative mx-4 sm:mx-6 mt-4 sm:mt-6 rounded-2xl overflow-hidden"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        minHeight: "200px",
      }}
    >
      <style>{`
        .float-word { opacity: 0.35; }
        .dark .float-word { opacity: 0.6; }
        @media (prefers-color-scheme: dark) {
          .float-word { opacity: 0.6; }
        }
        ${floatingWords.map(({ label, lightColor, darkColor }) => {
          const cls = `fw-${label.replace(/[^a-z]/gi, "").toLowerCase()}`;
          return `
            .${cls} { color: ${lightColor}; }
            .dark .${cls} { color: ${darkColor}; }
            @media (prefers-color-scheme: dark) { .${cls} { color: ${darkColor}; } }
          `;
        }).join("")}
      `}</style>

      {/* Floating words — hidden on mobile */}
      {floatingWords.map(({ label, top, right, size }) => {
        const cls = `fw-${label.replace(/[^a-z]/gi, "").toLowerCase()}`;
        return (
          <span
            key={label}
            className={`float-word ${cls} absolute pointer-events-none select-none font-semibold tracking-tight hidden md:block`}
            style={{
              top,
              right,
              fontSize: size,
              whiteSpace: "nowrap",
              letterSpacing: "-0.02em",
            }}
          >
            {label}
          </span>
        );
      })}

      {/* Content */}
      <div className="relative z-10 p-5 sm:p-8 max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #e02020, #8B0000)" }}
          >
            <Star size={18} className="text-white fill-white" />
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="font-bold text-2xl tracking-tight" style={{ color: "var(--text-primary)" }}>
              North
            </span>
            <span className="font-bold text-2xl tracking-tight" style={{ color: "#e02020" }}>
              Star
            </span>
          </div>
        </div>

        <h1
          className="text-xl sm:text-2xl font-bold leading-tight mb-2"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
        >
          Your product management library
        </h1>

        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          Books, case studies, frameworks, and more — curated for anyone
          learning product management, from first-timers to seasoned builders.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "#e02020" }}
          >
            <ExternalLink size={14} />
            Explore Resources
          </button>
          <button
            onClick={() => onNavChange("casestudies")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              background: "transparent",
              border: "1px solid var(--card-border)",
              color: "var(--text-muted)",
            }}
          >
            View Case Studies
          </button>
        </div>
      </div>
    </div>
  );
}