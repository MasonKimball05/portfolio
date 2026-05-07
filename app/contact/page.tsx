"use client"

import { useState } from "react"

const LINKS = [
  {
    label: "Email",
    value: "mason.kimball@icloud.com",
    href: "mailto:mason.kimball@icloud.com",
    description: "Best way to reach me",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/mason-kimball2005",
    href: "https://www.linkedin.com/in/mason-kimball2005/",
    description: "Connect professionally",
    external: true,
  },
  {
    label: "GitHub",
    value: "github.com/MasonKimball05",
    href: "https://github.com/MasonKimball05",
    description: "Code and projects",
    external: true,
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className="text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
    >
      {copied ? "copied ✓" : "copy"}
    </button>
  )
}

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-24 space-y-10 sm:space-y-16">

        <section className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">contact</h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
            Feel free to reach out — whether it's about work, a project, or just to connect.
          </p>
        </section>

        <section className="space-y-3">
          {LINKS.map(({ label, value, href, description, external }) => (
            <div
              key={label}
              className="border border-border px-4 sm:px-6 py-4 flex items-center justify-between gap-4 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="text-sm font-medium hover:underline"
                  >
                    {label}
                  </a>
                  <span className="text-xs text-muted-foreground truncate">{value}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {label === "Email" && <CopyButton text={value} />}
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {external ? "open ↗" : "send →"}
                </a>
              </div>
            </div>
          ))}
        </section>

      </main>
    </div>
  )
}
