import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Parliament — Mason Kimball",
  description: "The chapter management platform I built for Beta Theta Pi: voting, committees, events, pledge education, real-time chat, and a hardened security stack, in Django.",
  openGraph: { title: "Parliament — Mason Kimball", description: "The chapter management platform I built for Beta Theta Pi: voting, committees, events, pledge education, real-time chat, and a hardened security stack, in Django." },
}

export default function ParliamentLayout({ children }: { children: React.ReactNode }) {
  return children
}
