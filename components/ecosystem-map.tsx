'use client'

import Link from "next/link"
import { useState } from "react"
import { APPS, CONNECTIONS, PLACES, type App, type Connection } from "@/lib/ecosystem"
import { PROJECTS, projectLink } from "@/lib/projects"

const BY_ID = new Map(APPS.map((a) => [a.id, a]))

/**
 * Where each app runs, as four boxes of chips. Picking an app lights up what it
 * talks to and lists those connections; with nothing picked, every connection
 * is listed by the app that makes it.
 */
export function EcosystemMap() {
  const [selected, setSelected] = useState<string | null>(null)
  const linked = new Set<string>()
  if (selected) {
    for (const c of CONNECTIONS) {
      if (c.from === selected) linked.add(c.to)
      if (c.to === selected) linked.add(c.from)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
        {PLACES.map((place) => (
          <div key={place.id} className="bg-background px-4 py-4 space-y-3">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{place.name}</p>
              {place.note && <p className="text-xs text-muted-foreground">{place.note}</p>}
            </div>
            <div role="group" aria-label={place.name} className="flex flex-wrap gap-1.5">
              {APPS.filter((a) => a.place === place.id).map((app) => (
                <AppChip
                  key={app.id}
                  app={app}
                  state={!selected ? "idle" : app.id === selected ? "selected" : linked.has(app.id) ? "linked" : "dim"}
                  onClick={() => setSelected(selected === app.id ? null : app.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected ? <Selected app={BY_ID.get(selected)!} onClear={() => setSelected(null)} /> : <All />}
    </div>
  )
}

function AppChip({ app, state, onClick }: { app: App; state: "idle" | "selected" | "linked" | "dim"; onClick: () => void }) {
  const styles = {
    idle: "border-border text-foreground hover:bg-muted",
    selected: "border-foreground bg-muted text-foreground",
    linked: "border-primary text-foreground",
    dim: "border-border text-muted-foreground opacity-50 hover:opacity-100",
  }[state]
  return (
    <button
      type="button"
      aria-pressed={state === "selected"}
      onClick={onClick}
      title={app.what}
      className={`text-xs border px-2.5 py-1 transition-colors ${styles}`}
    >
      {app.name}
    </button>
  )
}

function Selected({ app, onClear }: { app: App; onClear: () => void }) {
  const uses = CONNECTIONS.filter((c) => c.from === app.id)
  const usedBy = CONNECTIONS.filter((c) => c.to === app.id)
  const project = app.slug ? PROJECTS.find((p) => p.slug === app.slug) : undefined

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">{app.name}</p>
          <p className="text-xs text-muted-foreground">{app.what}</p>
        </div>
        <div className="flex gap-3 text-xs">
          {project && <ProjectLink project={project} />}
          <button type="button" onClick={onClear} className="text-muted-foreground hover:text-foreground transition-colors">
            Show all
          </button>
        </div>
      </div>
      {uses.length > 0 && <ConnectionList title={`${app.name} uses`} items={uses} show="to" />}
      {usedBy.length > 0 && <ConnectionList title={`Used by`} items={usedBy} show="from" />}
    </div>
  )
}

function ProjectLink({ project }: { project: (typeof PROJECTS)[number] }) {
  const href = projectLink(project)
  const cls = "text-muted-foreground hover:text-foreground transition-colors"
  if (project.caseStudy) return <Link href={href} className={cls}>Case study →</Link>
  return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>Project ↗</a>
}

function All() {
  const sources = APPS.filter((a) => CONNECTIONS.some((c) => c.from === a.id))
  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground">Pick an app to see only what it talks to.</p>
      {sources.map((a) => (
        <ConnectionList key={a.id} title={a.name} items={CONNECTIONS.filter((c) => c.from === a.id)} show="to" />
      ))}
    </div>
  )
}

function ConnectionList({ title, items, show }: { title: string; items: Connection[]; show: "to" | "from" }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground">{title}</h3>
      <ul className="border border-border divide-y divide-border">
        {items.map((c) => (
          <li key={`${c.from}-${c.to}`} className="px-4 py-3 space-y-1">
            <p className="text-sm">
              <span className="font-medium">{show === "to" ? `→ ${BY_ID.get(c.to)!.name}` : `${BY_ID.get(c.from)!.name} →`}</span>
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.what}</p>
            <p className="text-xs text-muted-foreground font-mono">{c.how}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
