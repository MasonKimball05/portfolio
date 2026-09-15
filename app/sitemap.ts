import type { MetadataRoute } from "next"

export const dynamic = "force-static"

const ROUTES = ["", "/about", "/projects", "/projects/parliament", "/skills", "/contact"]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `https://masonkimball.dev${route}`,
    lastModified: new Date(),
  }))
}
