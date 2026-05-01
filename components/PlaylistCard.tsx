"use client";

import { ArrowUpRight } from "lucide-react";
import { Playlist, learnCategoryColors } from "@/data/learn";
import { SaveButton } from "@/components/SaveButton";

interface PlaylistCardProps {
  playlist: Playlist;
  index?: number;
  isLoggedIn?: boolean;
  initialSaved?: boolean;
  initialLiked?: boolean;
  onAuthRequired?: () => void;
}

export function PlaylistCard({
  playlist,
  index,
  isLoggedIn = false,
  initialSaved = false,
  initialLiked = false,
  onAuthRequired = () => {},
}: PlaylistCardProps) {
  const color = learnCategoryColors[playlist.category] ?? "var(--brand-primary)";
  const hasUrl = playlist.url && playlist.url.trim() !== "";
  const indexLabel =
    typeof index === "number" ? String(index + 1).padStart(2, "0") : "·";

  return (
    <div
      className="playlist-card rounded-xl overflow-hidden"
      style={
        {
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          ["--accent-color" as any]: color,
        } as React.CSSProperties
      }
    >
      <a
        href={hasUrl ? playlist.url : "#"}
        target={hasUrl ? "_blank" : undefined}
        rel={hasUrl ? "noopener noreferrer" : undefined}
        onClick={(e) => { if (!hasUrl) e.preventDefault(); }}
        className="block px-5 pt-5 pb-4 group"
        style={{ cursor: hasUrl ? "pointer" : "not-allowed" }}
      >
        {/* Top row: index · category · arrow */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="font-mono text-xs"
              style={{ color: "var(--text-faint)", letterSpacing: "0.08em" }}
            >
              {indexLabel}
            </span>
            <span
              className="w-px h-3"
              style={{ background: "var(--card-border)" }}
            />
            <span
              className="font-mono text-[10px] tracking-[0.18em] uppercase truncate"
              style={{ color }}
            >
              {playlist.category}
            </span>
          </div>

          <div
            className="card-arrow flex items-center justify-center w-7 h-7 rounded-full"
            style={{
              border: `1px solid var(--card-border)`,
              color: hasUrl ? color : "var(--text-faint)",
            }}
          >
            <ArrowUpRight size={14} />
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-base sm:text-[17px] font-semibold leading-snug mb-2"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
        >
          {playlist.title}
        </h3>

        {/* Channel + meta */}
        <p
          className="font-mono text-xs mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          {playlist.channel}
          {playlist.videos ? ` · ${playlist.videos} vids` : ""}
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
      </a>

      {/* Footer */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--card-border)" }}
      >
        <span
          className="font-mono text-[10px] tracking-[0.14em] uppercase"
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
        />
      </div>
    </div>
  );
}
