"use client";

import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { Playlist, learnCategoryColors } from "@/data/learn";
import { SaveButton } from "@/components/SaveButton";

// Pull a YouTube thumbnail when the URL is a single video; for playlists
// (youtube.com/playlist?list=...) there's no public thumbnail without an
// API call, so we fall back to a colored gradient with the category emoji.
function getYouTubeThumbnail(url: string): string | null {
  if (!url) return null;
  // youtu.be/<id>
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://i.ytimg.com/vi/${shortMatch[1]}/hqdefault.jpg`;
  // youtube.com/watch?v=<id>
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return `https://i.ytimg.com/vi/${watchMatch[1]}/hqdefault.jpg`;
  return null;
}

interface PlaylistCardProps {
  playlist: Playlist;
  index?: number;
  isLoggedIn?: boolean;
  initialSaved?: boolean;
  initialLiked?: boolean;
  onAuthRequired?: () => void;
  onSavedChange?: (id: string, saved: boolean) => void;
  onLikedChange?: (id: string, liked: boolean) => void;
}

export function PlaylistCard({
  playlist,
  index,
  isLoggedIn = false,
  initialSaved = false,
  initialLiked = false,
  onAuthRequired = () => {},
  onSavedChange,
  onLikedChange,
}: PlaylistCardProps) {
  const color = learnCategoryColors[playlist.category] ?? "var(--brand-primary)";
  const hasUrl = playlist.url && playlist.url.trim() !== "";
  // Prefer the curated imageUrl (fetched via YouTube oEmbed), fall back to
  // URL-pattern extraction for single-video URLs, fall back to gradient+emoji.
  const thumbnail = playlist.imageUrl || (hasUrl ? getYouTubeThumbnail(playlist.url) : null);
  const [thumbFailed, setThumbFailed] = useState(false);
  const indexLabel =
    typeof index === "number" ? String(index + 1).padStart(2, "0") : "·";

  return (
    <div
      className="playlist-card rounded-xl overflow-hidden relative"
      style={
        {
          background: initialLiked || initialSaved ? `${color}08` : "var(--card-bg)",
          border: `1.5px solid ${initialLiked || initialSaved ? color : "var(--card-border)"}`,
          ["--accent-color" as any]: color,
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
      <a
        href={hasUrl ? playlist.url : "#"}
        target={hasUrl ? "_blank" : undefined}
        rel={hasUrl ? "noopener noreferrer" : undefined}
        onClick={(e) => { if (!hasUrl) e.preventDefault(); }}
        className="block group"
        style={{ cursor: hasUrl ? "pointer" : "not-allowed" }}
      >
        {/* Image / thumbnail area */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: "16 / 9",
            background: thumbnail && !thumbFailed
              ? "transparent"
              : `linear-gradient(135deg, ${color}30, ${color}10)`,
            borderBottom: "1.5px solid var(--card-border)",
          }}
        >
          {thumbnail && !thumbFailed ? (
            <img
              src={thumbnail}
              alt={`${playlist.title}, ${playlist.category} YouTube playlist`}
              loading="lazy"
              decoding="async"
              width={480}
              height={360}
              onError={() => setThumbFailed(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl sm:text-6xl opacity-90">{playlist.thumbnail}</span>
            </div>
          )}
          {hasUrl && (
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.35)" }}
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full"
                style={{ background: color }}
              >
                <Play size={18} className="text-white fill-white" strokeWidth={1.5} />
              </div>
            </div>
          )}
        </div>

        <div className="px-5 pt-4 pb-4">
        {/* Top row: category · arrow */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="inline-flex items-center text-[10px] font-bold uppercase px-2.5 py-1 rounded-md truncate"
            style={{
              background: color,
              color: "#ffffff",
              letterSpacing: "0.12em",
            }}
          >
            {playlist.category}
          </span>

          <div
            className="card-arrow flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
            style={{
              border: `1.5px solid var(--card-border)`,
              color: hasUrl ? color : "var(--text-faint)",
            }}
          >
            <ArrowUpRight size={14} />
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-lg sm:text-xl font-semibold leading-tight mb-2"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
        >
          {playlist.title}
        </h3>

        {/* Channel + meta */}
        <p
          className="text-xs mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          {playlist.channel}
          {playlist.videos ? ` · ${playlist.videos} videos` : ""}
          {playlist.level ? ` · ${playlist.level}` : ""}
        </p>

        {/* Description */}
        <p
          className="text-xs leading-relaxed line-clamp-2"
          style={{ color: "var(--text-muted)" }}
        >
          {playlist.description}
        </p>

        {/* Tags */}
        {playlist.tags && playlist.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {playlist.tags.slice(0, 3).map((tag) => (
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
        </div>
      </a>

      {/* Footer */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderTop: "1.5px solid var(--card-border)" }}
      >
        <span
          className="text-xs"
          style={{ color: hasUrl ? "var(--text-muted)" : "var(--text-faint)" }}
        >
          {hasUrl ? "Watch on YouTube" : "Coming soon"}
        </span>
        <SaveButton
          resource={{
            id: playlist.id,
            title: playlist.title,
            author: playlist.channel,
            category: playlist.category,
            link: playlist.url || "#",
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
