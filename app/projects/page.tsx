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

import { LANG_COLORS } from "@/lib/lang-colors"
import { LangDot } from "@/components/lang-dot"

const STATUS_STYLES: Record<string, string> = {
  "Active": "text-green-500 border-green-500/40",
  "In Progress": "text-amber-500 border-amber-500/40",
  "Archived": "text-muted-foreground border-border",
}

const FEATURED = [
  {
    name: "Parliament",
    tagline: "Chapter administration software for Beta Theta Pi",
    highlights: [
      "Used by ~60 active members to manage legislation, officer elections, service hours, attendance, and conduct reports",
      "Custom security middleware: rate limiting, 2FA (TOTP), field-level encryption, geolocation, and attack detection",
      "Built and maintained solo — currently hardening for handoff to future leadership before I graduate",
    ],
    tech: ["Python", "Django", "PostgreSQL", "Tailwind CSS", "Alpine.js"],
    href: "https://github.com/MasonKimball05/Parliament-New",
    status: "Active",
    accent: "border-l-blue-500",
  },
  {
    name: "Portfolio",
    tagline: "This site",
    highlights: [
      "Static Next.js 14 site deployed to GitHub Pages via static export",
      "Dynamic GitHub repo fetching with per-repo language breakdowns via the GitHub API",
      "Markdown-based journal system for the Berlin trip this summer",
    ],
    tech: ["TypeScript", "Next.js", "Tailwind CSS", "shadcn/ui"],
    href: "https://github.com/MasonKimball05/portfolio",
    status: "Active",
    accent: "border-l-violet-500",
  },
  {
    name: "PythonBrowser",
    tagline: "Custom browser built with PyQt5",
    highlights: [
      "Tabbed browsing with QtWebEngine for full web rendering",
      "Built to explore Qt's signals/slots system and desktop GUI development in Python",
    ],
    tech: ["Python", "PyQt5", "QtWebEngine"],
    href: "https://github.com/MasonKimball05/PythonBrowser",
    status: "In Progress",
    accent: "border-l-amber-500",
  },
]

const FEATURED_NAMES = new Set(FEATURED.map((p) => p.name.toLowerCase()))

export default async function Projects() {
  const repos = await getRepos()
  const otherRepos = repos.filter((r) => !FEATURED_NAMES.has(r.name.toLowerCase()))

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-24 space-y-16">

        <h1 className="text-3xl font-semibold tracking-tight">projects</h1>

        {/* Featured */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Featured</h2>
          <div className="space-y-4">
            {FEATURED.map((project) => (
              <FeaturedCard key={project.name} {...project} />
            ))}
          </div>
        </section>

        {/* All from GitHub */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">All Projects</h2>
          {otherRepos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
              {otherRepos.map((repo) => (
                <RepoCard key={repo.id} {...repo} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Could not load repositories.</p>
          )}
        </section>

      </main>
    </div>
  )
}


function FeaturedCard({
  name,
  tagline,
  highlights,
  tech,
  href,
  status,
  accent,
}: {
  name: string
  tagline: string
  highlights: string[]
  tech: string[]
  href: string
  status: string
  accent: string
}) {
  const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES["Archived"]

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`block border border-border border-l-4 ${accent} px-6 py-5 hover:bg-muted transition-colors group space-y-4`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium group-hover:underline">{name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{tagline}</p>
        </div>
        <span className={`text-xs border px-2 py-0.5 flex-shrink-0 ${statusStyle}`}>
          {status}
        </span>
      </div>
      <ul className="space-y-1.5">
        {highlights.map((h) => (
          <li key={h} className="text-sm text-muted-foreground flex gap-2.5">
            <span className="flex-shrink-0 select-none">—</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5">
        {tech.map((t) => (
          <span key={t} className="flex items-center gap-1.5 text-xs border border-border px-2 py-0.5 text-muted-foreground">
            <span className={`w-1.5 h-1.5 flex-shrink-0 ${LANG_COLORS[t] ?? "bg-slate-500"}`} />
            {t}
          </span>
        ))}
      </div>
    </a>
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
      className="bg-background flex flex-col gap-3 px-4 py-4 hover:bg-muted transition-colors group min-h-[100px]"
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
