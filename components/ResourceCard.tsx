"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { Book, getBookSlug } from "@/data/books";
import { SaveButton } from "@/components/SaveButton";
import { getCategoryColor } from "@/lib/category-colors";

// Pull a Wikipedia thumbnail for the author. CORS-friendly, fast, cached
// in localStorage so repeat visits don't re-fetch. Returns null while
// loading or if Wikipedia has no thumbnail — the card falls back to a
// red-gradient initials avatar in that case.
function useAuthorPhoto(author: string): string | null {
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // v2 cache key — invalidates any stale 'none' entries that were
    // saved during transient network failures in earlier sessions, so
    // we get a fresh shot at fetching the photo.
    const cacheKey = `pmnorthstar:author-photo-v2:${author}`;
    const cached = window.localStorage.getItem(cacheKey);
    if (cached === "none") return;
    if (cached) {
      setPhoto(cached);
      return;
    }

    let cancelled = false;
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      author
    )}`;
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
  }, [author]);

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
            color:
              i < Math.round(rating)
                ? "var(--text-primary)"
                : "var(--text-faint)",
            fill:
              i < Math.round(rating) ? "var(--text-primary)" : "transparent",
          }}
        />
      ))}
    </div>
  );
}

function authorInitials(author: string): string {
  return author
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
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
  const authorPhoto = useAuthorPhoto(book.author);
  const cat = getCategoryColor(book.category);

  // Width sizing per variant. Tighter than previous version to fit more
  // cards per row — PMs scan, they don't dwell on individual cards.
  const widthClass =
    variant === "featured"
      ? "flex-shrink-0 w-[200px] sm:w-[220px]"
      : variant === "default"
      ? "flex-shrink-0 w-[190px] sm:w-[210px]"
      : "";

  const isSavedOrLiked = initialLiked || initialSaved;

  return (
    <div
      className={`playlist-card surface overflow-hidden relative group ${widthClass}`}
      style={
        {
          ["--accent-color" as any]: "var(--brand-primary)",
          background: isSavedOrLiked ? "var(--brand-soft)" : "var(--card-bg)",
          borderColor: isSavedOrLiked
            ? "var(--brand-primary)"
            : "var(--card-border)",
        } as React.CSSProperties
      }
    >
      {isSavedOrLiked && (
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
          {initialLiked && (
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded-full"
              style={{ background: "var(--brand-primary)" }}
              title="Liked"
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
          )}
          {initialSaved && (
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded-full"
              style={{ background: "var(--brand-primary)" }}
              title="Saved"
            >
              <svg width="7" height="9" viewBox="0 0 24 24" fill="white">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
            </span>
          )}
        </div>
      )}

      <a href={`/book/${getBookSlug(book)}`} className="block">
        {/* Compact author band — Wikipedia thumbnail when available,
            initials avatar as fallback. Same size and position either way
            so the layout doesn't shift when the photo loads. */}
        <div
          className="flex items-center gap-3 px-4 pt-4 pb-3"
          style={{ borderBottom: "1px solid var(--card-border)" }}
        >
          {/* Avatar slot — always reserves a fixed 40x40 box via explicit
              dimensions + aspect-ratio. Prevents CLS when the Wikipedia
              photo loads asynchronously and replaces the initials fallback. */}
          <div
            className="relative w-10 h-10 rounded-full flex-shrink-0 overflow-hidden"
            style={{
              aspectRatio: "1 / 1",
              boxShadow: "0 0 0 1px var(--card-border)",
              background:
                "linear-gradient(135deg, var(--brand-primary), #8B0000)",
            }}
          >
            {/* Initials always render — acts as the visual background until
                the photo (if any) overlays via absolute positioning. No
                conditional swap = no layout shift. */}
            <span
              className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white"
              style={{ letterSpacing: "-0.01em" }}
            >
              {authorInitials(book.author)}
            </span>
            {authorPhoto && (
              <img
                src={authorPhoto}
                alt={book.author}
                loading="lazy"
                decoding="async"
                width={40}
                height={40}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="text-[10px] font-medium uppercase tracking-wider"
              style={{ color: "var(--text-faint)" }}
            >
              Author
            </p>
            <p
              className="text-xs font-semibold leading-tight truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {book.author}
            </p>
          </div>
          <div
            className="card-arrow flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style={{
              border: "1px solid var(--card-border)",
              color: "var(--brand-primary)",
            }}
          >
            <ArrowUpRight size={12} strokeWidth={1.8} />
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pt-3 pb-3">
          <span
            className="inline-flex items-center text-[10px] font-bold uppercase px-2.5 py-1 rounded-md mb-2.5"
            style={{
              background: cat.color,
              color: "#ffffff",
              letterSpacing: "0.12em",
            }}
          >
            {book.category}
          </span>

          <h3
            className="text-base font-semibold leading-tight mb-2 line-clamp-2"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            {book.title}
          </h3>

          {variant !== "list" && (
            <p
              className="text-xs leading-relaxed line-clamp-2 mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              {book.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <StarRating rating={book.rating} />
            <span
              className="text-[11px] font-mono"
              style={{ color: "var(--text-faint)" }}
            >
              {book.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </a>

      {/* Footer: just the save/like actions. The whole card is already
          a link to the book, so a separate 'Open book' label was redundant. */}
      <div
        className="px-4 py-2.5 flex items-center justify-end"
        style={{ borderTop: "1px solid var(--card-border)" }}
      >
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
