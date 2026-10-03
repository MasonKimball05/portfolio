import type { MetadataRoute } from "next"

export const dynamic = "force-static"

const ROUTES = ["", "/about", "/projects", "/projects/parliament", "/projects/job-tracker", "/projects/sentinel", "/projects/homebase", "/projects/media-player", "/projects/pq-census", "/projects/skirmish","/skills", "/contact"]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `https://masonkimball.dev${route}/`,
    lastModified: new Date(),
  }))
}
