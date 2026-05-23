"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { track } from "@/lib/track";

interface Recommendation {
  type: "case-study" | "book";
  slug: string;
  title: string;
  eyebrow: string; // category or short label
  href: string;
}

interface RecommendationsBlockProps {
  fromType: string; // "case-study" | "book" | etc.
  fromSlug: string;
  items: Recommendation[];
  headline?: string;
  subhead?: string;
}

// Renders recommendation cards for already-engaged users. Each click
// emits a tracked 'related_content_clicked' event with from/to context
// so we can see which recommendations actually drive return visits.
export function RecommendationsBlock({
  fromType,
  fromSlug,
  items,
  headline = "Because you've been reading northstar — try these next",
  subhead,
}: RecommendationsBlockProps) {
  if (items.length === 0) return null;
  return (
    <div
      className="surface p-5 sm:p-6"
      style={{ borderRadius: 12 }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-[0.16em] mb-2"
        style={{ color: "var(--brand-primary)" }}
      >
        For you
      </p>
      <h3
        className="text-base sm:text-lg font-semibold leading-snug mb-1"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
      >
        {headline}
      </h3>
      {subhead && (
        <p
          className="text-xs sm:text-sm leading-relaxed mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          {subhead}
        </p>
      )}
      <ul className={subhead ? "space-y-2 mt-2" : "space-y-2 mt-4"}>
        {items.map((rec) => (
          <li key={rec.href}>
            <Link
              href={rec.href}
              onClick={() =>
                track({
                  name: "related_content_clicked",
                  from_type: fromType,
                  from_slug: fromSlug,
                  to_type: rec.type,
                  to_slug: rec.slug,
                })
              }
              className="flex items-start justify-between gap-3 p-3 rounded-lg transition-colors hover:bg-[color:var(--tag-bg)] group"
            >
              <div className="min-w-0">
                <p
                  className="text-[10px] font-medium uppercase tracking-wider mb-1"
                  style={{ color: "var(--text-faint)" }}
                >
                  {rec.eyebrow}
                </p>
                <p
                  className="text-sm font-semibold leading-snug"
                  style={{ color: "var(--text-primary)" }}
                >
                  {rec.title}
                </p>
              </div>
              <ArrowUpRight
                size={14}
                strokeWidth={1.8}
                style={{ color: "var(--brand-primary)" }}
                className="flex-shrink-0 mt-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
