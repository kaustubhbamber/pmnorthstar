"use client";

import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
  // Kept for call-site compatibility. Google sign-in completes via a
  // full-page redirect (start → consent → callback), so the modal never
  // invokes this directly — the page re-reads /api/auth/me on return.
  onSuccess?: (user: { id: string; name: string; email: string }) => void;
}

// SSO-only. Email/password auth was removed: the knowledge-based reset
// (email + name) could plant a password on any account — including
// Google-only ones — and take it over. Google is now the single path.
export function AuthModal({ onClose }: AuthModalProps) {
  // Capture the parent URL's ?next= after mount so we return the user
  // where they were. Read in an effect (not during render) to avoid a
  // hydration mismatch — undefined on the server, filled in on the client.
  const [googleHref, setGoogleHref] = useState("/api/auth/google/start");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next) {
      setGoogleHref(`/api/auth/google/start?next=${encodeURIComponent(next)}`);
    }
  }, []);

  // Close on Escape, mirroring the backdrop click.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-2xl p-5 sm:p-8"
        style={{
          background: "var(--page-bg)",
          border: "1.5px solid var(--card-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <X size={18} />
        </button>

        {/* Logo + eyebrow */}
        <div className="mb-7">
          <div className="flex items-center gap-2.5 mb-5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "var(--brand-primary)" }}
            >
              <Star size={13} className="text-white fill-white" strokeWidth={1.5} />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="font-display font-bold text-[17px]" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>north</span>
              <span className="font-display font-bold text-[17px]" style={{ color: "var(--brand-primary)", letterSpacing: "-0.02em" }}>star</span>
            </div>
          </div>
          <h2
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            Sign in to northstar
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Sign in with Google to save and like content. Optional — the
            whole library is free either way.
          </p>
        </div>

        {/* Continue with Google — the only sign-in path. Goes through
            /api/auth/google/start which sets the CSRF state cookie and
            redirects to consent; ?next= preserves the post-login target. */}
        <a
          href={googleHref}
          className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.01]"
          style={{
            background: "var(--card-bg)",
            border: "1.5px solid var(--card-border)",
            color: "var(--text-primary)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          Continue with Google
        </a>

        <p
          className="text-xs text-center mt-5"
          style={{ color: "var(--text-faint)" }}
        >
          We only use your Google account to identify you. No passwords to
          set, reset, or leak.
        </p>
      </div>
    </div>
  );
}
