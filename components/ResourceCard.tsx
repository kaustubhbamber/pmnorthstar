"use client";

import { Book } from "@/data/books";
import { ExternalLink, Star, Bookmark, Heart } from "lucide-react";

interface ResourceCardProps {
  book: Book;
  variant?: "default" | "featured" | "list" | "case-study";
  index?: number;
  alternate?: boolean;
  savedIds?: Set<string>;
  favouriteIds?: Set<string>;
  onToggleSave?: (id: string) => void;
  onToggleFavourite?: (id: string) => void;
}

function getColorFromId(id: string) {
  const colors = ["#ef4444", "#22c55e", "#3b82f6"];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getColorFromIndex(index: number) {
  const colors = ["#ef4444", "#22c55e", "#3b82f6"];
  return colors[index % colors.length];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={10}
          className={i <= Math.round(rating) ? "fill-current" : ""}
          style={{
            color: i <= Math.round(rating) ? "#ffffff" : "rgba(255,255,255,0.3)",
          }}
        />
      ))}
      <span className="text-xs ml-1" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-mono)" }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export function ResourceCard({
  book,
  variant = "default",
  index = 0,
  alternate = false,
  savedIds = new Set(),
  favouriteIds = new Set(),
  onToggleSave,
  onToggleFavourite,
}: ResourceCardProps) {
  const handleClick = () => window.open(book.link, "_blank", "noopener,noreferrer");
  const tileColor = alternate ? getColorFromIndex(index) : getColorFromId(book.id);
  const isSaved = savedIds.has(book.id);
  const isFavourite = favouriteIds.has(book.id);

  const CardActions = () => (
    <div className="flex items-center gap-1.5 mt-3" style={{ position: "relative", zIndex: 10 }}>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleSave?.(book.id); }}
        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all"
        style={{
          background: isSaved ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.25)",
          color: isSaved ? tileColor : "rgba(255,255,255,0.9)",
        }}
      >
        <Bookmark size={10} className={isSaved ? "fill-current" : ""} />
        {isSaved ? "Saved" : "Save"}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavourite?.(book.id); }}
        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all"
        style={{
          background: isFavourite ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.25)",
          color: isFavourite ? tileColor : "rgba(255,255,255,0.9)",
        }}
      >
        <Heart size={10} className={isFavourite ? "fill-current" : ""} />
        {isFavourite ? "Liked" : "Like"}
      </button>
    </div>
  );

  const ListActions = () => (
    <div className="flex items-center gap-1.5 mt-1.5">
      <button
        onClick={(e) => { e.stopPropagation(); onToggleSave?.(book.id); }}
        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all"
        style={{
          background: isSaved ? "var(--brand-soft)" : "var(--tag-bg)",
          color: isSaved ? "var(--brand-primary)" : "var(--text-muted)",
          border: `1px solid ${isSaved ? "rgba(243,18,60,0.3)" : "var(--card-border)"}`,
        }}
      >
        <Bookmark size={9} className={isSaved ? "fill-current" : ""} />
        {isSaved ? "Saved" : "Save"}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavourite?.(book.id); }}
        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all"
        style={{
          background: isFavourite ? "var(--brand-soft)" : "var(--tag-bg)",
          color: isFavourite ? "var(--brand-primary)" : "var(--text-muted)",
          border: `1px solid ${isFavourite ? "rgba(243,18,60,0.3)" : "var(--card-border)"}`,
        }}
      >
        <Heart size={9} className={isFavourite ? "fill-current" : ""} />
        {isFavourite ? "Liked" : "Like"}
      </button>
    </div>
  );

  /* ---------------- DEFAULT / FEATURED ---------------- */
  if (variant === "default" || variant === "featured") {
    return (
      <div
        onClick={handleClick}
        className="book-card relative flex-shrink-0 w-64 rounded-xl overflow-hidden cursor-pointer group flex flex-col"
        style={{ background: tileColor, border: `1px solid ${tileColor}`, minHeight: "220px" }}
      >
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: "rgba(0,0,0,0.2)", color: "#ffffff" }}
              >
                {book.category.split(" ")[0]}
              </span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{book.year}</span>
            </div>

            <h3 className="font-bold leading-tight mb-2" style={{ color: "#ffffff", fontSize: "17px", lineHeight: "1.3" }}>
              {book.title}
            </h3>

            <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "rgba(255,255,255,0.75)" }}>
              {book.description}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-xs mb-2 font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>{book.author}</p>
            <StarRating rating={book.rating} />
            <div className="flex flex-wrap gap-1 mt-3">
              {book.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(0,0,0,0.2)", color: "rgba(255,255,255,0.8)" }}>
                  {tag}
                </span>
              ))}
            </div>
            <CardActions />
          </div>
        </div>

        {/* Overlay — only covers top, stops above the action buttons */}
        <div
          className="absolute inset-x-0 top-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ background: "rgba(0,0,0,0.18)", bottom: "88px", borderRadius: "12px 12px 0 0" }}
        >
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "#ffffff", color: tileColor }}
          >
            <ExternalLink size={11} />
            Open Resource
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- LIST ---------------- */
  if (variant === "list") {
    return (
      <div
        onClick={handleClick}
        className="book-card flex gap-3 p-3 rounded-xl cursor-pointer group"
        style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
      >
        <div className="w-12 h-16 flex-shrink-0 rounded-lg flex items-center justify-center" style={{ background: tileColor }}>
          <span className="text-xs font-bold text-center px-1 leading-tight" style={{ color: "#ffffff", fontSize: "9px" }}>
            {book.title.split(" ").slice(0, 2).join(" ")}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold line-clamp-1" style={{ color: "var(--text-primary)" }}>{book.title}</h4>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{book.author}</p>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={9}
                className={i <= Math.round(book.rating) ? "fill-current" : ""}
                style={{ color: i <= Math.round(book.rating) ? "var(--brand-primary)" : "var(--text-faint)" }}
              />
            ))}
            <span className="text-xs ml-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {book.rating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ background: "var(--brand-soft)", color: "var(--brand-primary)", border: "1px solid rgba(243,18,60,0.2)" }}>
              {book.category.split(" ")[0]}
            </span>
            <span className="text-xs" style={{ color: "var(--text-faint)" }}>{book.pages}p · {book.year}</span>
          </div>
          <ListActions />
        </div>

        <div className="flex-shrink-0 flex items-start pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink size={14} style={{ color: tileColor }} />
        </div>
      </div>
    );
  }

  return null;
}