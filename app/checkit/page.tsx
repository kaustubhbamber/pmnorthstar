"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  Check,
  X,
  ChevronDown,
  Share2,
} from "lucide-react";
import { SidebarShell } from "@/components/SidebarShell";
import { DIMENSIONS } from "@/lib/checkit/dimensions";
import { BAND_COPY } from "@/lib/checkit/types";
import type { AuditResult, DimensionResult, Band } from "@/lib/checkit/types";
import { track } from "@/lib/track";

type ViewState =
  | { kind: "idle" }
  | { kind: "loading"; url: string }
  | { kind: "error"; message: string }
  | { kind: "ready"; result: AuditResult };

// Color per band, matches the visual hierarchy of the score ring.
const BAND_COLOR: Record<Band, string> = {
  ready: "#22C55E",
  almost: "#22C55E",
  polish: "#F59E0B",
  vibe: "var(--brand-primary)",
};

// Per-dimension accent, color-codes the left border of each result
// card so users can scan their scorecard at a glance.
const DIMENSION_ACCENT: Record<string, string> = {
  brand: "#9B8FFF",
  performance: "#FF6B35",
  seo: "#26A69A",
  ux: "#F5C842",
  trust: "#F3123C",
};

// Curated example sites users can click to try the tool without typing.
const EXAMPLE_URLS = ["stripe.com", "linear.app", "vercel.com"];

function safeHost(url: string): string {
  try {
    return new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).host;
  } catch {
    return url;
  }
}

export default function CheckItPage() {
  const [input, setInput] = useState("");
  const [view, setView] = useState<ViewState>({ kind: "idle" });

  const runAudit = useCallback(async (url: string) => {
    setView({ kind: "loading", url });
    // Reflect in address bar so the result is shareable.
    const params = new URLSearchParams({ url });
    window.history.replaceState(null, "", `/checkit?${params}`);

    const host = safeHost(url);
    track({ name: "checkit_audit_started", host });

    try {
      const res = await fetch(`/api/checkit/audit?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        setView({ kind: "error", message: data.error || "Audit failed." });
        return;
      }
      const result: AuditResult = data.result;
      if (result.fatalError) {
        setView({ kind: "error", message: result.fatalError });
        return;
      }
      setView({ kind: "ready", result });
      track({
        name: "checkit_audit_completed",
        host,
        score: result.totalScore,
        band: result.band,
      });
    } catch {
      setView({ kind: "error", message: "Network error. Try again." });
    }
  }, []);

  // Read ?url= from the address bar on mount and auto-run. Pure client
  // read (window.location), avoids the useSearchParams Suspense
  // requirement in Next 14.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialUrl = params.get("url");
    if (initialUrl) {
      setInput(initialUrl);
      runAudit(initialUrl);
    }
  }, [runAudit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    runAudit(trimmed);
  };

  const handleReset = () => {
    setView({ kind: "idle" });
    setInput("");
    window.history.replaceState(null, "", "/checkit");
  };

  return (
    <SidebarShell
      activeNav=""
      backHref="/"
      backLabelDesktop="Back to library"
      backLabelMobile="Back"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Hero
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isLoading={view.kind === "loading"}
          onPickExample={(url) => {
            setInput(url);
            runAudit(url);
          }}
        />

        {view.kind === "loading" && <LoadingState url={view.url} />}
        {view.kind === "error" && (
          <ErrorState message={view.message} onReset={handleReset} />
        )}
        {view.kind === "ready" && <ResultView result={view.result} />}
        {view.kind === "idle" && <IdleProof />}
      </div>
    </SidebarShell>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────

function Hero({
  input,
  setInput,
  onSubmit,
  isLoading,
  onPickExample,
}: {
  input: string;
  setInput: (s: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onPickExample: (url: string) => void;
}) {
  return (
    <div className="text-center mb-10 sm:mb-12">
      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5"
        style={{
          background: "var(--brand-soft)",
          border: "1px solid rgba(243, 18, 60, 0.2)",
        }}
      >
        <Sparkles size={12} style={{ color: "var(--brand-primary)" }} />
        <span
          className="text-xs font-medium"
          style={{ color: "var(--brand-primary)", letterSpacing: "0.02em" }}
        >
          CheckIt, by northstar
        </span>
      </div>

      <h1
        className="font-display text-3xl sm:text-5xl font-bold mb-4"
        style={{
          color: "var(--text-primary)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
        }}
      >
        Is your vibe-coded site
        <br />
        <span style={{ color: "var(--brand-primary)" }}>
          ready for the business world?
        </span>
      </h1>

      <p
        className="text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        We check 20 things across brand, performance, SEO, UX, and trust, the
        basics that decide whether users treat you as a product or a project.
      </p>

      <form onSubmit={onSubmit} className="max-w-2xl mx-auto">
        <div
          className="flex flex-col sm:flex-row sm:rounded-xl gap-2 sm:gap-0 sm:overflow-hidden"
          style={{
            background: "var(--card-bg)",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="yourproduct.com"
            disabled={isLoading}
            autoFocus
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            className="flex-1 px-4 py-3.5 text-base bg-transparent outline-none rounded-xl sm:rounded-none"
            style={{
              color: "var(--text-primary)",
              border: "1px solid var(--card-border)",
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3.5 inline-flex items-center justify-center gap-2 font-semibold text-sm transition-opacity disabled:opacity-50 rounded-xl sm:rounded-none"
            style={{
              background: "var(--brand-primary)",
              color: "#ffffff",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Checking
              </>
            ) : (
              <>
                Check it <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-4">
          <span
            className="text-xs"
            style={{ color: "var(--text-faint)" }}
          >
            Try:
          </span>
          {EXAMPLE_URLS.map((url, i) => (
            <span key={url} className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => onPickExample(url)}
                disabled={isLoading}
                className="text-xs font-mono transition-opacity hover:opacity-80 disabled:opacity-40"
                style={{ color: "var(--brand-primary)" }}
              >
                {url}
              </button>
              {i < EXAMPLE_URLS.length - 1 && (
                <span
                  className="text-xs"
                  style={{ color: "var(--text-faint)" }}
                >
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: "var(--text-faint)" }}>
          Free. No signup. The result URL is shareable.
        </p>
      </form>
    </div>
  );
}

// ── Idle proof strip ───────────────────────────────────────────────────

function IdleProof() {
  const items = [
    { num: "20", label: "checks across 5 dimensions" },
    { num: "<30s", label: "to a full audit" },
    { num: "0", label: "signups, paywalls, accounts" },
  ];
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
      {items.map((p, i) => (
        <div
          key={i}
          className="text-center px-4 py-5 rounded-xl"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
        >
          <p
            className="font-display text-2xl font-bold mb-1"
            style={{
              color: "var(--brand-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            {p.num}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {p.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Loading & error ────────────────────────────────────────────────────

function LoadingState({ url }: { url: string }) {
  return (
    <div
      className="text-center py-12 px-6 rounded-xl"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      <Loader2
        className="animate-spin mx-auto mb-4"
        size={32}
        style={{ color: "var(--brand-primary)" }}
      />
      <p
        className="text-sm font-medium mb-1"
        style={{ color: "var(--text-primary)" }}
      >
        Running 20 checks across your site
      </p>
      <p className="text-xs" style={{ color: "var(--text-faint)" }}>
        Fetching {safeHost(url)} and Google PageSpeed, can take up to 30 seconds.
      </p>
    </div>
  );
}

function ErrorState({
  message,
  onReset,
}: {
  message: string;
  onReset: () => void;
}) {
  return (
    <div
      className="text-center py-10 px-6 rounded-xl"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      <X
        className="mx-auto mb-3"
        size={28}
        style={{ color: "var(--danger)" }}
      />
      <p
        className="text-base font-medium mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        Couldn&apos;t audit this URL
      </p>
      <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
        {message}
      </p>
      <button
        onClick={onReset}
        className="text-sm font-medium px-4 py-2 rounded-lg"
        style={{ background: "var(--brand-primary)", color: "#ffffff" }}
      >
        Try a different URL
      </button>
    </div>
  );
}

// ── Result ──────────────────────────────────────────────────────────────

function ResultView({ result }: { result: AuditResult }) {
  const band = BAND_COPY[result.band];
  const bandColor = BAND_COLOR[result.band];
  const host = safeHost(result.finalUrl || result.url);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    track({
      name: "checkit_share_clicked",
      host,
      score: result.totalScore,
    });
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `CheckIt: ${host} scored ${result.totalScore}/100`,
          text: `${band.label}, ${band.tagline}`,
          url: shareUrl,
        });
        return;
      } catch {
        /* fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="space-y-6 mt-2">
      <ScoreHeader
        score={result.totalScore}
        bandLabel={band.label}
        bandTagline={band.tagline}
        bandColor={bandColor}
        host={host}
        onShare={handleShare}
      />

      <div className="space-y-3">
        {result.dimensions.map((d) => (
          <DimensionCard key={d.id} dimension={d} />
        ))}
      </div>

      <FooterCta />
    </div>
  );
}

function ScoreHeader({
  score,
  bandLabel,
  bandTagline,
  bandColor,
  host,
  onShare,
}: {
  score: number;
  bandLabel: string;
  bandTagline: string;
  bandColor: string;
  host: string;
  onShare: () => void;
}) {
  // CheckIt score header. Solid band-colored background so the result
  // announces itself before the user reads a single word. White type
  // on color, white score ring with translucent track. The color signals
  // the band tier visually: green = ready, amber = polish, red = vibe.
  return (
    <div
      className="rounded-2xl px-5 sm:px-8 py-6 sm:py-7 flex flex-col sm:flex-row items-start sm:items-center gap-5"
      style={{
        background: bandColor,
        color: "#ffffff",
      }}
    >
      <div className="flex items-center gap-4 sm:gap-5">
        <ScoreRing score={score} color="#ffffff" onColor />
        <div className="min-w-0">
          <p
            className="text-[10px] uppercase tracking-wider mb-1 font-semibold"
            style={{ color: "rgba(255, 255, 255, 0.85)" }}
          >
            CheckIt score
          </p>
          <p
            className="font-display text-xl sm:text-2xl font-bold mb-0.5 leading-tight"
            style={{
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            {bandLabel}
          </p>
          <p
            className="text-xs sm:text-sm leading-snug"
            style={{ color: "rgba(255, 255, 255, 0.85)" }}
          >
            {bandTagline}
          </p>
        </div>
      </div>

      <div className="sm:ml-auto flex flex-col sm:items-end gap-2 w-full sm:w-auto">
        <p
          className="text-xs font-mono truncate max-w-full"
          style={{ color: "rgba(255, 255, 255, 0.75)" }}
        >
          {host}
        </p>
        <button
          onClick={onShare}
          className="inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.25)",
          }}
        >
          <Share2 size={14} /> Share result
        </button>
      </div>
    </div>
  );
}

function ScoreRing({
  score,
  color,
  onColor = false,
}: {
  score: number;
  color: string;
  onColor?: boolean;
}) {
  const SIZE = 116;
  const STROKE = 8;
  const radius = (SIZE - STROKE) / 2;
  const circ = 2 * Math.PI * radius;
  const progress = (Math.max(0, Math.min(100, score)) / 100) * circ;
  const trackColor = onColor ? "rgba(255, 255, 255, 0.25)" : "var(--divider)";
  const textColor = onColor ? "#ffffff" : "var(--text-primary)";
  const subTextColor = onColor ? "rgba(255, 255, 255, 0.75)" : "var(--text-faint)";
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
          stroke={color}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={circ - progress}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.9s ease-out",
            filter: onColor
              ? undefined
              : `drop-shadow(0 0 6px ${color}55)`,
          }}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center font-display leading-none"
        style={{ color: textColor }}
      >
        <span className="text-[34px] font-bold">{score}</span>
        <span
          className="text-[10px] mt-1.5 font-mono uppercase tracking-wider"
          style={{ color: subTextColor }}
        >
          /100
        </span>
      </div>
    </div>
  );
}

// ── Dimension card ────────────────────────────────────────────────────

function DimensionCard({ dimension }: { dimension: DimensionResult }) {
  const [open, setOpen] = useState(false);
  const config = DIMENSIONS.find((d) => d.id === dimension.id)!;
  const ratio = dimension.score / 20;
  const color =
    ratio === 1
      ? "#22C55E"
      : ratio >= 0.5
      ? "#F59E0B"
      : "var(--brand-primary)";
  const accent = DIMENSION_ACCENT[dimension.id] ?? "var(--brand-primary)";
  const passed = dimension.checks.filter((c) => c.pass).length;
  const total = dimension.checks.length;

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      track({ name: "checkit_dimension_expanded", dimension: dimension.id });
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden relative"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <button
        onClick={handleToggle}
        className="w-full px-4 py-4 sm:px-6 sm:py-5 flex items-center gap-3 sm:gap-4 text-left"
      >
        <div className="flex-shrink-0">
          <div
            className="inline-flex items-baseline gap-0.5 px-3 py-1.5 rounded-lg"
            style={{
              background: `color-mix(in srgb, ${color} 12%, transparent)`,
              color,
            }}
          >
            <span className="font-display text-lg sm:text-xl font-bold">
              {dimension.score}
            </span>
            <span className="text-[10px] opacity-70 font-mono">/20</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="text-base sm:text-lg font-semibold mb-0.5"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            {dimension.label}
          </h3>
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            {config.oneLiner}
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded"
            style={{
              color: "var(--text-faint)",
              background: "var(--tag-bg)",
            }}
            title="Passed / total checks"
          >
            {passed}/{total}
          </span>
          <ChevronDown
            size={18}
            style={{
              color: "var(--text-faint)",
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </div>
      </button>

      {open && (
        <div
          className="px-4 pb-5 sm:px-6 sm:pb-6"
          style={{ borderTop: "1px solid var(--divider)" }}
        >
          <Section title="Why this matters">
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {config.whyItMatters}
            </p>
          </Section>

          <Section title="What we checked">
            <ul className="space-y-3">
              {dimension.checks.map((c) => (
                <li key={c.id} className="flex gap-3">
                  <div
                    className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: c.pass
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(243,18,60,0.12)",
                    }}
                  >
                    {c.pass ? (
                      <Check
                        size={12}
                        style={{ color: "#22C55E" }}
                        strokeWidth={3}
                      />
                    ) : (
                      <X
                        size={12}
                        style={{ color: "var(--brand-primary)" }}
                        strokeWidth={3}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {c.label}
                    </p>
                    <p
                      className="text-xs mt-0.5 leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {c.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Learn how to fix this">
            <div className="space-y-2">
              {config.linkedResources.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.type}/${r.slug}`}
                  onClick={() =>
                    track({
                      name: "checkit_resource_clicked",
                      dimension: dimension.id,
                      resource_type: r.type,
                      resource_slug: r.slug,
                    })
                  }
                  className="block p-3 rounded-lg transition-colors"
                  style={{
                    background: "var(--tag-bg)",
                    border: "1px solid var(--card-border)",
                  }}
                >
                  <p
                    className="text-sm font-medium mb-0.5"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {r.title}{" "}
                    <ArrowRight
                      size={12}
                      className="inline ml-0.5 opacity-60"
                    />
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {r.hook}
                  </p>
                </Link>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-5">
      <p
        className="text-[11px] uppercase tracking-wider mb-3 font-medium"
        style={{ color: "var(--text-faint)" }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

// ── Footer CTA back to the library ────────────────────────────────────

function FooterCta() {
  return (
    <div
      className="rounded-xl px-5 sm:px-6 py-5 mt-8"
      style={{
        background: "var(--brand-soft)",
        border: "1px solid rgba(243, 18, 60, 0.2)",
      }}
    >
      <p
        className="text-sm font-medium mb-1"
        style={{ color: "var(--text-primary)" }}
      >
        Want to see how the best products got the basics right?
      </p>
      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
        northstar has 64+ case studies on how Razorpay, Stripe, Notion, and
        others built products that converted from day one.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium"
        style={{ color: "var(--brand-primary)" }}
      >
        Browse the library <ArrowRight size={14} />
      </Link>
    </div>
  );
}
