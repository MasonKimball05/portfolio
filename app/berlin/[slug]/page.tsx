import { notFound } from "next/navigation"
import Link from "next/link"
import { MDXRemote } from "next-mdx-remote/rsc"
import { getAllPosts, getPost } from "@/lib/berlin"

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export default async function BerlinPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const formatted = post.date
    ? new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : ""

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-24 space-y-12">

        {/* Back */}
        <Link
          href="/berlin"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← berlin
        </Link>

        {/* Header */}
        <section className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
          {formatted && <p className="text-sm text-muted-foreground">{formatted}</p>}
        </section>

        {/* Cover photo */}
        {post.cover && (
          <img
            src={post.cover}
            alt={post.title}
            className="w-full border border-border object-cover max-h-[480px]"
          />
        )}

        {/* Body */}
        <article className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
          <MDXRemote source={post.content} />
        </article>

        {/* Photo grid */}
        {post.photos.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Photos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-border">
              {post.photos.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-full aspect-square object-cover bg-muted"
                />
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  )
}
