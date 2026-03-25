"use client";

import { TrendingUp, TrendingDown, BookOpen } from "lucide-react";
import { CaseStudy } from "@/data/caseStudies";
import { SaveButton } from "@/components/SaveButton";
import Link from "next/link";

interface CaseStudyCardProps {
  study: CaseStudy;
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
  isLoggedIn = false,
  initialSaved = false,
  initialLiked = false,
  onAuthRequired = () => {},
}: CaseStudyCardProps) {
  const isFailure = study.category === "Failure";
  const color = categoryColors[study.category] ?? "var(--brand-primary)";

  return (
    <div
      className="case-card rounded-xl overflow-hidden"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      {/* Main clickable area */}
      <Link
        href={`/case-study/${study.id}`}
        className="block p-4 group"
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl flex-shrink-0">{study.logo}</span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: `${color}18`,
                    color: color,
                    border: `1px solid ${color}30`,
                  }}
                >
                  {study.category}
                </span>
                <span
                  className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    background: "var(--tag-bg)",
                    color: "var(--text-muted)",
                    border: "1px solid var(--card-border)",
                  }}
                >
                  <BookOpen size={9} />
                  Case Study
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isFailure ? (
              <TrendingDown size={14} style={{ color: "#FF4B4B" }} />
            ) : (
              <TrendingUp size={14} style={{ color: "#50C878" }} />
            )}
          </div>
        </div>

        {/* Company + Title */}
        <p
          className="text-xs font-medium mb-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          {study.company} · {study.year}
        </p>
        <h3
          className="text-sm font-semibold leading-tight mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {study.title}
        </h3>

        {/* Description */}
        <p
          className="text-xs leading-relaxed line-clamp-2 mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          {study.description}
        </p>

        {/* Outcome */}
        <div
          className="text-xs px-2.5 py-1.5 rounded-lg mb-3"
          style={{
            background: isFailure
              ? "rgba(255,75,75,0.06)"
              : "rgba(80,200,120,0.06)",
            border: `1px solid ${isFailure ? "rgba(255,75,75,0.15)" : "rgba(80,200,120,0.15)"}`,
            color: isFailure ? "#FF4B4B" : "#50C878",
          }}
        >
          {study.outcome}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {study.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                background: "var(--tag-bg)",
                color: "var(--text-muted)",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </Link>

      {/* Save/Like bar */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--card-border)" }}
      >
        <span className="text-xs" style={{ color: "var(--text-faint)" }}>
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
