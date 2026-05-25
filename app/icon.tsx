import { ImageResponse } from "next/og";

// Dynamic 32x32 PNG favicon rendered at request time. Google's SERP
// favicon crawler ignores data: URLs, so the old inline SVG in
// app/layout.tsx never showed up next to "pmnorthstar.in" in search
// results. By putting this at app/icon.tsx, Next.js auto-routes it to
// /icon and adds the right <link rel="icon"> tag in <head>.

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F3123C",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M12 2 L14.7 9.1 L22 9.6 L16.3 14.2 L18.2 21.4 L12 17.5 L5.8 21.4 L7.7 14.2 L2 9.6 L9.3 9.1 Z" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
