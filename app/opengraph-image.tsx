import { ImageResponse } from "next/og";

export const alt = "Organic Scales International · Global Fish Scale Exporter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(165deg, #0B1F2A 0%, #0E3A5B 100%)",
          padding: 64,
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 14,
            letterSpacing: "0.15em",
            color: "#3DB8B0",
          }}
        >
          OSI.EXPORT.PLATFORM · DHAKA, BD
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#F4F7F9",
            }}
          >
            <span style={{ color: "#1B8A8A" }}>Precision-Grade</span>
            <span>Fish Scale Supply.</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 22,
              color: "#A8BEC9",
              maxWidth: 600,
            }}
          >
            Export-grade fish scales for institutional B2B procurement worldwide.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 16, color: "#C4A35A" }}>
          organicscales.com
        </div>
      </div>
    ),
    { ...size }
  );
}
