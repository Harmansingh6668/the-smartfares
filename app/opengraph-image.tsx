import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "SmartFares Hub";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #EEF5FF 0%, #FFFFFF 55%, #FFE9DD 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 88,
              height: 88,
              borderRadius: 24,
              background: "#1C3EF0",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              color: "white",
              fontWeight: 800,
            }}
          >
            %
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, color: "#0F172A" }}>{siteName}</div>
        </div>
        <div style={{ marginTop: 28, fontSize: 32, color: "#475569" }}>
          Verified Coupons &amp; Promo Codes that actually work
        </div>
      </div>
    ),
    { ...size }
  );
}
