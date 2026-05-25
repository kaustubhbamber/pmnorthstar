"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "pmnorthstar:consent-dismissed";

// Bottom-aligned dismissible banner surfacing cookie / analytics
// disclosure + link to the About page (covers editorial transparency).
// Renders only after hydration so SSR HTML doesn't include it — keeps
// initial paint clean and matches the site's quiet editorial brand.
export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // Slight delay so the banner doesn't appear on first paint —
      // gives the page content a chance to settle in.
      const t = window.setTimeout(() => setShow(true), 800);
      return () => window.clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    }
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Privacy and cookies notice"
      className="fixed left-3 right-3 sm:left-4 sm:right-4 z-50"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div
        className="max-w-3xl mx-auto flex items-start gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl shadow-lg"
        style={{
          background: "var(--card-bg)",
          border: "1.5px solid var(--card-border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
        }}
      >
        <div className="flex-1 min-w-0">
          <p
            className="text-xs sm:text-sm font-semibold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            northstar uses minimal cookies + privacy-friendly analytics.
          </p>
          <p
            className="text-[11px] sm:text-xs leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            We use Vercel Analytics (no third-party trackers) and JWT cookies for login. We don&apos;t sell your data, run display ads, or share with advertisers.{" "}
            <Link
              href="/about"
              className="underline transition-opacity hover:opacity-80"
              style={{ color: "var(--brand-primary)" }}
            >
              More on /about
            </Link>
            .
          </p>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss notice"
          className="flex-shrink-0 p-1.5 rounded-lg transition-colors"
          style={{
            color: "var(--text-muted)",
            border: "1.5px solid var(--card-border)",
          }}
        >
          <X size={14} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
