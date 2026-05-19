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

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  label?: string;
  compact?: boolean;
}

export function ShareButton({
  title,
  text,
  url,
  label = "Share",
  compact = false,
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

  const sizeClass = compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm";
  const iconSize = compact ? 11 : 14;

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={handleClick}
        className={`flex items-center gap-1.5 rounded-lg font-medium transition-all ${sizeClass}`}
        style={{
          background: "var(--tag-bg)",
          color: "var(--text-muted)",
          border: "1px solid var(--card-border)",
        }}
      >
        <Share2 size={iconSize} />
        {label}
      </button>

      {open && !canNativeShare && (
        <div
          className="absolute right-0 mt-2 z-50 w-44 rounded-lg overflow-hidden"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm transition-colors"
            style={{ color: "var(--text-primary)" }}
            onClick={() => setOpen(false)}
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
            onClick={() => setOpen(false)}
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
            onClick={() => setOpen(false)}
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
