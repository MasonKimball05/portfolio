import { pageOG } from "@/lib/og"

export const dynamic = "force-static"
export const alt = "How it fits together — Mason Kimball"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return pageOG("How it fits together", "The apps I've built, where they run, and how they talk to each other", [])
}
