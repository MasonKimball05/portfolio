// Every project on the site, in the order they appear. This file is the only
// place a project needs adding: the projects page, the sitemap and the
// terminal's `cd`/`ls` all read from it.
//
// To add one:
//   1. Add an entry below.
//   2. For a case study, set `caseStudy: true` and create
//      app/projects/<slug>/page.tsx (copy an existing one; the blocks are in
//      components/case-study.tsx). Without it, the card links to `href`.

export const CATEGORIES = ["Security", "Apps", "Tools", "Web", "AI", "Research", "Games"] as const
export type Category = (typeof CATEGORIES)[number]

export type Status = "Active" | "In Progress" | "In Development" | "Archived"

export interface Project {
  /** URL segment: /projects/<slug> for a case study. */
  slug: string
  name: string
  tagline: string
  /** Shown on pinned cards; the first one is the card's summary elsewhere. */
  highlights: string[]
  tech: string[]
  categories: Category[]
  status: Status
  /** Tailwind border color for the card's left edge, e.g. "border-l-sky-500". */
  accent: string
  /** The GitHub repo, so it isn't listed again under "More on GitHub". */
  repo: string
  /** Has its own page at /projects/<slug>. */
  caseStudy?: boolean
  /** Where the card goes when there's no case study (GitHub, a live site). */
  href?: string
  /** Shown first, as a larger card. Keep it to two or three. */
  pinned?: boolean
}

export const PROJECTS: Project[] = [
  {
    slug: "parliament",
    name: "Parliament",
    categories: ["Web", "Security"],
    pinned: true,
    caseStudy: true,
    tagline: "Chapter administration software for Beta Theta Pi",
    highlights: [
      "Used by ~60 active members to manage legislation, officer elections, service hours, attendance, and conduct reports",
      "Custom security middleware: rate limiting, 2FA (TOTP), field-level encryption, geolocation, and attack detection",
      "Built and maintained solo — currently hardening for handoff to future leadership before I graduate",
    ],
    tech: ["Python", "Django", "PostgreSQL", "Redis", "Tailwind CSS"],
    repo: "Parliament-New",
    status: "Active",
    accent: "border-l-primary",
  },
  {
    slug: "media-player",
    name: "Media Player",
    categories: ["Apps"],
    pinned: true,
    caseStudy: true,
    tagline: "A native macOS video/audio player, built because QuickTime wasn't cutting it",
    highlights: [
      "Dual playback engines — AVFoundation for native formats, libmpv for MKV/WebM/AVI and anything AVFoundation can't open — behind custom YouTube-style transport controls",
      "Built-in downloader (yt-dlp) with format/subtitle picks and background progress, plus on-device subtitle translation via Apple's Translation framework",
      "Per-file resume positions, saved and exportable (M3U) playlists, trackpad gestures, remappable shortcuts, and Now Playing/AirPlay integration",
    ],
    tech: ["Swift", "SwiftUI", "AVFoundation", "libmpv"],
    repo: "Custom-Mac-Media-Player",
    status: "Active",
    accent: "border-l-rose-500",
  },
  {
    slug: "job-tracker",
    name: "Job Tracker",
    categories: ["Apps", "AI"],
    caseStudy: true,
    tagline: "AI-assisted job application tracker, built with C# and Claude",
    highlights: [
      "Paste a job posting and Claude extracts company, role, location, and requirements via structured outputs — salary only if stated, never guessed",
      "Scores your résumé against a posting (0–100, with real strengths and gaps) and drafts editable, streaming cover letters that don't invent experience",
      "Job Radar watches 22 companies' job boards in the background, filters for free, and scores new postings with Claude through the Batch API at half price",
    ],
    tech: ["C#", ".NET", "Blazor", "SQLite"],
    repo: "job-tracker",
    status: "Active",
    accent: "border-l-indigo-500",
  },
  {
    slug: "daybook",
    name: "Daybook",
    categories: ["Apps"],
    caseStudy: true,
    tagline: "My own calendar app for Mac and iPhone, and the hub for my day",
    highlights: [
      "Every calendar macOS syncs (iCloud, Outlook, Canvas, my own apps' feeds) and my tasks in one agenda, with free time between events",
      "Tracks coding time from my git commits, sleep from Apple Health and subscriptions from billing emails, in a weekly time recap",
      "Mac and iPhone apps from one codebase, kept in step through iCloud with no server, plus widgets, Siri and a morning brief from a scheduled Claude agent",
    ],
    tech: ["Swift", "SwiftUI", "EventKit", "HealthKit"],
    repo: "Daybook",
    status: "Active",
    accent: "border-l-blue-500",
  },
  {
    slug: "hop",
    name: "hop",
    categories: ["Tools", "Apps"],
    caseStudy: true,
    tagline: "A keyboard launcher for macOS, and a front door to the apps I've built",
    highlights: [
      "Fuzzy app search, a calculator, unit and time zone conversions, on-device translation and clipboard history, from one shortcut",
      "Controls my desktop's apps through homebase, plays from shelf, and adds tasks or logs time in Daybook",
      "A non-activating panel like Spotlight's, so pastes land in the app you were in",
    ],
    tech: ["Swift", "AppKit", "SwiftUI"],
    repo: "hop",
    status: "Active",
    accent: "border-l-lime-500",
  },
  {
    slug: "sift",
    name: "sift",
    categories: ["Tools"],
    caseStudy: true,
    tagline: "Sorts new downloads into the right folders, by rules you can read",
    highlights: [
      "Rules by folder, file type, name, the site a file came from, and words inside PDFs; Canvas downloads find their course from the link",
      "Starts out only suggesting moves, never overwrites, and logs every move so it can be undone",
      "A Rust library with a command line and a Tauri app over it, written to be read while learning the language",
    ],
    tech: ["Rust", "Tauri", "JavaScript"],
    repo: "sift",
    status: "Active",
    accent: "border-l-orange-600",
  },
  {
    slug: "repo-radar",
    name: "Repo Radar",
    categories: ["Tools"],
    tagline: "Desktop dashboard for git hygiene across every repo in a folder",
    highlights: [
      "Surfaces uncommitted changes, unpushed/behind commits, stashes, duplicate clones, and live GitHub Actions status at a glance",
      "Tauri 2 desktop app — Rust backend, React/TypeScript UI — read-only by design: never fetches, runs git via argument arrays (no shell), keeps tokens out of the UI",
      "Auto-rescans on window focus, with filters for what actually needs attention",
    ],
    tech: ["Rust", "Tauri", "TypeScript", "React"],
    href: "https://github.com/MasonKimball05/repo-radar",
    repo: "repo-radar",
    status: "Active",
    accent: "border-l-cyan-500",
  },
  {
    slug: "sentinel",
    name: "Sentinel",
    categories: ["Security", "Tools"],
    caseStudy: true,
    tagline: "Uptime and security monitoring for my deployed sites, in Go",
    highlights: [
      "Checks reachability, TLS expiry, security headers (HSTS, CSP, clickjacking protection), version-leaking headers, and exposed files like .env or .git/HEAD",
      "Alerts only on change — a push notification via ntfy or Discord when a site goes down or recovers, not a repeat every run",
      "Runs on a 30-minute GitHub Actions schedule so it keeps checking from outside even while my laptop's asleep — standard library only, no dependencies",
    ],
    tech: ["Go", "GitHub Actions"],
    repo: "go-sentinel",
    status: "Active",
    accent: "border-l-emerald-500",
  },
  {
    slug: "pq-census",
    name: "pq-census",
    categories: ["Security", "Research"],
    pinned: true,
    caseStudy: true,
    tagline: "Measuring how much of the web uses post-quantum TLS",
    highlights: [
      "Scanned the Tranco top 10,000: 55.7% of reachable sites negotiate X25519MLKEM768, the hybrid ML-KEM key exchange that Chrome and Firefox now offer",
      "The CDN decides it: 97% of sites behind Cloudflare and 99.6% behind CloudFront are post-quantum, versus about 20% of self-hosted sites; 15% are still on TLS 1.2",
      "Keeps the handshake even when HTTP fails, classifies every failure (DNS, reset, timeout), skips private addresses, and resumes interrupted scans — data and methodology published",
    ],
    tech: ["Go", "TLS", "Cryptography"],
    repo: "pq-census",
    status: "Active",
    accent: "border-l-sky-500",
  },
  {
    slug: "homebase",
    name: "homebase",
    categories: ["Tools"],
    caseStudy: true,
    tagline: "Process supervisor and dashboard for the apps I self-host",
    highlights: [
      "Starts every app on my desktop at boot, restarts crashes with exponential backoff, and health-checks each one — with a dashboard for live logs and start/stop/restart",
      "Windows Job Objects tie each app's lifetime to homebase, so even a force-killed supervisor never leaves orphaned apps behind",
      "Phone alerts via ntfy on crash loops and recoveries; one command pulls, rebuilds and redeploys any app from git",
    ],
    tech: ["Go", "Windows", "Tailscale"],
    repo: "homebase",
    status: "Active",
    accent: "border-l-amber-500",
  },
  {
    slug: "shelf",
    name: "shelf",
    categories: ["Tools", "Apps"],
    tagline: "Streams my desktop's media library to my Media Player, from anywhere",
    highlights: [
      "Browse, search, and play movies and shows over Tailscale, with seeking and subtitles through HTTP Range requests — files play as they are, no transcoding",
      "Files are served by opaque ID only, so a request path never touches the disk and traversal is impossible by construction; stream links are HMAC-signed and expire",
      "Bearer-token API, a Tailscale-only firewall rule, and secrets kept in the environment — supervised and redeployed by homebase",
    ],
    tech: ["Go", "Tailscale", "Swift"],
    href: "https://github.com/MasonKimball05/shelf",
    repo: "shelf",
    status: "Active",
    accent: "border-l-fuchsia-500",
  },
  {
    slug: "skirmish",
    name: "Skirmish",
    categories: ["Games"],
    caseStudy: true,
    tagline: "An arcade FPS in the spirit of Call of Duty / XDefiant, built to learn game development",
    highlights: [
      "Godot 4 game with ten guns, attachments, perks, seven modes (from Team Deathmatch to a round-based plant-and-defuse), and four maps",
      "Online play over a dedicated server with netcode built from scratch: prediction, reconciliation, interpolation, lag compensation, and packet-loss recovery",
      "Bots that navigate, flank, and call each other out as a team; guns and soldiers modelled in Blender by script, and every sound synthesized in code",
    ],
    tech: ["GDScript", "Godot", "Blender"],
    repo: "Skirmish",
    status: "In Development",
    accent: "border-l-orange-500",
  },
  {
    slug: "portfolio",
    name: "Portfolio",
    categories: ["Web"],
    tagline: "This site",
    highlights: [
      "Static Next.js 16 site deployed to GitHub Pages via static export",
      "Dynamic GitHub repo fetching with per-repo language breakdowns via the GitHub API",
    ],
    tech: ["TypeScript", "Next.js", "Tailwind CSS", "shadcn/ui"],
    href: "https://github.com/MasonKimball05/portfolio",
    repo: "portfolio",
    status: "Active",
    accent: "border-l-violet-500",
  },
  {
    slug: "python-browser",
    name: "PythonBrowser",
    categories: ["Apps"],
    tagline: "Custom browser built with PyQt5",
    highlights: [
      "Tabbed browsing with QtWebEngine for full web rendering",
      "Built to explore Qt's signals/slots system and desktop GUI development in Python",
    ],
    tech: ["Python", "PyQt5", "QtWebEngine"],
    href: "https://github.com/MasonKimball05/PythonBrowser",
    repo: "PythonBrowser",
    status: "In Progress",
    accent: "border-l-amber-500",
  },
  {
    slug: "semapi",
    name: "Semapi",
    categories: ["Web"],
    tagline: "Coursework — learning the Next.js + Supabase + Vercel stack (COSC 490)",
    highlights: [
      "Full-stack Next.js app with Supabase for auth and the database, deployed on Vercel",
      "Built specifically to learn that stack and deployment pipeline for a CS course",
      "Early stage — current scope is the framework and pipeline, not a fixed feature set yet",
    ],
    tech: ["TypeScript", "Next.js", "Supabase", "Tailwind CSS"],
    href: "https://semapi-delta.vercel.app",
    repo: "semapi",
    status: "In Progress",
    accent: "border-l-teal-500",
  },
]

export const CASE_STUDIES = PROJECTS.filter((p) => p.caseStudy)

/** Where a project's card links: its case study, or `href`. */
export function projectLink(p: Project): string {
  return p.caseStudy ? `/projects/${p.slug}` : (p.href ?? `https://github.com/MasonKimball05/${p.repo}`)
}
