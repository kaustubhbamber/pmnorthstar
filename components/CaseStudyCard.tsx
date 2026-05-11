"use client";

import { useState } from "react";
import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";
import { CaseStudy, getCaseStudySlug } from "@/data/caseStudies";
import { getCompanyLogoUrl } from "@/data/companyDomains";
import { SaveButton } from "@/components/SaveButton";
import Link from "next/link";

interface CaseStudyCardProps {
  study: CaseStudy;
  index?: number;
  isLoggedIn?: boolean;
  initialSaved?: boolean;
  initialLiked?: boolean;
  onAuthRequired?: () => void;
  onSavedChange?: (id: string, saved: boolean) => void;
  onLikedChange?: (id: string, liked: boolean) => void;
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
  onSavedChange,
  onLikedChange,
}: CaseStudyCardProps) {
  const isFailure = study.category === "Failure";
  const color = categoryColors[study.category] ?? "var(--brand-primary)";
  const indexLabel = typeof index === "number" ? String(index + 1).padStart(2, "0") : "·";
  const logoUrl = getCompanyLogoUrl(study.company);
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div
      className="playlist-card surface overflow-hidden relative"
      style={
        {
          ["--accent-color" as any]: color,
          background: initialLiked || initialSaved ? `${color}08` : "var(--card-bg)",
          borderColor: initialLiked || initialSaved ? color : "var(--card-border)",
        } as React.CSSProperties
      }
    >
      {(initialLiked || initialSaved) && (
        <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
          {initialLiked && (
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full"
              style={{ background: color }}
              title="Liked"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </span>
          )}
          {initialSaved && (
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full"
              style={{ background: color }}
              title="Saved"
            >
              <svg width="9" height="11" viewBox="0 0 24 24" fill="white"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
            </span>
          )}
        </div>
      )}
      <Link href={`/case-study/${getCaseStudySlug(study.id)}`} className="block px-5 pt-5 pb-4 group">
        <div className="flex items-center justify-between mb-5">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full truncate"
            style={{
              background: `${color}14`,
              color,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
            {study.category}
          </span>
          <div className="card-arrow flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
            style={{ border: "1px solid var(--card-border)", color }}>
            <ArrowUpRight size={14} strokeWidth={1.6} />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          {logoUrl && !logoFailed ? (
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 overflow-hidden"
              style={{ background: "#fff", border: "1px solid var(--card-border)" }}
            >
              <img
                src={logoUrl}
                alt={`${study.company} logo`}
                loading="lazy"
                onError={() => setLogoFailed(true)}
                className="max-w-full max-h-full object-contain"
                style={{ padding: "3px" }}
              />
            </span>
          ) : (
            <span className="text-lg flex-shrink-0">{study.logo}</span>
          )}
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {study.company} · {study.year}
          </p>
        </div>
        <h3
          className="text-lg sm:text-xl font-semibold leading-tight mb-2"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
        >
          {study.title}
        </h3>

        <p className="text-sm leading-relaxed line-clamp-2 mb-4" style={{ color: "var(--text-muted)" }}>
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
          <span className="line-clamp-1 text-[11px]">
            {study.outcome}
          </span>
        </div>

        {/* Tags */}
        {study.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {study.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--tag-bg)",
                  color: "var(--text-muted)",
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
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Read case study
        </span>
        <SaveButton
          resource={{
            id: study.id,
            title: study.title,
            author: study.company,
            category: study.category,
            link: `/case-study/${getCaseStudySlug(study.id)}`,
          }}
          isLoggedIn={isLoggedIn}
          initialSaved={initialSaved}
          initialLiked={initialLiked}
          onAuthRequired={onAuthRequired}
          onSavedChange={onSavedChange}
          onLikedChange={onLikedChange}
        />
      </div>
    </div>
  );
}
