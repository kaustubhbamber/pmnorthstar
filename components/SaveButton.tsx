"use client";

import { useState } from "react";
import { Bookmark, Heart, Loader2 } from "lucide-react";
import { Book } from "@/data/books";

interface SaveButtonProps {
  book: Book;
  isLoggedIn: boolean;
  initialSaved?: boolean;
  initialLiked?: boolean;
  onAuthRequired: () => void;
}

export function SaveButton({
  book,
  isLoggedIn,
  initialSaved = false,
  initialLiked = false,
  onAuthRequired,
}: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [liked, setLiked] = useState(initialLiked);
  const [savingLoading, setSavingLoading] = useState(false);
  const [likingLoading, setLikingLoading] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }

    setSavingLoading(true);

    try {
      const method = saved ? "DELETE" : "POST";
      const res = await fetch("/api/saved", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: book.id,
          title: book.title,
          author: book.author,
          category: book.category,
          link: book.link,
        }),
      });

      if (res.ok) {
        setSaved(!saved);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSavingLoading(false);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }

    setLikingLoading(true);

    try {
      const method = liked ? "DELETE" : "POST";
      const res = await fetch("/api/liked", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: book.id,
          title: book.title,
          author: book.author,
          category: book.category,
          link: book.link,
        }),
      });

      if (res.ok) {
        setLiked(!liked);
      }
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setLikingLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={savingLoading}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all"
        style={{
          background: saved ? "var(--brand-primary)" : "var(--tag-bg)",
          color: saved ? "#ffffff" : "var(--text-muted)",
          border: `1px solid ${
            saved ? "var(--brand-primary)" : "var(--card-border)"
          }`,
        }}
        title={saved ? "Remove from saved" : "Save for later"}
      >
        {savingLoading ? (
          <Loader2 size={11} className="animate-spin" />
        ) : (
          <Bookmark
            size={11}
            className={saved ? "fill-current" : ""}
          />
        )}
        {saved ? "Saved" : "Save"}
      </button>

      {/* Like button */}
      <button
        onClick={handleLike}
        disabled={likingLoading}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all"
        style={{
          background: liked ? "rgba(243,18,60,0.1)" : "var(--tag-bg)",
          color: liked ? "var(--brand-primary)" : "var(--text-muted)",
          border: `1px solid ${
            liked ? "rgba(243,18,60,0.3)" : "var(--card-border)"
          }`,
        }}
        title={liked ? "Unlike" : "Like"}
      >
        {likingLoading ? (
          <Loader2 size={11} className="animate-spin" />
        ) : (
          <Heart
            size={11}
            className={liked ? "fill-current" : ""}
          />
        )}
        {liked ? "Liked" : "Like"}
      </button>
    </div>
  );
}