import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Parliament — Mason Kimball",
  description: "Chapter administration software for Beta Theta Pi — built with Django, PostgreSQL, and custom security middleware.",
  openGraph: { title: "Parliament — Mason Kimball", description: "Chapter administration software for Beta Theta Pi — built with Django, PostgreSQL, and custom security middleware." },
}

export default function ParliamentLayout({ children }: { children: React.ReactNode }) {
  return children
}
