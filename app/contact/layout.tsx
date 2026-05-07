import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact — Mason Kimball",
  description: "Get in touch — email, LinkedIn, or GitHub.",
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
