import fs from "fs"
import path from "path"
import matter from "gray-matter"

const BERLIN_DIR = path.join(process.cwd(), "content/berlin")

export interface PostMeta {
  slug: string
  title: string
  date: string
  cover: string
}

export interface Post extends PostMeta {
  photos: string[]
  content: string
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BERLIN_DIR)) return []

  return fs
    .readdirSync(BERLIN_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "")
      const raw = fs.readFileSync(path.join(BERLIN_DIR, filename), "utf8")
      const { data } = matter(raw)
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ? new Date(data.date).toISOString() : "",
        cover: data.cover ?? "",
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(slug: string): Post | null {
  const filepath = path.join(BERLIN_DIR, `${slug}.md`)
  if (!fs.existsSync(filepath)) return null

  const raw = fs.readFileSync(filepath, "utf8")
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? new Date(data.date).toISOString() : "",
    cover: data.cover ?? "",
    photos: data.photos ?? [],
    content,
  }
}
