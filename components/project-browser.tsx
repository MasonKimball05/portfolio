'use client'

import Link from "next/link"
import { useState } from "react"
import { LANG_COLORS } from "@/lib/lang-colors"
import { CATEGORIES, projectLink, type Category, type Project } from "@/lib/projects"

const STATUS_STYLES: Record<string, string> = {
  "Active": "text-green-700 dark:text-green-300 bg-green-500/10 border-green-500/30",
  "In Progress": "text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30",
  "In Development": "text-sky-700 dark:text-sky-300 bg-sky-500/10 border-sky-500/30",
  "Archived": "text-muted-foreground bg-muted border-border",
}

/**
 * The projects page's grid: filter chips by category, pinned projects as wide
 * cards with their highlights, the rest as compact cards two to a row. With a
 * filter on, everything matching shows compact, so the list stays short.
 */
export function ProjectBrowser({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Category | null>(null)
  // Only categories some project actually has, so no chip leads nowhere.
  const used = CATEGORIES.filter((c) => projects.some((p) => p.categories.includes(c)))
  const shown = filter ? projects.filter((p) => p.categories.includes(filter)) : projects
  const pinned = filter ? [] : shown.filter((p) => p.pinned)
  const rest = filter ? shown : shown.filter((p) => !p.pinned)

  return (
    <div className="space-y-6">
      <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-1.5">
        <Chip active={filter === null} onClick={() => setFilter(null)}>
          All <span className="text-muted-foreground">{projects.length}</span>
        </Chip>
        {used.map((c) => (
          <Chip key={c} active={filter === c} onClick={() => setFilter(filter === c ? null : c)}>
            {c} <span className="text-muted-foreground">{projects.filter((p) => p.categories.includes(c)).length}</span>
          </Chip>
        ))}
      </div>

      {pinned.length > 0 && (
        <div className="space-y-3">
          {pinned.map((p) => <PinnedCard key={p.slug} project={p} />)}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rest.map((p) => <CompactCard key={p.slug} project={p} />)}
      </div>
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`text-xs border px-2.5 py-1 transition-colors ${
        active ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  )
}

function CardLink({ project, className, children }: { project: Project; className: string; children: React.ReactNode }) {
  const href = projectLink(project)
  if (project.caseStudy) return <Link href={href} className={className}>{children}</Link>
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
}

function Status({ status }: { status: string }) {
  return (
    <span className={`text-xs border px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_STYLES[status] ?? STATUS_STYLES["Archived"]}`}>
      {status}
    </span>
  )
}

function Tech({ tech }: { tech: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tech.map((t) => (
        <span key={t} className="flex items-center gap-1.5 text-xs border border-border rounded-md px-2 py-0.5 text-muted-foreground">
          <span className={`w-1.5 h-1.5 flex-shrink-0 ${LANG_COLORS[t] ?? "bg-slate-500"}`} />
          {t}
        </span>
      ))}
    </div>
  )
}

/** "Case study →" for a page here, "GitHub ↗" or the site's name for a link out. */
function Destination({ project }: { project: Project }) {
  if (project.caseStudy) return <span className="text-xs text-primary whitespace-nowrap">Case study →</span>
  const host = projectLink(project).includes("github.com") ? "GitHub" : "Live site"
  return <span className="text-xs text-muted-foreground whitespace-nowrap">{host} ↗</span>
}

const cardBase = "block border border-border rounded-lg border-l-4 hover:bg-muted hover:shadow-md hover:shadow-primary/5 transition-all group"

function PinnedCard({ project }: { project: Project }) {
  return (
    <CardLink project={project} className={`${cardBase} ${project.accent} px-6 py-5 space-y-4`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium group-hover:underline">{project.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{project.tagline}</p>
        </div>
        <Status status={project.status} />
      </div>
      <ul className="space-y-1.5">
        {project.highlights.map((h, i) => (
          // A phone gets the first highlight only; the case study has the rest.
          <li key={h} className={`text-sm text-muted-foreground gap-2.5 ${i === 0 ? "flex" : "hidden sm:flex"}`}>
            <span className="flex-shrink-0 select-none">—</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
        <Tech tech={project.tech} />
        <Destination project={project} />
      </div>
    </CardLink>
  )
}

function CompactCard({ project }: { project: Project }) {
  return (
    <CardLink project={project} className={`${cardBase} ${project.accent} px-4 py-4 flex flex-col gap-3`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium group-hover:underline">{project.name}</p>
        <Status status={project.status} />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed flex-1">{project.tagline}</p>
      <Tech tech={project.tech.slice(0, 3)} />
      <Destination project={project} />
    </CardLink>
  )
}
