"use client";

import { CaseStudy } from "@/data/caseStudies";
import { ExternalLink, Youtube, FileText, TrendingUp, TrendingDown, Bookmark, Heart } from "lucide-react";

interface CaseStudyCardProps {
  study: CaseStudy;
  savedIds?: Set<string>;
  favouriteIds?: Set<string>;
  onToggleSave?: (id: string) => void;
  onToggleFavourite?: (id: string) => void;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Product:  { bg: "rgba(108,99,255,0.12)",  text: "#9B8FFF", border: "rgba(108,99,255,0.3)"  },
  Growth:   { bg: "rgba(255,107,53,0.12)",  text: "#FF6B35", border: "rgba(255,107,53,0.3)"  },
  Strategy: { bg: "rgba(245,200,66,0.12)",  text: "#F5C842", border: "rgba(245,200,66,0.3)"  },
  Design:   { bg: "rgba(80,200,120,0.12)",  text: "#50C878", border: "rgba(80,200,120,0.3)"  },
  Failure:  { bg: "rgba(255,75,75,0.12)",   text: "#FF4B4B", border: "rgba(255,75,75,0.3)"   },
};

export function CaseStudyCard({
  study,
  savedIds = new Set(),
  favouriteIds = new Set(),
  onToggleSave,
  onToggleFavourite,
}: CaseStudyCardProps) {
  const color = categoryColors[study.category];
  const isFailure = study.category === "Failure";
  const isSaved = savedIds.has(study.id);
  const isFavourite = favouriteIds.has(study.id);

  return (
    <div
      onClick={() => window.open(study.link, "_blank", "noopener,noreferrer")}
      className="group relative rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px ${color.border}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.15)";
      }}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: color.bg, border: `1px solid ${color.border}` }}
          >
            {study.logo}
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{study.company}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)", opacity: 0.6 }}>{study.year}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: color.bg, color: color.text, border: `1px solid ${color.border}` }}
          >
            {study.category}
          </span>
          {isFailure ? (
            <TrendingDown size={14} style={{ color: "#FF4B4B" }} />
          ) : (
            <TrendingUp size={14} style={{ color: "#50C878" }} />
          )}
        </div>
      </div>

      {/* Title */}
      <h3
        className="font-display text-base font-semibold leading-snug mb-2 group-hover:opacity-90 transition-opacity"
        style={{ color: "var(--text-primary)" }}
      >
        {study.title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed line-clamp-3 mb-4" style={{ color: "var(--text-muted)" }}>
        {study.description}
      </p>

      {/* Outcome */}
      <div
        className="rounded-xl px-3 py-2.5 mb-4"
        style={{
          background: isFailure ? "rgba(255,75,75,0.06)" : "rgba(80,200,120,0.06)",
          border: `1px solid ${isFailure ? "rgba(255,75,75,0.15)" : "rgba(80,200,120,0.15)"}`,
        }}
      >
        <p className="text-xs font-medium mb-0.5" style={{ color: isFailure ? "#FF4B4B" : "#50C878" }}>
          {isFailure ? "What Happened" : "Outcome"}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{study.outcome}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap">
          {study.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "var(--tag-bg)", color: "var(--text-muted)", border: "1px solid var(--card-border)" }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Link type */}
        <div
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
          style={{
            background: study.linkType === "youtube" ? "rgba(255,0,0,0.1)" : "rgba(108,99,255,0.1)",
            color: study.linkType === "youtube" ? "#FF4444" : "#9B8FFF",
            border: `1px solid ${study.linkType === "youtube" ? "rgba(255,0,0,0.2)" : "rgba(108,99,255,0.2)"}`,
          }}
        >
          {study.linkType === "youtube" ? <Youtube size={11} /> : <FileText size={11} />}
          {study.linkType === "youtube" ? "Watch" : "Read"}
          <ExternalLink size={10} />
        </div>
      </div>

      {/* Save / Like */}
      <div
        className="flex items-center gap-2 mt-4 pt-3"
        style={{ borderTop: "1px solid var(--card-border)" }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSave?.(study.id); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            background: isSaved ? "var(--brand-soft)" : "var(--tag-bg)",
            color: isSaved ? "var(--brand-primary)" : "var(--text-muted)",
            border: `1px solid ${isSaved ? "rgba(243,18,60,0.3)" : "var(--card-border)"}`,
          }}
        >
          <Bookmark size={10} className={isSaved ? "fill-current" : ""} />
          {isSaved ? "Saved" : "Save"}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavourite?.(study.id); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            background: isFavourite ? "var(--brand-soft)" : "var(--tag-bg)",
            color: isFavourite ? "var(--brand-primary)" : "var(--text-muted)",
            border: `1px solid ${isFavourite ? "rgba(243,18,60,0.3)" : "var(--card-border)"}`,
          }}
        >
          <Heart size={10} className={isFavourite ? "fill-current" : ""} />
          {isFavourite ? "Liked" : "Like"}
        </button>
      </div>
    </div>
  );
}