"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { FormEvent, KeyboardEvent } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { TerminalTitleBar } from "@/components/terminal-window"

type OutputLine = { type: "output" | "error"; text: string }
// `command: null` marks a system block (e.g. the boot sequence) that isn't a
// response to anything the visitor typed, so it renders without a "$" line.
type Entry = { id: number; command: string | null; lines: OutputLine[] }

const ROUTES: Record<string, string> = {
  "": "/",
  "~": "/",
  "/": "/",
  "home": "/",
  "about": "/about",
  "projects": "/projects",
  "projects/parliament": "/projects/parliament",
  "parliament": "/projects/parliament",
  "skills": "/skills",
  "contact": "/contact",
}

const LS_OUTPUT = "about/  contact/  projects/  projects/parliament  skills/"

const HELP_TEXT = [
  "available commands:",
  "  ls              list pages you can visit",
  "  cd <page>       go to a page (e.g. cd about, cd projects/parliament)",
  "  cd ..           go up one level",
  "  pwd             print the current page path",
  "  whoami          about the person who built this",
  "  cat <file>      read a file (try: cat resume.pdf, cat about.md)",
  "  git log         recent commits from github.com/MasonKimball05",
  "  theme [mode]    set the theme (light, dark, system) — no arg toggles",
  "  clear           clear the terminal",
  "  help            show this message",
  "",
  "tip: press ` (backtick) to toggle this terminal, ↑/↓ to recall commands",
].join("\n")

const BOOT_LINES = [
  "booting portfolio-terminal v1.0.0...",
  "[ok] loading resume.pdf",
  "[ok] mounting /about /projects /skills /contact",
  "[ok] uplink to github.com/MasonKimball05 established",
  "[ok] permission check: you are not root",
  "ready. type 'help' to see what's available.",
]

interface GitHubPushEvent {
  type: string
  repo?: { name?: string }
  payload?: { commits?: { sha?: string; message?: string }[] }
}

async function fetchGitLog(): Promise<string> {
  try {
    const res = await fetch("https://api.github.com/users/MasonKimball05/events/public?per_page=30")
    if (!res.ok) return "git: could not reach GitHub (rate limited or offline)"
    const events: GitHubPushEvent[] = await res.json()
    const commits: string[] = []
    for (const ev of events) {
      if (ev.type !== "PushEvent") continue
      const repo = ev.repo?.name?.split("/")?.[1] ?? "?"
      for (const c of ev.payload?.commits ?? []) {
        const sha = (c.sha ?? "").slice(0, 7)
        const message = (c.message ?? "").split("\n")[0]
        commits.push(`${sha}  ${message}  (${repo})`)
        if (commits.length >= 8) break
      }
      if (commits.length >= 8) break
    }
    return commits.length > 0 ? commits.join("\n") : "no recent public commits found"
  } catch {
    return "git: network error fetching commit log"
  }
}

const STORAGE_KEY = "portfolio-terminal-state-v3"

type PersistedState = { entries: Entry[]; open: boolean; booted: boolean }

function loadState(): PersistedState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { entries: [], open: false, booted: false }
    const parsed = JSON.parse(raw)
    return {
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      open: !!parsed.open,
      booted: !!parsed.booted,
    }
  } catch {
    return { entries: [], open: false, booted: false }
  }
}

function saveState(state: PersistedState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // private browsing / storage disabled — degrade silently
  }
}

export function TerminalPopup() {
  const [open, setOpen] = useState(false)
  const [booted, setBooted] = useState(false)
  const [entries, setEntries] = useState<Entry[]>([])
  const [input, setInput] = useState("")
  const [commandLog, setCommandLog] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const hydrated = useRef(false)
  const nextId = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  // Hydrate from sessionStorage once (covers a full page reload — client-side
  // nav between pages already survives via this component staying mounted in
  // the root layout, so this is purely a reload safety net).
  useEffect(() => {
    const state = loadState()
    setEntries(state.entries)
    setOpen(state.open)
    setBooted(state.booted)
    nextId.current = state.entries.reduce((max, e) => Math.max(max, e.id), -1) + 1
    hydrated.current = true
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    saveState({ entries, open, booted })
  }, [entries, open, booted])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [entries, open])

  // Global backtick shortcut opens the terminal when it's closed
  useEffect(() => {
    if (open) return
    const handler = (e: globalThis.KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName
      if (e.key === "`" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open])

  // One-time boot sequence the first time the terminal opens in a session.
  // Rendered as a single system entry (no "$" line) that fills in progressively.
  useEffect(() => {
    if (!hydrated.current || !open || booted) return

    const bootId = nextId.current++
    setEntries((prev) => [...prev, { id: bootId, command: null, lines: [] }])

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEntries((prev) =>
        prev.map((e) => (e.id === bootId ? { ...e, lines: BOOT_LINES.map((text) => ({ type: "output" as const, text })) } : e))
      )
      setBooted(true)
      return
    }

    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    let i = 0
    const tick = () => {
      if (cancelled) return
      setEntries((prev) =>
        prev.map((e) => (e.id === bootId ? { ...e, lines: [...e.lines, { type: "output", text: BOOT_LINES[i] }] } : e))
      )
      i++
      if (i < BOOT_LINES.length) {
        timers.push(setTimeout(tick, 220))
      } else {
        setBooted(true)
      }
    }
    timers.push(setTimeout(tick, 150))

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, booted])

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim()
      setHistoryIndex(null)
      if (!cmd) return

      setCommandLog((log) => [...log, cmd])
      const id = nextId.current++
      const lines: OutputLine[] = []
      const [name, ...rest] = cmd.split(/\s+/)
      const arg = rest.join(" ")

      switch (name.toLowerCase()) {
        case "help":
          lines.push({ type: "output", text: HELP_TEXT })
          break
        case "ls":
          lines.push({ type: "output", text: LS_OUTPUT })
          break
        case "pwd":
          lines.push({ type: "output", text: pathname })
          break
        case "whoami":
          lines.push({
            type: "output",
            text: "mason kimball — cs student, samford university. concentrating in cyber security.",
          })
          break
        case "clear":
          setEntries([])
          return
        case "cd": {
          let target = arg.replace(/^\.\//, "").replace(/\/$/, "").toLowerCase()
          if (target === "..") {
            target = pathname === "/projects/parliament" ? "projects" : ""
          }
          const dest = ROUTES[target]
          if (dest !== undefined) {
            lines.push({ type: "output", text: `→ ${dest}` })
            setEntries((prev) => [...prev, { id, command: cmd, lines }])
            if (dest !== pathname) router.push(dest)
            return
          }
          lines.push({ type: "error", text: `cd: no such page: ${arg || "(empty)"} — try 'ls'` })
          break
        }
        case "cat": {
          const file = arg.toLowerCase().replace(/^\.\//, "")
          if (file === "resume.pdf" || file === "resume") {
            lines.push({ type: "output", text: "opening resume.pdf..." })
            setEntries((prev) => [...prev, { id, command: cmd, lines }])
            window.open("/resume.pdf", "_blank", "noopener,noreferrer")
            return
          }
          if (file === "about.md" || file === "about") {
            lines.push({
              type: "output",
              text: "CS junior at Samford University, concentrating in Cyber Security with a minor in German. Building Parliament — chapter admin software for Beta Theta Pi.",
            })
            break
          }
          lines.push({ type: "error", text: `cat: ${arg || "(no file)"}: No such file or directory` })
          break
        }
        case "sudo":
          lines.push({ type: "error", text: "guest is not in the sudoers file. this incident will be reported." })
          break
        case "rm":
          lines.push({ type: "error", text: "rm: nice try — this filesystem is read-only for guests." })
          break
        case "theme": {
          const mode = rest[0]?.toLowerCase()
          if (!mode) {
            const next = resolvedTheme === "light" ? "dark" : "light"
            setTheme(next)
            lines.push({ type: "output", text: `theme → ${next}` })
          } else if (mode === "light" || mode === "dark" || mode === "system") {
            setTheme(mode)
            lines.push({ type: "output", text: `theme → ${mode}` })
          } else {
            lines.push({ type: "error", text: `theme: unknown option '${mode}' — try light, dark, or system` })
          }
          break
        }
        case "git": {
          if (rest[0]?.toLowerCase() !== "log") {
            lines.push({ type: "error", text: "git: unknown subcommand — try 'git log'" })
            break
          }
          lines.push({ type: "output", text: "fetching recent commits from github..." })
          setEntries((prev) => [...prev, { id, command: cmd, lines: [...lines] }])
          fetchGitLog().then((text) => {
            setEntries((prev) =>
              prev.map((e) => (e.id === id ? { ...e, lines: [...e.lines, { type: "output", text }] } : e))
            )
          })
          return
        }
        default:
          lines.push({ type: "error", text: `command not found: ${name} — type 'help' for a list of commands` })
      }

      setEntries((prev) => [...prev, { id, command: cmd, lines }])
    },
    [pathname, router, resolvedTheme, setTheme]
  )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    run(input)
    setInput("")
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false)
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandLog.length === 0) return
      const nextIndex = historyIndex === null ? commandLog.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInput(commandLog[nextIndex])
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex === null) return
      const nextIndex = historyIndex + 1
      if (nextIndex >= commandLog.length) {
        setHistoryIndex(null)
        setInput("")
      } else {
        setHistoryIndex(nextIndex)
        setInput(commandLog[nextIndex])
      }
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close terminal" : "Open terminal"}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-[linear-gradient(135deg,var(--color-primary),var(--color-primary-glow))] text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center text-sm font-medium hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? "✕" : ">_"}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Site terminal"
          className="fixed bottom-20 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm rounded-lg border border-border bg-card shadow-2xl shadow-primary/20 overflow-hidden flex flex-col"
        >
          <TerminalTitleBar
            title={`guest@masonkimball:~${pathname === "/" ? "" : pathname}`}
            onClose={() => setOpen(false)}
          />

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-xs font-mono max-h-72 min-h-72"
          >
            {entries.length === 0 && (
              <p className="text-muted-foreground">
                Portfolio terminal — type <span className="text-primary">help</span> to get started.
              </p>
            )}
            {entries.map((entry) => (
              <div key={entry.id}>
                {entry.command !== null && (
                  <p className="text-foreground font-semibold break-words">
                    <span className="text-primary">$</span> {entry.command}
                  </p>
                )}
                {entry.lines.length > 0 && (
                  <div
                    className={
                      entry.command !== null
                        ? "mt-1 pl-3 border-l-2 border-border space-y-1"
                        : "space-y-1"
                    }
                  >
                    {entry.lines.map((line, i) => (
                      <p
                        key={i}
                        className={
                          line.type === "error"
                            ? "text-red-500 dark:text-red-400 whitespace-pre-wrap break-words"
                            : "text-muted-foreground whitespace-pre-wrap break-words"
                        }
                      >
                        {line.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-border px-4 py-2.5 flex-shrink-0">
            <span className="text-primary text-xs flex-shrink-0">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="flex-1 min-w-0 bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground"
              placeholder="type a command..."
            />
          </form>
        </div>
      )}
    </>
  )
}
