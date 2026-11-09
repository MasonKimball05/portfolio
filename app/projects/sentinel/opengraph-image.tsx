import { projectOG } from "@/lib/og"

export const dynamic = "force-static"
export const alt = "Sentinel — Mason Kimball"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return projectOG("sentinel")
}
