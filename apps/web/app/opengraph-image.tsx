import { ImageResponse } from "next/og";

import {
  OG_IMAGE_ALT,
  OG_IMAGE_SIZE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/constants";

export const alt = OG_IMAGE_ALT;
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#16181a",
        color: "#e7eaeb",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "80px",
        width: "100%",
      }}
    >
      <div
        style={{
          color: "#6b7280",
          fontSize: 28,
          letterSpacing: "0.02em",
        }}
      >
        blode.co/canvas-kit
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div
          style={{ fontSize: 120, fontWeight: 600, letterSpacing: "-0.03em" }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            color: "#9ca3af",
            fontSize: 36,
            lineHeight: 1.3,
            maxWidth: "900px",
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    </div>,
    { ...size }
  );
}
