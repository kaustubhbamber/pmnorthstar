"use client";

import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";
import { CaseStudy } from "@/data/caseStudies";
import { SaveButton } from "@/components/SaveButton";
import Link from "next/link";

interface CaseStudyCardProps {
  study: CaseStudy;
  index?: number;
  isLoggedIn?: boolean;
  initialSaved?: boolean;
  initialLiked?: boolean;
  onAuthRequired?: () => void;
}

const categoryColors: Record<string, string> = {
  Product: "#9B8FFF",
  Growth: "#FF6B35",
  Strategy: "#F5C842",
  Design: "#50C878",
  Failure: "#FF4B4B",
};

export function CaseStudyCard({
  study,
  index,
  isLoggedIn = false,
  initialSaved = false,
  initialLiked = false,
  onAuthRequired = () => {},
}: CaseStudyCardProps) {
  const isFailure = study.category === "Failure";
  const color = categoryColors[study.category] ?? "var(--brand-primary)";
  const indexLabel = typeof index === "number" ? String(index + 1).padStart(2, "0") : "·";

  return (
    <div
      className="playlist-card surface overflow-hidden"
      style={{ ["--accent-color" as any]: color } as React.CSSProperties}
    >
      <Link href={`/case-study/${study.id}`} className="block px-5 pt-5 pb-4 group">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-mono text-xs" style={{ color: "var(--text-faint)", letterSpacing: "0.08em" }}>
              {indexLabel}
            </span>
            <span className="w-px h-3" style={{ background: "var(--card-border)" }} />
            <span
              className="font-mono text-[10px] tracking-[0.18em] uppercase truncate"
              style={{ color }}
            >
              {study.category}
            </span>
          </div>
          <div className="card-arrow flex items-center justify-center w-7 h-7 rounded-full"
            style={{ border: "1px solid var(--card-border)", color }}>
            <ArrowUpRight size={14} strokeWidth={1.6} />
          </div>
        </div>

        <p className="font-mono text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
          <span className="mr-1.5">{study.logo}</span>
          {study.company} · {study.year}
        </p>
        <h3
          className="text-[15px] sm:text-base font-semibold leading-snug mb-2"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
        >
          {study.title}
        </h3>

        <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color: "var(--text-muted)" }}>
          {study.description}
        </p>

        {/* Outcome strip */}
        <div
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg mb-3"
          style={{
            background: "transparent",
            border: `1px solid ${isFailure ? "rgba(255,75,75,0.25)" : "rgba(80,200,120,0.25)"}`,
            color: isFailure ? "#FF4B4B" : "#50C878",
          }}
        >
          {isFailure ? (
            <TrendingDown size={12} strokeWidth={1.6} />
          ) : (
            <TrendingUp size={12} strokeWidth={1.6} />
          )}
          <span className="line-clamp-1 font-mono text-[11px]" style={{ letterSpacing: "0.02em" }}>
            {study.outcome}
          </span>
        </div>

        {/* Tags */}
        {study.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {study.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] px-2 py-0.5 rounded"
                style={{
                  background: "var(--tag-bg)",
                  color: "var(--text-muted)",
                  letterSpacing: "0.04em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>

      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--card-border)" }}
      >
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase" style={{ color: "var(--text-muted)" }}>
          Read case study
        </span>
        <SaveButton
          resource={{
            id: study.id,
            title: study.title,
            author: study.company,
            category: study.category,
            link: `/case-study/${study.id}`,
          }}
          isLoggedIn={isLoggedIn}
          initialSaved={initialSaved}
          initialLiked={initialLiked}
          onAuthRequired={onAuthRequired}
        />
      </div>
    </div>
  );
}
