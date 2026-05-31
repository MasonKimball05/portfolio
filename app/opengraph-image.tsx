import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Mason Kimball"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          backgroundColor: "#0a0a0a",
          fontFamily: "monospace",
        }}
      >
        {/* Top label */}
        <div style={{ display: "flex", color: "#555", fontSize: 18, marginBottom: 32, letterSpacing: "0.1em" }}>
          masonkimball.dev
        </div>

        {/* Name */}
        <div style={{ display: "flex", color: "#ffffff", fontSize: 72, fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
          Mason Kimball
        </div>

        {/* Description */}
        <div style={{ display: "flex", color: "#888", fontSize: 28, lineHeight: 1.5, maxWidth: 800 }}>
          CS student at Samford University · Cyber Security · I build web apps, sometimes for my fraternity chapter.
        </div>

        {/* Bottom tags */}
        <div style={{ display: "flex", gap: 12, marginTop: 52 }}>
          {["Python", "Django", "Next.js", "TypeScript", "PostgreSQL"].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                color: "#666",
                fontSize: 16,
                padding: "6px 14px",
                border: "1px solid #333",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  )
}
