import type { MetadataRoute } from "next"
import { CASE_STUDIES } from "@/lib/projects"

export const dynamic = "force-static"

// Case studies come from lib/projects.ts, so a new one is listed automatically.
const ROUTES = ["", "/about", "/projects", ...CASE_STUDIES.map((p) => `/projects/${p.slug}`), "/skills", "/contact"]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `https://masonkimball.dev${route}/`,
    lastModified: new Date(),
  }))
}
