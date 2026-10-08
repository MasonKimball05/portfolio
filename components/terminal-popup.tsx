"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { FormEvent, KeyboardEvent } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { TerminalTitleBar } from "@/components/terminal-window"
import { CASE_STUDIES } from "@/lib/projects"

// "art" lines keep their exact spacing and never wrap — the popup is ~45
// columns wide, and a wrapped ASCII drawing is just noise.
// "cmd"/"desc" are for help: a command name, then its description with a CSS
// hanging indent — leading spaces only indent the first line, so a wrapped
// description used to restart at the left edge, right where command names sit.
type OutputLine = { type: "output" | "error" | "art" | "cmd" | "desc"; text: string }
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
  // Every case study, as "projects/<slug>" and plain "<slug>" (from lib/projects.ts).
  ...Object.fromEntries(CASE_STUDIES.flatMap((p) => [
    [`projects/${p.slug}`, `/projects/${p.slug}`],
    [p.slug, `/projects/${p.slug}`],
  ])),
  "skills": "/skills",
  "contact": "/contact",
}

const LS_OUTPUT = "about/  contact/  projects/  skills/"
const LS_PROJECTS_OUTPUT = CASE_STUDIES.map((p) => `${p.slug}/`).join("  ")
const LS_ALL_OUTPUT = ".  ..  .env  .git/  about/  contact/  projects/  skills/  about.md  resume.pdf"

// Rendered as one row per command (name, then indented description on its
// own line) instead of space-padded columns — fixed-width alignment breaks
// the moment a description wraps in this narrow popup, and a wrapped
// continuation like "cd projects/parliament)" reads as a brand-new command.
const HELP_ROWS: [string, string][] = [
  ["ls", "list pages you can visit"],
  ["cd <page>", "go to a page (e.g. cd about, cd projects/parliament)"],
  ["cd ..", "go up one level"],
  ["pwd", "print the current page path"],
  ["whoami", "about the person who built this"],
  ["cat <file>", "read a file (try: cat resume.pdf, cat about.md)"],
  ["git log", "recent commits from github.com/MasonKimball05"],
  ["theme [mode]", "set the theme (light, dark, system) — no arg toggles"],
  ["clear", "clear the terminal"],
  ["help", "show this message"],
]

const FUN_COMMANDS = "neofetch  fortune  cowsay  tree  ping  nmap  history  date  uptime  echo  coffee  exit"

const FORTUNES = [
  "There are only two hard things in computer science: cache invalidation, naming things, and off-by-one errors.",
  "It works on my machine. — every developer, eventually",
  "Weeks of coding can save you hours of planning.",
  "There is no cloud. It's just someone else's computer.",
  "The S in IoT stands for security.",
  "A user interface is like a joke. If you have to explain it, it's not that good.",
  "Premature optimization is the root of all evil. — Donald Knuth",
  "Always code as if the person who ends up maintaining your code will be the future you, at 2am.",
  "git commit -m \"final fix\" && git commit -m \"actual final fix\"",
  "Security is a process, not a product. — Bruce Schneier",
  "Have you tried turning it off and on again?",
  "99 little bugs in the code. Take one down, patch it around... 127 little bugs in the code.",
]

const TREE_OUTPUT = [
  "~",
  "├── about/",
  "├── contact/",
  "├── projects/",
  ...CASE_STUDIES.map((p, i) => `│   ${i === CASE_STUDIES.length - 1 ? "└" : "├"}── ${p.slug}/`),
  "├── skills/",
  "├── about.md",
  "└── resume.pdf",
  "",
  `${4 + CASE_STUDIES.length} directories, 2 files`,
].join("\n")

const NEOFETCH_LOGO = [
  " __  __ _  __",
  "|  \\/  | |/ /",
  "| |\\/| | ' / ",
  "| |  | | . \\ ",
  "|_|  |_|_|\\_\\",
].join("\n")

const COFFEE_ART = [
  "    ( (",
  "     ) )",
  "  ........",
  "  |      |]",
  "  \\      /",
  "   `----'",
].join("\n")

const TRAIN_ART = [
  "    (@@) (  ) (@)",
  "   ====      ________",
  " _D _|  |___/        \\__",
  "  |(_)---  |  H\\____/  |",
  "  /     |  |  H  |  |  |",
  " | _____|__|__H__|__|__|",
  "  oo  oo      oo    oo",
].join("\n")

const NMAP_OUTPUT = [
  "Starting Nmap 7.95 ( https://nmap.org )",
  "Nmap scan report for masonkimball.dev",
  "Host is up (0.0042s latency).",
  "",
  "PORT      STATE     SERVICE",
  "22/tcp    filtered  ssh (nice try)",
  "80/tcp    open      http",
  "443/tcp   open      https",
  "1337/tcp  open      elite (you found it)",
  "",
  "Nmap done: 1 IP address scanned. Attack surface: a static site.",
  "It's a pile of HTML — there's nothing back here to break into.",
].join("\n")

function cowsay(text: string): string {
  const max = 28
  const lines: string[] = []
  let current = ""
  for (const raw of text.split(/\s+/).filter(Boolean)) {
    const word = raw.slice(0, max)
    if (current && (current + " " + word).length > max) {
      lines.push(current)
      current = word
    } else {
      current = current ? `${current} ${word}` : word
    }
  }
  if (current) lines.push(current)

  const width = Math.max(...lines.map((l) => l.length))
  const body =
    lines.length === 1
      ? [`< ${lines[0]} >`]
      : lines.map((l, i) => {
          const [left, right] = i === 0 ? ["/", "\\"] : i === lines.length - 1 ? ["\\", "/"] : ["|", "|"]
          return `${left} ${l.padEnd(width)} ${right}`
        })

  return [
    " " + "_".repeat(width + 2),
    ...body,
    " " + "-".repeat(width + 2),
    "        \\   ^__^",
    "         \\  (oo)\\_______",
    "            (__)\\       )\\/\\",
    "                ||----w |",
    "                ||     ||",
  ].join("\n")
}

function fakePing(host: string): string {
  const times = [0, 1, 2].map(() => (Math.random() * 18 + 4).toFixed(3))
  return [
    `PING ${host} (127.0.0.1): 56 data bytes`,
    ...times.map((t, i) => `64 bytes from 127.0.0.1: icmp_seq=${i} ttl=64 time=${t} ms`),
    "",
    `--- ${host} ping statistics ---`,
    "3 packets transmitted, 3 packets received, 0.0% packet loss",
  ].join("\n")
}

function formatUptime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes > 0 ? `${minutes} min, ${seconds} sec` : `${seconds} sec`
}

const BOOT_LINES = [
  "booting portfolio-terminal v1.0.0...",
  "[ok] loading resume.pdf",
  "[ok] mounting /about /projects /skills /contact",
  "[ok] uplink to github.com/MasonKimball05 established",
  "[ok] permission check: you are not root",
  "ready. type 'help' to see what's available.",
]

interface GitHubCommit {
  sha: string
  commit: { message: string }
}

async function fetchGitLog(): Promise<string> {
  try {
    const res = await fetch("https://api.github.com/repos/MasonKimball05/portfolio/commits?per_page=8")
    if (!res.ok) return "git: could not reach GitHub (rate limited or offline)"
    const commits: GitHubCommit[] = await res.json()
    if (!Array.isArray(commits) || commits.length === 0) return "no commits found"
    return commits
      .map((c) => `${c.sha.slice(0, 7)}  ${c.commit.message.split("\n")[0]}`)
      .join("\n")
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
  const startedAt = useRef(0)
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
    startedAt.current = Date.now()
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
          lines.push({ type: "output", text: "available commands:" })
          for (const [cmdName, desc] of HELP_ROWS) {
            lines.push({ type: "cmd", text: cmdName })
            lines.push({ type: "desc", text: desc })
          }
          lines.push({ type: "output", text: "" })
          lines.push({ type: "output", text: "just for fun:" })
          lines.push({ type: "desc", text: FUN_COMMANDS })
          lines.push({ type: "desc", text: "(and a few hidden ones — poke around)" })
          lines.push({ type: "output", text: "" })
          lines.push({ type: "output", text: "tip: press ` (backtick) to toggle, ↑/↓ to recall commands" })
          break
        case "ls":
          // `ls projects` (or `ls` while on /projects) lists the case studies.
          const inProjects = /^(\.\/)?projects\/?$/.test(arg) || (arg === "" && pathname.replace(/\/$/, "") === "/projects")
          lines.push({ type: "output", text: inProjects ? LS_PROJECTS_OUTPUT : /^-\w*a/.test(arg) ? LS_ALL_OUTPUT : LS_OUTPUT })
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
            // From a case study, up is /projects; from anywhere else, home.
            target = /^\/projects\/[^/]+/.test(pathname) ? "projects" : ""
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
          if (file === ".env") {
            lines.push({ type: "error", text: "cat: .env: Permission denied" })
            lines.push({ type: "output", text: "good instinct checking, though — Sentinel flags any site that serves one publicly." })
            break
          }
          if (file.startsWith(".git")) {
            lines.push({ type: "error", text: `cat: ${arg}: Is a directory (and not one you're getting into)` })
            break
          }
          if (file === "/etc/passwd" || file.includes("..")) {
            lines.push({ type: "error", text: `cat: ${arg}: this is a browser tab, not a server. path traversal won't get you far here.` })
            break
          }
          lines.push({ type: "error", text: `cat: ${arg || "(no file)"}: No such file or directory` })
          break
        }
        case "sudo":
          if (/make me a sandwich/i.test(arg)) {
            lines.push({ type: "output", text: "okay." })
            lines.push({ type: "art", text: "   _________\n  /  ~~~~~  \\\n |___________|\n |  lettuce  |\n |___________|\n  \\_________/" })
            break
          }
          lines.push({ type: "error", text: "guest is not in the sudoers file. this incident will be reported." })
          break
        case "neofetch": {
          const theme = resolvedTheme ?? "system"
          lines.push({ type: "art", text: NEOFETCH_LOGO })
          lines.push({
            type: "output",
            text: [
              "guest@masonkimball",
              "------------------",
              "OS:     Portfolio OS (static export)",
              "Host:   Samford University",
              "Kernel: Next.js 16 / React 19",
              "Shell:  portfolio-terminal 1.0",
              `Theme:  ${theme}`,
              "Langs:  Python, TS, Swift, Rust, Go, C#",
              "Focus:  Cyber Security",
              `Uptime: ${formatUptime(Date.now() - startedAt.current)}`,
            ].join("\n"),
          })
          break
        }
        case "fortune":
          lines.push({ type: "output", text: FORTUNES[Math.floor(Math.random() * FORTUNES.length)] })
          break
        case "cowsay":
          lines.push({ type: "art", text: cowsay((arg || "moo. type 'help' for more.").slice(0, 200)) })
          break
        case "tree":
          lines.push({ type: "output", text: TREE_OUTPUT })
          break
        case "ping":
          if (!arg) {
            lines.push({ type: "error", text: "usage: ping <host>" })
            break
          }
          lines.push({ type: "output", text: fakePing(rest[0].slice(0, 40)) })
          break
        case "nmap":
          lines.push({ type: "output", text: NMAP_OUTPUT })
          break
        case "history":
          lines.push({
            type: "output",
            text: [...commandLog, cmd].map((c, i) => `${String(i + 1).padStart(4)}  ${c}`).join("\n"),
          })
          break
        case "date":
          lines.push({ type: "output", text: new Date().toString() })
          break
        case "uptime":
          lines.push({ type: "output", text: `up ${formatUptime(Date.now() - startedAt.current)}, 1 user (you)` })
          break
        case "echo":
          lines.push({ type: "output", text: arg })
          break
        case "coffee":
          lines.push({ type: "art", text: COFFEE_ART })
          lines.push({ type: "output", text: "brewing... ☕ productivity +10" })
          break
        case "sl":
          lines.push({ type: "art", text: TRAIN_ART })
          lines.push({ type: "output", text: "choo choo — you meant 'ls'." })
          break
        case "matrix":
          lines.push({ type: "output", text: "Wake up, Neo...\nThe Matrix has you...\nFollow the white rabbit." })
          break
        case "vim":
        case "vi":
          lines.push({ type: "output", text: "you've entered vim. there is no escape." })
          lines.push({ type: "output", text: "(hint: generations of developers have tried ':q')" })
          break
        case ":q":
        case ":q!":
        case ":wq":
        case ":x":
          lines.push({ type: "output", text: "you escaped vim. most people never do." })
          break
        case "emacs":
          lines.push({ type: "output", text: "emacs: this popup is ~45 columns wide. there isn't room for a whole operating system." })
          break
        case "nano":
          lines.push({ type: "output", text: "nano: a respectable choice. but this filesystem is still read-only." })
          break
        case "man":
          lines.push({
            type: "output",
            text: arg ? `No manual entry for ${arg}. 'help' is the only manual here.` : "What manual page do you want? (try 'help')",
          })
          break
        case "exit":
        case "logout":
          lines.push({ type: "output", text: "logout" })
          setEntries((prev) => [...prev, { id, command: cmd, lines }])
          setOpen(false)
          return
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
    [pathname, router, resolvedTheme, setTheme, commandLog]
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
                            : line.type === "art"
                              ? "text-primary whitespace-pre overflow-x-auto leading-tight [font-variant-ligatures:none]"
                              : line.type === "cmd"
                                ? "text-primary font-medium pt-2 break-words"
                                : line.type === "desc"
                                  ? "text-muted-foreground pl-4 whitespace-pre-wrap break-words"
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
