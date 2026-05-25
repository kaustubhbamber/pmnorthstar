"use client";

import { useState, useEffect, useRef } from "react";
import {
  Share2,
  Check,
  Copy,
  Twitter,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { track } from "@/lib/track";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  label?: string;
  compact?: boolean;
  // "subtle" is the muted header style; "prominent" is brand-tinted for
  // in-content placement next to primary CTAs where discoverability matters.
  variant?: "subtle" | "prominent";
  // Identifies which page type the share is coming from, for analytics.
  surface?: string;
}

export function ShareButton({
  title,
  text,
  url,
  label = "Share",
  compact = false,
  variant = "subtle",
  surface = "unknown",
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function"
    );
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  const shareUrl =
    url ?? (typeof window !== "undefined" ? window.location.href : "");
  const shareText = text ?? title;

  const handleClick = async () => {
    if (canNativeShare) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
        track({ name: "share_clicked", surface, target: "native" });
      } catch {
        // User cancelled or share failed; ignore.
      }
    } else {
      setOpen((o) => !o);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      track({ name: "share_clicked", surface, target: "copy" });
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Clipboard error:", err);
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl
  )}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${shareText} ${shareUrl}`
  )}`;

  const sizeClass = compact
    ? "px-2 py-1 text-xs"
    : variant === "prominent"
    ? "px-4 py-2.5 text-sm"
    : "px-3 py-1.5 text-sm";
  const iconSize = compact ? 11 : variant === "prominent" ? 15 : 14;

  const buttonStyle =
    variant === "prominent"
      ? {
          background: "var(--brand-soft)",
          color: "var(--brand-primary)",
          border: "1.5px solid rgba(243, 18, 60, 0.35)",
        }
      : {
          background: "var(--tag-bg)",
          color: "var(--text-muted)",
          border: "1.5px solid var(--card-border)",
        };

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={handleClick}
        className={`flex items-center gap-1.5 rounded-lg font-semibold transition-all hover:opacity-90 ${sizeClass}`}
        style={buttonStyle}
      >
        <Share2 size={iconSize} />
        {label}
      </button>

      {open && !canNativeShare && (
        <div
          className="absolute right-0 mt-2 z-50 w-44 rounded-lg overflow-hidden"
          style={{
            background: "var(--card-bg)",
            border: "1.5px solid var(--card-border)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm transition-colors"
            style={{ color: "var(--text-primary)" }}
            onClick={() => {
              track({ name: "share_clicked", surface, target: "twitter" });
              setOpen(false);
            }}
          >
            <Twitter size={14} />
            X / Twitter
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm transition-colors"
            style={{ color: "var(--text-primary)" }}
            onClick={() => {
              track({ name: "share_clicked", surface, target: "linkedin" });
              setOpen(false);
            }}
          >
            <Linkedin size={14} />
            LinkedIn
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm transition-colors"
            style={{ color: "var(--text-primary)" }}
            onClick={() => {
              track({ name: "share_clicked", surface, target: "whatsapp" });
              setOpen(false);
            }}
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
