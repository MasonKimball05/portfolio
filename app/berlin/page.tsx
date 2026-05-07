import type { Metadata } from "next"
import Link from "next/link"
import { getAllPosts } from "@/lib/berlin"

export const metadata: Metadata = {
  title: "Berlin — Mason Kimball",
  description: "Summer 2026 — language immersion at the Freie Universität Berlin. Photos and notes from the trip.",
}

export default function Berlin() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-24 space-y-10 sm:space-y-16">

        {/* Header */}
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">berlin</h1>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            Summer 2026 — language immersion at the Freie Universität Berlin. Photos and notes from the trip, posted as I go.
          </p>
        </section>

        {/* Posts or empty state */}
        {posts.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Journal</h2>
            <div className="border border-border divide-y divide-border">
              {posts.map((post) => (
                <PostRow key={post.slug} {...post} />
              ))}
            </div>
          </section>
        ) : (
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Journal</h2>
            <div className="border border-border border-l-4 border-l-green-500 px-6 py-5 space-y-3">
              <p className="text-sm font-medium">Nothing here yet — trip starts June 2026</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I'll be in Berlin for the summer doing language immersion at the Freie Universität.
                Photos, notes, and observations will show up here as I post them. Come back in June.
              </p>
              <p className="text-xs text-muted-foreground">
                — Mason
              </p>
            </div>
          </section>
        )}

      </main>
    </div>
  )
}

function PostRow({ slug, title, date, cover }: {
  slug: string
  title: string
  date: string
  cover: string
}) {
  const formatted = date
    ? new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : ""

  return (
    <Link
      href={`/berlin/${slug}`}
      className="flex items-center justify-between gap-6 px-4 py-4 hover:bg-muted transition-colors group"
    >
      <div className="flex items-center gap-4 min-w-0">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="w-12 h-12 object-cover flex-shrink-0 border border-border"
          />
        ) : (
          <div className="w-12 h-12 flex-shrink-0 border border-border bg-muted" />
        )}
        <p className="text-sm font-medium group-hover:underline truncate">{title}</p>
      </div>
      <span className="text-xs text-muted-foreground flex-shrink-0">{formatted}</span>
    </Link>
  )
}
