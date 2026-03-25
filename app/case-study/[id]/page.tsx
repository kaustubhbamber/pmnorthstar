"use client";

import { useState, useEffect } from "react";
import { getCaseStudyById } from "@/data/caseStudies";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

const categoryColors: Record<string, string> = {
  Product: "#9B8FFF",
  Growth: "#FF6B35",
  Strategy: "#F5C842",
  Design: "#50C878",
  Failure: "#FF4B4B",
};

export default function CaseStudyPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const study = getCaseStudyById(id);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  if (!study) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ background: "var(--page-bg)" }}
      >
        <p className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Case study not found
        </p>
        <Link
          href="/"
          className="text-sm font-medium"
          style={{ color: "var(--brand-primary)" }}
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const isFailure = study.category === "Failure";
  const color = categoryColors[study.category] ?? "var(--brand-primary)";
  const paragraphs = study.content.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen" style={{ background: "var(--page-bg)" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft size={14} />
          Back to NorthStar
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-3xl">{study.logo}</span>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background: `${color}18`,
                color: color,
                border: `1px solid ${color}30`,
              }}
            >
              {study.category}
            </span>
            <span className="text-xs" style={{ color: "var(--text-faint)" }}>
              {study.company} · {study.year}
            </span>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-bold leading-tight mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            {study.title}
          </h1>

          <p
            className="text-sm sm:text-base leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {study.description}
          </p>
        </div>

        {/* Outcome box */}
        <div
          className="text-sm px-4 py-3 rounded-xl mb-8 flex items-start gap-2"
          style={{
            background: isFailure ? "rgba(255,75,75,0.06)" : "rgba(80,200,120,0.06)",
            border: `1px solid ${isFailure ? "rgba(255,75,75,0.15)" : "rgba(80,200,120,0.15)"}`,
            color: isFailure ? "#FF4B4B" : "#50C878",
          }}
        >
          {isFailure ? <TrendingDown size={16} className="mt-0.5 flex-shrink-0" /> : <TrendingUp size={16} className="mt-0.5 flex-shrink-0" />}
          <span>{study.outcome}</span>
        </div>

        {/* Content */}
        <article className="space-y-5 mb-10">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: "var(--text-primary)", opacity: 0.85 }}
            >
              {p}
            </p>
          ))}
        </article>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10">
          {study.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-lg"
              style={{
                background: "var(--tag-bg)",
                color: "var(--text-muted)",
                border: "1px solid var(--card-border)",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer nav */}
        <div
          className="pt-6"
          style={{ borderTop: "1px solid var(--card-border)" }}
        >
          <Link
            href="/"
            className="text-xs font-medium"
            style={{ color: "var(--brand-primary)" }}
          >
            ← Browse all case studies
          </Link>
        </div>
      </div>
    </div>
  );
}
