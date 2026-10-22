import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0e0d0b" }}>
        <svg width="130" height="130" viewBox="0 0 100 100" fill="none">
          <g stroke="#e8473e" strokeWidth="6" strokeLinecap="round">
            <path d="M37 26c-5-4 5-7 0-11s5-7 0-11" />
            <path d="M50 26c-5-4 5-7 0-11s5-7 0-11" />
            <path d="M63 26c-5-4 5-7 0-11s5-7 0-11" />
          </g>
          <rect x="14" y="33" width="72" height="9" rx="4.5" fill="#e8473e" />
          <path d="M21 41h58a29 25 0 0 1-58 0z" fill="#e8473e" />
          <g stroke="#e8473e" strokeWidth="8" strokeLinecap="round">
            <path d="M37 60 29 92" />
            <path d="M50 64v22" />
            <path d="M63 60l8 32" />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
