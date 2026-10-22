import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0e0d0b" }}>
        <div
          style={{
            width: 124,
            height: 124,
            borderRadius: 999,
            border: "4px solid #d8a446",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f4ecdc",
            fontSize: 76,
            fontStyle: "italic",
            fontFamily: "serif",
          }}
        >
          D
        </div>
      </div>
    ),
    size,
  );
}
