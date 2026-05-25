import { ImageResponse } from "next/og";

// 180x180 apple touch icon for iOS home-screen installs and any
// platform that prefers a larger icon over the SERP 32x32. Same
// design language as app/icon.tsx, just scaled.

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F3123C",
          borderRadius: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 24 24" fill="white">
          <path d="M12 2 L14.7 9.1 L22 9.6 L16.3 14.2 L18.2 21.4 L12 17.5 L5.8 21.4 L7.7 14.2 L2 9.6 L9.3 9.1 Z" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
