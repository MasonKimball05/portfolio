import { projectOG } from "@/lib/og"

export const dynamic = "force-static"
export const alt = "Media Player — Mason Kimball"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return projectOG("media-player")
}
