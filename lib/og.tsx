import { ImageResponse } from "next/og"
import { PROJECTS } from "@/lib/projects"

// Share images for project pages, in the same style as app/opengraph-image.tsx.
// Each case study's folder has a small opengraph-image.tsx that calls this.

export const OG_SIZE = { width: 1200, height: 630 }

export function projectOG(slug: string) {
  const p = PROJECTS.find((x) => x.slug === slug)
  if (!p) throw new Error(`No project "${slug}" in lib/projects.ts`)
  return pageOG(p.name, p.tagline, p.tech)
}

export function pageOG(title: string, tagline: string, tags: string[]) {
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
        <div style={{ display: "flex", color: "#555", fontSize: 18, marginBottom: 32, letterSpacing: "0.1em" }}>
          masonkimball.dev / projects
        </div>
        <div style={{ display: "flex", color: "#ffffff", fontSize: 68, fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
          {title}
        </div>
        <div style={{ display: "flex", color: "#888", fontSize: 30, lineHeight: 1.45, maxWidth: 960 }}>
          {tagline}
        </div>
        {tags.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginTop: 52 }}>
            {tags.slice(0, 5).map((tag) => (
              <div
                key={tag}
                style={{ display: "flex", color: "#666", fontSize: 16, padding: "6px 14px", border: "1px solid #333" }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", color: "#555", fontSize: 18, marginTop: 52 }}>Mason Kimball</div>
      </div>
    ),
    OG_SIZE
  )
}
