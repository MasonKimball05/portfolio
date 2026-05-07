import type { Metadata } from "next"
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr"

export const metadata: Metadata = {
  title: "Skills — Mason Kimball",
  description: "Languages, frameworks, tools, and certifications.",
}
import Script from "next/script"

const SKILLS = [
  {
    category: "Languages",
    dot: "bg-blue-500",
    items: ["Python", "C", "SQL", "TypeScript", "Swift"],
  },
  {
    category: "Frameworks & Libraries",
    dot: "bg-violet-500",
    items: ["Django", "Next.js", "PyQt5", "Tailwind CSS"],
  },
  {
    category: "Tools & Infrastructure",
    dot: "bg-slate-400",
    items: ["PostgreSQL", "Git", "Linux", "GitHub Actions"],
  },
  {
    category: "Areas",
    dot: "bg-green-500",
    items: ["Cyber Security", "Web Application Security", "Relational Database Design", "REST APIs"],
  },
]

export default function Skills() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-24 space-y-10 sm:space-y-16">

        <h1 className="text-3xl font-semibold tracking-tight">skills</h1>

        {/* Skill groups */}
        <section className="space-y-10">
          {SKILLS.map(({ category, dot, items }) => (
            <div key={category} className="space-y-3">
              <h2 className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                <span className={`w-2 h-2 flex-shrink-0 ${dot}`} />
                {category}
              </h2>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm border border-border px-3 py-1.5 text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Certifications */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="w-2 h-2 flex-shrink-0 bg-green-500" />
            Certifications
          </h2>
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
          <div
            data-iframe-width="290"
            data-iframe-height="240"
            data-share-badge-id="272c81a8-8efa-4cbe-94b3-ba5e033d8ba3"
            data-share-badge-host="https://www.credly.com"
          />
          <Script src="//cdn.credly.com/assets/utilities/embed.js" strategy="lazyOnload" />
        </section>

      </main>
    </div>
  )
}
