import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT =
  "PaintForge — Robotic painting for GTA contractors. 2026 pilot program.";

// Shared social-card renderer used by both the Open Graph and Twitter routes.
// Kept in one place so the two cards can never drift apart.
export function renderOgCard() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #0A2540 0%, #0D2B4A 55%, #081C33 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#0A2540",
              border: "2px solid rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: -2,
            }}
          >
            PF
          </div>
          <div
            style={{
              color: "#ffffff",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            PaintForge
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#FF6B35",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            In development · GTA pilot program · 2026
          </div>
          <div
            style={{
              color: "#ffffff",
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -3,
              maxWidth: 900,
            }}
          >
            Robotic Painting, Built for Contractors Who Finish First.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 48,
            color: "rgba(255,255,255,0.82)",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: "#FF6B35", fontWeight: 700 }}>4×</span>
            <span>target crew output</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: "#FF6B35", fontWeight: 700 }}>±2 mil</span>
            <span>thickness target</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: "#FF6B35", fontWeight: 700 }}>0</span>
            <span>capex · RaaS</span>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
