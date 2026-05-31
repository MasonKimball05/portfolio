import type { Metadata } from "next"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Mason Kimball",
  description: "CS student at Samford University. I build web apps, sometimes for my fraternity chapter.",
}
import { ThemeToggle } from "@/components/theme-toggle"
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr"
import { LangDot } from "@/components/lang-dot"
import Link from "next/link"

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  fork: boolean
  pushed_at: string
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
      "https://api.github.com/users/MasonKimball05/repos?sort=pushed&per_page=10",
      { cache: "force-cache" }
    )
    if (!res.ok) return []
    const repos: GitHubRepo[] = await res.json()
    const filtered = repos.filter((r) => !r.fork).slice(0, 6)

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

export default async function Home() {
  const repos = await getRepos()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* Main */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-24 space-y-14 sm:space-y-24">

        {/* Hero */}
        <section className="space-y-4">
          <p className="text-sm text-muted-foreground">hi, i'm</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Mason Kimball</h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            CS student at Samford University, concentrating in Cyber Security, with a minor in German.
            I like to build things — mostly web apps, sometimes for my fraternity chapter.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <a href="https://github.com/MasonKimball05" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/about">About me</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </section>

        {/* Projects */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Recent Projects</h2>
          {repos.length > 0 ? (
            <div className="border border-border divide-y divide-border">
              {repos.map((repo) => (
                <ProjectRow
                  key={repo.id}
                  name={repo.name}
                  description={repo.description}
                  languages={repo.languages}
                  href={repo.html_url}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Could not load repositories.</p>
          )}
          <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            all projects →
          </Link>
        </section>

        {/* Skills */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Skills</h2>

          {/* Certification */}
          <a
            href="https://www.credly.com/badges/272c81a8-8efa-4cbe-94b3-ba5e033d8ba3/public_url"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between border border-border px-4 py-3 hover:bg-muted transition-colors group"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck size={28} className="text-green-500 flex-shrink-0" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium group-hover:underline">Certified in Cybersecurity (CC)</p>
                <p className="text-xs text-muted-foreground">ISC2 · Verified</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">verify →</span>
          </a>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {["Python", "Django", "PostgreSQL", "C", "SQL", "Git", "TypeScript", "Next.js", "Swift", "PyQt5", "Cyber Security"].map((skill) => (
              <span key={skill} className="text-xs border border-border px-2 py-1 text-muted-foreground">
                {skill}
              </span>
            ))}
          </div>

          <Link href="/skills" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            more →
          </Link>
        </section>

        {/* Berlin */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Berlin — Summer 2026</h2>
          <p className="text-muted-foreground leading-relaxed">
            Spending the summer at the Freie Universität in Berlin for language immersion. I'll be posting photos and notes here along the way.
          </p>
          <Link href="/berlin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            view journal →
          </Link>
        </section>

      </main>

    </div>
  )
}

function ProjectRow({
  name,
  description,
  languages,
  href,
}: {
  name: string
  description: string | null
  languages: string[]
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start justify-between gap-3 sm:gap-6 px-4 py-4 hover:bg-muted transition-colors group"
    >
      <div className="space-y-1 min-w-0">
        <p className="text-sm font-medium group-hover:underline">{name}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {languages.length > 0 && (
        <div className="flex gap-3 flex-shrink-0 pt-0.5">
          {languages.map((lang) => (
            <LangDot key={lang} lang={lang} />
          ))}
        </div>
      )}
    </a>
  )
}
