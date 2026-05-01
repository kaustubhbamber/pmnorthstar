"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, Star, BookOpen } from "lucide-react";
import { Book } from "@/data/books";
import { SaveButton } from "@/components/SaveButton";

// Pull a Wikipedia thumbnail for the author when the book cover fails.
// Wikipedia's REST API returns CORS-friendly JSON. Result cached in
// localStorage so we don't re-fetch on every render / navigation.
function useAuthorPhoto(author: string, enabled: boolean): string | null {
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    const cacheKey = `pmnorthstar:author-photo:${author}`;
    const cached = window.localStorage.getItem(cacheKey);
    if (cached === "none") return;
    if (cached) {
      setPhoto(cached);
      return;
    }

    let cancelled = false;
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(author)}`;
    fetch(url, { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return;
        const src = data?.thumbnail?.source;
        if (src) {
          window.localStorage.setItem(cacheKey, src);
          setPhoto(src);
        } else {
          window.localStorage.setItem(cacheKey, "none");
        }
      })
      .catch(() => {
        if (!cancelled) window.localStorage.setItem(cacheKey, "none");
      });

    return () => {
      cancelled = true;
    };
  }, [author, enabled]);

  return photo;
}

interface ResourceCardProps {
  book: Book;
  index?: number;
  variant?: "default" | "featured" | "list" | "case-study";
  isLoggedIn?: boolean;
  initialSaved?: boolean;
  initialLiked?: boolean;
  onAuthRequired?: () => void;
  onSavedChange?: (id: string, saved: boolean) => void;
  onLikedChange?: (id: string, liked: boolean) => void;
}

function StarRating({ rating, size = 9 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          style={{
            color: i < Math.floor(rating) ? "var(--text-primary)" : "var(--text-faint)",
            fill: i < Math.floor(rating) ? "var(--text-primary)" : "transparent",
          }}
        />
      ))}
    </div>
  );
}

export function ResourceCard({
  book,
  index = 0,
  variant = "default",
  isLoggedIn = false,
  initialSaved = false,
  initialLiked = false,
  onAuthRequired = () => {},
  onSavedChange,
  onLikedChange,
}: ResourceCardProps) {
  const indexLabel = String(index + 1).padStart(2, "0");
  // OpenLibrary covers depend on archive.org, which is currently unreliable
  // (cyberattack aftermath — fetches frequently hang for 30+ seconds).
  // We try the author photo from Wikipedia first; it loads fast and reliably.
  // OpenLibrary cover is only attempted as a secondary if the author photo
  // is missing AND we want to give it a shot — but disabled for now.
  const authorPhoto = useAuthorPhoto(book.author, true);
  const [coverFailed, setCoverFailed] = useState(false);
  const useOpenLibraryCover = false; // re-enable when archive.org stabilizes
  const hasCover = useOpenLibraryCover && book.thumbnailURL && !coverFailed && !authorPhoto;

  // Width sizing per variant
  const widthClass =
    variant === "featured"
      ? "flex-shrink-0 w-[220px] sm:w-[240px] md:w-[260px]"
      : variant === "default"
      ? "flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px]"
      : "";

  return (
    <div
      className={`playlist-card surface overflow-hidden relative ${widthClass}`}
      style={
        {
          ["--accent-color" as any]: "var(--brand-primary)",
          background: initialLiked || initialSaved ? "var(--brand-soft)" : "var(--card-bg)",
          borderColor: initialLiked || initialSaved ? "var(--brand-primary)" : "var(--card-border)",
        } as React.CSSProperties
      }
    >
      {(initialLiked || initialSaved) && (
        <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
          {initialLiked && (
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full"
              style={{ background: "var(--brand-primary)" }}
              title="Liked"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </span>
          )}
          {initialSaved && (
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full"
              style={{ background: "var(--brand-primary)" }}
              title="Saved"
            >
              <svg width="9" height="11" viewBox="0 0 24 24" fill="white"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
            </span>
          )}
        </div>
      )}
      <a
        href={book.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        {/* Book cover image */}
        <div
          className="relative w-full overflow-hidden flex items-center justify-center"
          style={{
            aspectRatio: "16 / 9",
            background: hasCover
              ? "var(--tag-bg)"
              : "linear-gradient(135deg, var(--brand-soft), var(--card-bg))",
            borderBottom: "1px solid var(--card-border)",
          }}
        >
          {hasCover ? (
            <img
              src={book.thumbnailURL}
              alt={`${book.title} cover`}
              loading={index < 4 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={index < 4 ? "high" : "low"}
              onError={() => setCoverFailed(true)}
              className="h-full w-auto max-w-full object-contain"
              style={{ padding: "8px 0" }}
            />
          ) : authorPhoto ? (
            <div className="flex items-center gap-4 px-5 w-full">
              <img
                src={authorPhoto}
                alt={book.author}
                loading={index < 4 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index < 4 ? "high" : "low"}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover flex-shrink-0"
                style={{ border: "2px solid var(--card-bg)", boxShadow: "0 0 0 1px var(--card-border)" }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--brand-primary)" }}>By the author</p>
                <p className="text-base font-semibold leading-tight" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{book.author}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 px-5 w-full">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, var(--brand-primary), #8B0000)",
                  border: "2px solid var(--card-bg)",
                  boxShadow: "0 0 0 1px var(--card-border)",
                }}
              >
                <span className="text-2xl sm:text-3xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
                  {book.author.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--brand-primary)" }}>Author</p>
                <p className="text-base font-semibold leading-tight" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{book.author}</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-5">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full truncate"
            style={{
              background: "var(--brand-soft)",
              color: "var(--brand-primary)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--brand-primary)" }} />
            {book.category}
          </span>
          <div className="card-arrow flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
            style={{ border: "1px solid var(--card-border)", color: "var(--brand-primary)" }}>
            <ArrowUpRight size={14} strokeWidth={1.6} />
          </div>
        </div>

        <h3
          className="text-lg sm:text-xl font-semibold leading-tight mb-1.5"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
        >
          {book.title}
        </h3>
        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          by {book.author}
        </p>

        {variant !== "list" && (
          <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: "var(--text-muted)" }}>
            {book.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <StarRating rating={book.rating} />
          <span className="text-xs" style={{ color: "var(--text-faint)" }}>
            {book.rating.toFixed(1)}
          </span>
        </div>
        </div>
      </a>

      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--card-border)" }}
      >
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Open book
        </span>
        <SaveButton
          resource={book}
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
