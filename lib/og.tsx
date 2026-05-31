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

// ── CheckIt result share image ─────────────────────────────────────────
//
// Specialized OG card for /checkit?url=X. The background is the band
// color (green / amber / red) so the score reads in the social preview
// before any text loads. A huge centered number is the focal point.

interface CheckitOGProps {
  host: string;
  score: number;
  band:
    | "stellar"
    | "ready"
    | "almost"
    | "polish"
    | "rough"
    | "vibe"
    | "draft"
    | "skeleton"
    | "raw"
    | "missing";
  bandLabel: string;
  bandTagline: string;
}

// 10-step gradient from deep green ("stellar") to deep red ("missing")
// driving the OG card background color so the score reads in the
// social preview before any text loads.
const BAND_BG: Record<CheckitOGProps["band"], string> = {
  stellar: "#0F9D58",
  ready: "#22C55E",
  almost: "#84CC16",
  polish: "#EAB308",
  rough: "#F59E0B",
  vibe: "#F97316",
  draft: "#EF4444",
  skeleton: "#DC2626",
  raw: "#B91C1C",
  missing: "#7F1D1D",
};

export function checkitOgTemplate({
  host,
  score,
  band,
  bandLabel,
  bandTagline,
}: CheckitOGProps) {
  const bg = BAND_BG[band];
  return (
    <div
      style={{
        background: bg,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
        color: "#ffffff",
        position: "relative",
      }}
    >
      {/* Top: brand eyebrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 9999,
            background: "#ffffff",
            display: "flex",
          }}
        />
        <span
          style={{
            color: "rgba(255, 255, 255, 0.92)",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          northstar · checkit
        </span>
      </div>

      {/* Middle: big score + band label */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            color: "#ffffff",
            fontWeight: 800,
            letterSpacing: "-0.05em",
            lineHeight: 0.9,
          }}
        >
          <span style={{ fontSize: 280 }}>{score}</span>
          <span
            style={{
              fontSize: 56,
              opacity: 0.7,
              marginLeft: 12,
              fontWeight: 600,
            }}
          >
            /100
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingBottom: 24,
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1,
            }}
          >
            {bandLabel}
          </span>
          <span
            style={{
              fontSize: 26,
              color: "rgba(255, 255, 255, 0.85)",
              maxWidth: 540,
              lineHeight: 1.3,
            }}
          >
            {bandTagline}
          </span>
        </div>
      </div>

      {/* Bottom: host (left) + brand mark (right) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.75)",
            }}
          >
            Site scored
          </span>
          <span
            style={{
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#ffffff",
            }}
          >
            {host}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: "rgba(255, 255, 255, 0.75)",
              fontWeight: 500,
            }}
          >
            Score yours at
          </span>
          <span
            style={{
              fontSize: 26,
              color: "#ffffff",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            pmnorthstar.in/checkit
          </span>
        </div>
      </div>
    </div>
  );
}

// ── SimulateIt result share image ──────────────────────────────────────
//
// Score card for /simulate/[slug]/result?s=&m=&b=. Dark card with the
// SimulateIt hot-pink accent, a big performance-colored score, a row of
// G/Y/R decision squares (Wordle-style), and the drill title. The blocks
// are passed as a compact G/Y/R/W string because emoji don't survive URL
// params cleanly.

const SIM_BLOCK_COLOR: Record<string, string> = {
  G: "#22C55E", // best option
  Y: "#EAB308", // partial
  R: "#EF4444", // weak
  W: "#3F3F46", // neutral / non-scored
};

// Score color tracks the same bands as the in-app result screen.
function simScoreColor(pct: number): string {
  if (pct >= 0.85) return "#22C55E";
  if (pct >= 0.7) return "#4ADE80";
  if (pct >= 0.5) return "#EAB308";
  if (pct >= 0.3) return "#F97316";
  return "#EF4444";
}

function simVerdict(pct: number): string {
  if (pct >= 0.85) return "Founder-grade";
  if (pct >= 0.7) return "Strong call";
  if (pct >= 0.5) return "Solid instincts";
  if (pct >= 0.3) return "Played it safe";
  return "Wrong bet";
}

export interface SimulateOGProps {
  title: string; // drill title
  score: number;
  max: number;
  blocks: string; // compact "GGYRG" string, one char per decision
}

export function simulateOgTemplate({
  title,
  score,
  max,
  blocks,
}: SimulateOGProps) {
  const pct = max > 0 ? score / max : 0;
  const verdict = simVerdict(pct);
  const scoreColor = simScoreColor(pct);
  const squares = blocks.split("").slice(0, 14);
  return (
    <div
      style={{
        background: "#0A0A0F",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
        position: "relative",
      }}
    >
      {/* Hot-pink glow, top-right — the SimulateIt brand accent */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 380,
          height: 380,
          borderRadius: 9999,
          background: "rgba(219,39,119,0.22)",
          filter: "blur(90px)",
          display: "flex",
        }}
      />

      {/* Eyebrow */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, zIndex: 1 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 9999,
            background: "#DB2777",
            display: "flex",
          }}
        />
        <span
          style={{
            color: "#DB2777",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          northstar · simulateit
        </span>
      </div>

      {/* Middle: big score + verdict, then the decision squares */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: 26, zIndex: 1 }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              color: scoreColor,
            }}
          >
            <span style={{ fontSize: 240 }}>{score}</span>
            <span
              style={{
                fontSize: 52,
                opacity: 0.6,
                marginLeft: 10,
                fontWeight: 600,
                color: "#FFFFFF",
              }}
            >
              /{max}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingBottom: 28,
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: 52,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1,
                color: "#FFFFFF",
              }}
            >
              {verdict}
            </span>
            <span
              style={{
                fontSize: 24,
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.3,
              }}
            >
              on a real founder decision
            </span>
          </div>
        </div>

        {squares.length > 0 && (
          <div style={{ display: "flex", gap: 10 }}>
            {squares.map((c, i) => (
              <div
                key={i}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 8,
                  background: SIM_BLOCK_COLOR[c] || "#3F3F46",
                  display: "flex",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom: drill title (left) + CTA (right) */}
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
            display: "flex",
            flexDirection: "column",
            gap: 6,
            maxWidth: 680,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            The drill
          </span>
          <span
            style={{
              fontSize: title.length > 40 ? 34 : 42,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              lineHeight: 1.05,
            }}
          >
            {title}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 4,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.55)",
              fontWeight: 500,
            }}
          >
            Can you beat it?
          </span>
          <span
            style={{
              fontSize: 26,
              color: "#DB2777",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            pmnorthstar.in/simulate
          </span>
        </div>
      </div>
    </div>
  );
}

// Promo card for /checkit when there's no specific URL being shared
// (someone shares the bare /checkit page). Brand-red background.
export function checkitPromoTemplate() {
  return (
    <div
      style={{
        background: "#F3123C",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 9999,
            background: "#ffffff",
            display: "flex",
          }}
        />
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.92)",
          }}
        >
          northstar · checkit
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "#ffffff",
          }}
        >
          Is your site ready for the business world?
        </div>
        <div
          style={{
            fontSize: 32,
            color: "rgba(255, 255, 255, 0.9)",
            lineHeight: 1.3,
          }}
        >
          35 checks across performance, SEO, UX, brand, trust, polish & standards. Free.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "#ffffff",
          }}
        >
          pmnorthstar.in/checkit
        </span>
      </div>
    </div>
  );
}
