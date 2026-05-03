"use client";

const SUBSTACK_EMBED_URL = "https://pmnorthstar.substack.com/embed";

interface SubscribeFormProps {
  variant?: "inline" | "card";
  headline?: string;
  subhead?: string;
  className?: string;
}

export function SubscribeForm({
  variant = "card",
  headline = "Get the next case study in your inbox.",
  subhead = "One product deep dive every few days. Free. No paywall.",
  className = "",
}: SubscribeFormProps) {
  return (
    <div
      className={`${variant === "card" ? "surface" : ""} ${className}`}
      style={{
        padding: variant === "card" ? "24px" : 0,
        borderRadius: variant === "card" ? 12 : 0,
      }}
    >
      <p
        className="eyebrow mb-2"
        style={{ color: "var(--brand-primary)", opacity: 0.85 }}
      >
        Newsletter
      </p>
      <h3
        className="text-lg sm:text-xl font-semibold mb-1.5"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
      >
        {headline}
      </h3>
      <p
        className="text-sm mb-5 leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        {subhead}
      </p>

      {/* Substack's official embed — guarantees the signup reaches their
          backend and triggers the confirmation email. The iframe is
          server-rendered by Substack, so its internal styling is fixed
          (light background) but it sits inside our branded card. */}
      <div
        style={{
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid var(--card-border)",
          background: "#ffffff",
        }}
      >
        <iframe
          src={SUBSTACK_EMBED_URL}
          width="100%"
          height="220"
          style={{
            border: "none",
            background: "#ffffff",
            display: "block",
          }}
          title="Subscribe to northstar"
          loading="lazy"
        />
      </div>

      <p
        className="text-[11px] mt-3"
        style={{ color: "var(--text-faint)" }}
      >
        Free forever. Unsubscribe anytime. No spam.
      </p>
    </div>
  );
}
