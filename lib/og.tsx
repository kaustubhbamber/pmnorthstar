import { ImageResponse } from "next/og";

// Shared design tokens — kept in sync with the site CSS variables.
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

interface OGTemplateProps {
  eyebrow: string;       // e.g. "CASE STUDY · Product"
  title: string;         // main headline
  subtitle?: string;     // optional second line (e.g. "by Marty Cagan")
  description?: string;  // optional body text below the title block
  footer?: string;       // optional small footer line, e.g. "5 min read"
}

// Renders the shared northstar OG card.
// All children of multi-child divs use display:flex (a Satori requirement).
export function ogTemplate({
  eyebrow,
  title,
  subtitle,
  description,
  footer,
}: OGTemplateProps) {
  return (
    <div
      style={{
        background: "#000000",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        position: "relative",
      }}
    >
      {/* Subtle red glow in top-left corner for brand accent */}
      <div
        style={{
          position: "absolute",
          top: -120,
          left: -120,
          width: 360,
          height: 360,
          borderRadius: 9999,
          background: "rgba(243,18,60,0.18)",
          filter: "blur(80px)",
          display: "flex",
        }}
      />

      {/* Top row: brand eyebrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 9999,
            background: "#F3123C",
            display: "flex",
          }}
        />
        <span
          style={{
            color: "#F3123C",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          northstar · {eyebrow}
        </span>
      </div>

      {/* Middle: title + optional subtitle */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          zIndex: 1,
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            fontSize: title.length > 60 ? 56 : title.length > 36 ? 68 : 80,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              color: "#B5B5B5",
              fontSize: 32,
              fontWeight: 400,
              letterSpacing: "-0.01em",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Bottom row: description (left) + wordmark (right) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 32,
          zIndex: 1,
        }}
      >
        <div
          style={{
            color: "#B5B5B5",
            fontSize: 22,
            lineHeight: 1.4,
            maxWidth: 780,
            display: "flex",
          }}
        >
          {description || footer || "Free curated library for product managers, founders and operators."}
        </div>
        <div
          style={{
            color: "#707070",
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "0.02em",
            display: "flex",
            flexShrink: 0,
          }}
        >
          pmnorthstar.in
        </div>
      </div>
    </div>
  );
}

export function ogImage(props: OGTemplateProps) {
  return new ImageResponse(ogTemplate(props), OG_SIZE);
}
