import Image from "next/image"
import Link from "next/link"

// Building blocks for project case-study pages, styled to match
// /projects/parliament. All server components: no client JS needed.

export function CaseStudyShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-24 space-y-8 sm:space-y-12">
        <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← projects
        </Link>
        {children}
      </main>
    </div>
  )
}

export function CaseStudyHeader({
  title,
  tagline,
  tech,
  links,
}: {
  title: string
  tagline: string
  tech: string[]
  links: { label: string; href: string; primary?: boolean }[]
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{tagline}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tech.map((t) => (
          <span key={t} className="text-xs border border-border px-2 py-0.5 text-muted-foreground">
            {t}
          </span>
        ))}
      </div>
      {links.length > 0 && (
      <div className="flex gap-3">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs border border-border px-3 py-1.5 hover:bg-muted transition-colors ${l.primary ? "" : "text-muted-foreground"}`}
          >
            {l.label} ↗
          </a>
        ))}
      </div>
      )}
    </section>
  )
}

export function Intro({ accent, children }: { accent: string; children: React.ReactNode }) {
  return <section className={`space-y-3 border-l-4 ${accent} pl-5`}>{children}</section>
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-1">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border">
      {items.map((s) => (
        <div key={s.label} className="bg-background px-4 py-4 text-center space-y-1">
          <p className="text-lg font-semibold">{s.value}</p>
          <p className="text-xs text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

export function DashList({ title, items }: { title?: string; items: React.ReactNode[] }) {
  return (
    <div className="space-y-3">
      {title && <h3 className="text-sm font-medium">{title}</h3>}
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2.5">
            <span className="flex-shrink-0 select-none">—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Stories({ title, stories }: { title: string; stories: { title: string; body: React.ReactNode }[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="border border-border divide-y divide-border">
        {stories.map((s) => (
          <div key={s.title} className="px-4 sm:px-6 py-4 space-y-1.5">
            <p className="text-sm font-medium">{s.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/** A screenshot with an optional dark-mode variant that follows the site's theme toggle. */
export function Screenshot({
  src,
  darkSrc,
  alt,
  width,
  height,
  caption,
}: {
  src: string
  darkSrc?: string
  alt: string
  width: number
  height: number
  caption?: string
}) {
  const cls = "w-full h-auto border border-border"
  return (
    <figure className="space-y-2">
      <Image src={src} alt={alt} width={width} height={height} className={`${cls} ${darkSrc ? "dark:hidden" : ""}`} />
      {darkSrc && (
        <Image src={darkSrc} alt={alt} width={width} height={height} className={`${cls} hidden dark:block`} />
      )}
      {caption && <figcaption className="text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  )
}

/** Terminal-style output block. */
export function Terminal({ children }: { children: string }) {
  return (
    <pre className="text-xs leading-relaxed border border-border bg-muted/40 px-4 py-3 overflow-x-auto">
      <code>{children}</code>
    </pre>
  )
}
