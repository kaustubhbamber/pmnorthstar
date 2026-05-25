"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { aiDecodedManifest } from "@/data/aiDecodedManifest";

interface HeroBannerProps {
  onNavChange: (nav: string) => void;
}

// Split hero: library positioning on the left, two stacked sidebar
// items on the right (CheckIt + the latest AI Decoded read).
//
// Design intent — humanized, not template-card-grid. The right column
// is asymmetric: CheckIt is a heavier "tool" panel with a real score
// widget inside it (shows what the tool does, not just describes it),
// and AI Decoded is a quieter "magazine sidebar" item with a real
// date and the actual latest title, not a generic NEW badge.

// Latest article surfaces in the AI Decoded card. The manifest is
// already pre-sorted newest-first by sync-content.ts.
const latestAI = aiDecodedManifest[0];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function HeroBanner({ onNavChange }: HeroBannerProps) {
  return (
    <section
      className="mx-4 sm:mx-6 mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 lg:gap-8"
    >
      {/* ── Left: library positioning ─────────────────────────────────── */}
      <div
        className="rounded-2xl px-5 sm:px-10 py-8 sm:py-12"
        style={{
          background: "var(--card-bg)",
          border: "1.5px solid var(--card-border)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-5">
          <span
            className="w-5 h-px"
            style={{ background: "var(--brand-primary)" }}
          />
          <span
            className="text-[10px] font-mono uppercase"
            style={{
              color: "var(--brand-primary)",
              letterSpacing: "0.16em",
            }}
          >
            pm library · 2026
          </span>
        </div>

        <h1
          className="font-display font-bold leading-[1.02] mb-4"
          style={{
            color: "var(--text-primary)",
            letterSpacing: "-0.035em",
            fontSize: "clamp(30px, 4.5vw, 48px)",
          }}
        >
          A product management library{" "}
          <br className="hidden sm:block" />
          worth your weekend.
        </h1>

        <p
          className="text-sm sm:text-base leading-relaxed mb-6 max-w-md"
          style={{ color: "var(--text-muted)" }}
        >
          65 case studies, 30 book reviews, 18 playlists. Hand-picked by
          someone who actually read them. Free, no paywall, no email
          gate.
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavChange("casestudies")}
            className="btn-primary group"
          >
            Browse case studies
            <ArrowUpRight
              size={14}
              strokeWidth={1.8}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
          <button
            onClick={() => onNavChange("learn")}
            className="btn-ghost"
          >
            Or watch instead
          </button>
        </div>
      </div>

      {/* ── Right: two stacked sidebar banners. Solid blue (CheckIt)
          and green (AI Decoded) at the user's request. White type on
          color so the cards anchor the page without competing with
          the brand red of the rest of the site. ─────────────────── */}
      <div className="flex flex-col gap-4 sm:gap-5">
        {/* CheckIt — solid blue, white type, score-ring visual hook */}
        <Link
          href="/checkit"
          className="group rounded-2xl px-5 py-5 sm:py-6 transition-all flex items-center gap-4 hover:opacity-95"
          style={{
            background: "#2563EB",
            border: "1.5px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <MiniRing score={92} onColor />

          <div className="flex-1 min-w-0">
            <p
              className="text-[10px] font-mono uppercase mb-1"
              style={{
                color: "rgba(255, 255, 255, 0.75)",
                letterSpacing: "0.14em",
              }}
            >
              Tool
            </p>
            <h2
              className="font-display text-lg font-bold leading-tight mb-1"
              style={{
                color: "#ffffff",
                letterSpacing: "-0.02em",
              }}
            >
              How ready is your site?
            </h2>
            <p
              className="text-xs leading-snug mb-2.5"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              20 checks. 30 seconds. Free.
            </p>
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold transition-transform group-hover:translate-x-0.5"
              style={{ color: "#ffffff" }}
            >
              Run a check
              <ArrowUpRight size={12} strokeWidth={2} />
            </span>
          </div>
        </Link>

        {/* AI Decoded — solid green, white type, real date + title */}
        <Link
          href={latestAI ? `/ai-decoded/${latestAI.slug}` : "/ai-decoded"}
          className="group rounded-2xl px-5 py-5 transition-all hover:opacity-95"
          style={{
            background: "#0F9D58",
            border: "1.5px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <p
              className="text-[10px] font-mono uppercase"
              style={{
                color: "rgba(255, 255, 255, 0.85)",
                letterSpacing: "0.14em",
              }}
            >
              AI Decoded
            </p>
            {latestAI && (
              <>
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: "rgba(255, 255, 255, 0.6)" }}
                />
                <p
                  className="text-[10px] font-mono"
                  style={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  {formatDate(latestAI.publishedAt)}
                </p>
              </>
            )}
          </div>
          <h3
            className="font-display text-base leading-snug font-semibold mb-2 line-clamp-2"
            style={{
              color: "#ffffff",
              letterSpacing: "-0.015em",
            }}
          >
            {latestAI?.title ?? "Editorial commentary on AI for PMs"}
          </h3>
          <span
            className="inline-flex items-center gap-1 text-xs font-semibold transition-transform group-hover:translate-x-0.5"
            style={{ color: "#ffffff" }}
          >
            Read this week&apos;s take
            <ArrowUpRight size={12} strokeWidth={2} />
          </span>
        </Link>
      </div>
    </section>
  );
}

// Static-score mini ring. Uses 92 as a "looks good" example, not a real
// number, purely visual. The same ring idiom is used on /checkit.
// `onColor` flips to white-on-translucent for use against solid colored
// backgrounds (the CheckIt banner).
function MiniRing({ score, onColor = false }: { score: number; onColor?: boolean }) {
  const SIZE = 64;
  const STROKE = 5;
  const radius = (SIZE - STROKE) / 2;
  const circ = 2 * Math.PI * radius;
  const progress = (Math.max(0, Math.min(100, score)) / 100) * circ;
  const trackColor = onColor ? "rgba(255, 255, 255, 0.25)" : "var(--divider)";
  const fillColor = onColor ? "#ffffff" : "var(--brand-primary)";
  const textColor = onColor ? "#ffffff" : "var(--text-primary)";
  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: SIZE, height: SIZE }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={STROKE}
          fill="none"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={radius}
          stroke={fillColor}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={circ - progress}
          strokeLinecap="round"
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-display font-bold"
        style={{ color: textColor, fontSize: 18 }}
      >
        {score}
      </div>
    </div>
  );
}
