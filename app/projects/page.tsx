import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects — Mason Kimball",
  description: "A collection of projects I've built — from fraternity admin software to personal tools.",
  openGraph: { title: "Projects — Mason Kimball", description: "A collection of projects I've built — from fraternity admin software to personal tools." },
}

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  fork: boolean
  pushed_at: string
  stargazers_count: number
}

interface RepoWithLanguages extends GitHubRepo {
  languages: string[]
}

async function getLanguages(name: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/MasonKimball05/${name}/languages`,
      { cache: "force-cache" }
    )
    if (!res.ok) return []
    const data: Record<string, number> = await res.json()
    return Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([lang]) => lang)
  } catch {
    return []
  }
}

async function getRepos(): Promise<RepoWithLanguages[]> {
  try {
    const res = await fetch(
      "https://api.github.com/users/MasonKimball05/repos?sort=pushed&per_page=100",
      { cache: "force-cache" }
    )
    if (!res.ok) return []
    const repos: GitHubRepo[] = await res.json()
    const filtered = repos.filter((r) => !r.fork)

    const withLanguages = await Promise.all(
      filtered.map(async (repo) => ({
        ...repo,
        languages: await getLanguages(repo.name),
      }))
    )
    return withLanguages
  } catch {
    return []
  }
}

import { LangDot } from "@/components/lang-dot"
import { ProjectBrowser } from "@/components/project-browser"
import { SectionLabel } from "@/components/section-label"
import { PROJECTS } from "@/lib/projects"

const LISTED_REPOS = new Set(PROJECTS.map((p) => p.repo.toLowerCase()))

export default async function Projects() {
  const repos = await getRepos()
  const otherRepos = repos.filter((r) => !LISTED_REPOS.has(r.name.toLowerCase()))

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-24 space-y-10 sm:space-y-16">

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">projects</h1>
          <p className="text-sm text-muted-foreground">
            Things I&apos;ve built, most with a write-up of how they work and what was hard. Filter by what you&apos;re interested in.
          </p>
        </div>

        <section className="space-y-4">
          <SectionLabel>Featured</SectionLabel>
          <ProjectBrowser projects={PROJECTS} />
        </section>

        {/* Everything else on GitHub, folded away so the page doesn't run on. */}
        <section className="space-y-4">
          <SectionLabel>More on GitHub</SectionLabel>
          {otherRepos.length > 0 ? (
            <details className="group border border-border">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm text-muted-foreground hover:bg-muted transition-colors flex items-center justify-between">
                <span>{otherRepos.length} more repositories: coursework, experiments and older projects</span>
                <span className="text-xs transition-transform group-open:rotate-90">▸</span>
              </summary>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border-t border-border">
                {otherRepos.map((repo) => (
                  <RepoCard key={repo.id} {...repo} />
                ))}
              </div>
            </details>
          ) : (
            <p className="text-sm text-muted-foreground">Could not load repositories.</p>
          )}
        </section>

      </main>
    </div>
  )
}

function RepoCard({ name, description, languages, html_url, pushed_at, stargazers_count }: RepoWithLanguages) {
  const date = new Date(pushed_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })

  return (
    <a
      href={html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-background flex flex-col gap-3 px-4 py-4 transition-colors group min-h-[100px] hover:bg-muted hover:shadow-[inset_2px_0_0_0_var(--color-primary)]"
    >
      <p className="text-sm font-medium group-hover:underline">{name}</p>
      {description && (
        <p className="text-xs text-muted-foreground leading-relaxed flex-1">{description}</p>
      )}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="flex gap-3 flex-wrap">
          {languages.map((lang) => (
            <LangDot key={lang} lang={lang} />
          ))}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {stargazers_count > 0 && (
            <span className="text-xs text-muted-foreground">★ {stargazers_count}</span>
          )}
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
      </div>
    </a>
  )
}
