"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const navLinks: Array<{ label: string; href: string }> = [
  { label: "Books", href: "/#books" },
  { label: "Case studies", href: "/#casestudies" },
  { label: "Playlists", href: "/#playlists" },
  { label: "AI Decoded", href: "/ai-decoded" },
  { label: "CheckIt", href: "/checkit" },
  { label: "India", href: "/india" },
  { label: "About", href: "/about" },
];

const metaLinks: Array<{ label: string; href: string }> = [
  { label: "Newsletter", href: "https://pmnorthstar.substack.com" },
  { label: "Privacy", href: "/privacy" },
  { label: "Sitemap", href: "/sitemap.xml" },
  { label: "Robots", href: "/robots.txt" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="px-4 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-8"
      style={{
        borderTop: "1.5px solid var(--card-border)",
        background: "var(--page-bg)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top row: wordmark + nav */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--brand-primary)" }}
              />
              <span
                className="text-base font-bold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                northstar
              </span>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              Free, curated library for product managers, founders, and operators. Hand-picked. No paywall.
            </p>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-2 sm:gap-y-3">
            <div className="flex flex-col gap-2">
              <p
                className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: "var(--text-faint)" }}
              >
                Browse
              </p>
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: "var(--text-muted)" }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p
                className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: "var(--text-faint)" }}
              >
                More
              </p>
              {metaLinks.map((l) => {
                const isExternal = l.href.startsWith("http");
                return isExternal ? (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm inline-flex items-center gap-1 transition-colors hover:opacity-80"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {l.label}
                    <ArrowUpRight size={11} strokeWidth={1.8} />
                  </a>
                ) : (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom: small print */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-6"
          style={{ borderTop: "1.5px solid var(--card-border)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>
            © {year} northstar · made for the product community
          </p>
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>
            Amazon affiliate links help fund the work. No paywall, ever.
          </p>
        </div>
      </div>
    </footer>
  );
}
