// The apps I've built and how they talk to each other, for /projects/ecosystem.
// Every connection here can be pointed to in code (mapped from the repos on
// 2026-11-09). An app with a matching `slug` in lib/projects.ts links to it.

export const PLACES = [
  { id: "mac", name: "My Mac", note: "Where I work" },
  { id: "desktop", name: "My Windows desktop", note: "Always on, with the GPU; reached over Tailscale" },
  { id: "cloud", name: "The cloud", note: "Public sites and services" },
  { id: "phone", name: "My phone", note: "" },
] as const

export type Place = (typeof PLACES)[number]["id"]

export interface App {
  id: string
  name: string
  /** Ten words or so. */
  what: string
  place: Place
  /** Its entry in lib/projects.ts, if it has one. */
  slug?: string
}

export interface Connection {
  from: string
  to: string
  /** What `from` uses `to` for. */
  what: string
  /** How, in a few words. */
  how: string
}

export const APPS: App[] = [
  { id: "eclipse", name: "Eclipse", what: "Arc-style browser that knows my apps", place: "mac", slug: "eclipse" },
  { id: "loom", name: "Loom", what: "IDE with a repo dashboard and local AI", place: "mac", slug: "loom" },
  { id: "hop", name: "hop", what: "Keyboard launcher", place: "mac", slug: "hop" },
  { id: "daybook", name: "Daybook", what: "One agenda for calendars, tasks and time (and on my iPhone)", place: "mac", slug: "daybook" },
  { id: "media-player", name: "Media Player", what: "Video and audio player, and shelf's client", place: "mac", slug: "media-player" },
  { id: "repo-radar", name: "Repo Radar", what: "Dashboard of every git repo on the Mac", place: "mac", slug: "repo-radar" },
  { id: "sift", name: "sift", what: "Files new downloads into the right folders", place: "mac", slug: "sift" },

  { id: "homebase", name: "homebase", what: "Supervisor, dashboard, Ollama proxy and the Away queue", place: "desktop", slug: "homebase" },
  { id: "ollama", name: "Ollama", what: "The Qwen models on the GPU", place: "desktop" },
  { id: "job-tracker", name: "Job Tracker", what: "Job search board with Claude and Job Radar", place: "desktop", slug: "job-tracker" },
  { id: "sentinel", name: "Sentinel", what: "Watches my sites; its dashboard runs here", place: "desktop", slug: "sentinel" },
  { id: "shelf", name: "shelf", what: "Streams the desktop's media library", place: "desktop", slug: "shelf" },
  { id: "krakenlite", name: "KrakenLite", what: "Read-only commit graph viewer", place: "desktop", slug: "krakenlite" },
  { id: "gradtrack", name: "gradtrack", what: "Grad school applications tracker", place: "desktop", slug: "gradtrack" },

  { id: "parliament", name: "Parliament", what: "My fraternity chapter's management site", place: "cloud", slug: "parliament" },
  { id: "checkup", name: "Checkup", what: "Sentinel's public security grader", place: "cloud", slug: "sentinel" },
  { id: "portfolio", name: "This site", what: "masonkimball.dev", place: "cloud", slug: "portfolio" },

  { id: "parliament-mobile", name: "Parliament mobile", what: "Parliament's iOS and Android app", place: "phone", slug: "parliament" },
  { id: "alerts", name: "Phone alerts", what: "Push notifications through ntfy", place: "phone" },
]

const SUPERVISED = "Starts it at boot, restarts it when it crashes, health-checks it, and can pull and rebuild it from git"

export const CONNECTIONS: Connection[] = [
  // homebase runs the desktop
  { from: "homebase", to: "job-tracker", what: SUPERVISED, how: "Process supervisor" },
  { from: "homebase", to: "sentinel", what: SUPERVISED, how: "Process supervisor" },
  { from: "homebase", to: "shelf", what: SUPERVISED, how: "Process supervisor" },
  { from: "homebase", to: "krakenlite", what: SUPERVISED, how: "Process supervisor" },
  { from: "homebase", to: "gradtrack", what: SUPERVISED, how: "Process supervisor" },
  { from: "homebase", to: "ollama", what: "Keeps Ollama running and off the network; everything else reaches the models through homebase's short list of allowed endpoints", how: "Process supervisor, Ollama proxy" },
  { from: "homebase", to: "loom", what: "Away runs Loom's agent tools so the local model works through queued coding tasks while I'm out", how: "Loom's tools, from a checkout on the desktop" },
  { from: "homebase", to: "parliament", what: "Away tasks run against a Parliament dev copy with its Django tests, and finished branches are pushed for review", how: "git worktrees and push" },
  { from: "homebase", to: "alerts", what: "Crash loops, unhealthy apps, recoveries and a morning check-in", how: "ntfy" },

  // Loom
  { from: "loom", to: "homebase", what: "Local AI chat, inline completions and search by meaning on the desktop's GPU; opening and editing desktop projects in place; viewing and controlling the Away queue", how: "Ollama proxy and HTTP API, over Tailscale" },
  { from: "repo-radar", to: "loom", what: "Loom's Repos module is built from Repo Radar's code", how: "Shared code" },
  { from: "krakenlite", to: "loom", what: "Its commit graph is the one Loom shows", how: "Shared code" },
  { from: "krakenlite", to: "repo-radar", what: "Its commit graph is the one Repo Radar shows", how: "Shared code" },

  // Eclipse
  { from: "eclipse", to: "homebase", what: "A menu of every desktop app's state with Start, Stop, Restart and logs; toasts when one goes down; sending a GitHub issue to the Away queue; answers from the local model in the command bar", how: "HTTP API and Ollama proxy" },
  { from: "eclipse", to: "sentinel", what: "My sites' status in the homebase menu, with a toast when one changes", how: "Sentinel's dashboard API" },
  { from: "eclipse", to: "checkup", what: "Security Grade for This Site: an A–F grade for the page I'm on", how: "HTTPS" },
  { from: "eclipse", to: "job-tracker", what: "Save Job opens a new job with the posting filled in; Radar matches and follow-ups show as Live Folders", how: "Link and JSON feed" },
  { from: "eclipse", to: "gradtrack", what: "Application deadlines as a Live Folder", how: "Calendar feed" },
  { from: "eclipse", to: "parliament", what: "The unread count on its tab, a notifications folder, chapter events and a search shortcut", how: "JSON, with my browser login" },
  { from: "eclipse", to: "daybook", what: "An Up Next card with my next event, and Add Page to Daybook as a task", how: "Daybook's hop.json, daybook:// links" },
  { from: "eclipse", to: "hop", what: "Brings over hop's quicklinks as search shortcuts", how: "hop's quicklinks file" },
  { from: "eclipse", to: "loom", what: "Open Repo in Loom on the GitHub page of a repo I have cloned", how: "Opens the folder in Loom" },

  // hop
  { from: "hop", to: "eclipse", what: "Switches tabs and Spaces, searches history, page text, archived tabs and notes, and shows Live Folder news in the menu bar", how: "Eclipse's session and page index, AppleScript, eclipse-browser:// links" },
  { from: "hop", to: "daybook", what: "Today's events, tasks and countdowns; adding tasks, events and time logs; the morning brief", how: "hop.json and brief.md, daybook:// links" },
  { from: "hop", to: "homebase", what: "Starts, stops and restarts desktop apps", how: "HTTP API, over Tailscale" },
  { from: "hop", to: "job-tracker", what: "Follow-ups, Radar matches and board search; Add Job opens the form", how: "JSON feed" },
  { from: "hop", to: "shelf", what: "`play …` searches the desktop's media library", how: "HTTP API" },
  { from: "hop", to: "media-player", what: "Plays what `play …` found", how: "shelf:// links" },
  { from: "hop", to: "checkup", what: "`check example.com` grades a site", how: "HTTPS" },

  // Media and dates
  { from: "media-player", to: "shelf", what: "Browses, searches and streams the desktop's library, and remembers where I stopped", how: "HTTP API, over Tailscale" },
  { from: "daybook", to: "job-tracker", what: "Follow-up dates in the agenda", how: "Calendar feed, through macOS Calendar" },
  { from: "daybook", to: "gradtrack", what: "Application deadlines in the agenda", how: "Calendar feed, through macOS Calendar" },
  { from: "daybook", to: "parliament", what: "Chapter events in the agenda", how: "Calendar feed, through macOS Calendar" },
  { from: "daybook", to: "sift", what: "Gives sift my course names so class downloads go in the right folders", how: "A JSON file Daybook writes" },

  // Watching and alerting
  { from: "sentinel", to: "parliament", what: "Uptime, certificates, post-quantum TLS, security headers and exposed files, every 30 minutes", how: "Checks from GitHub Actions" },
  { from: "sentinel", to: "portfolio", what: "The same checks on this site, and the live status shown on it", how: "Checks from GitHub Actions, a status gist" },
  { from: "sentinel", to: "alerts", what: "A notice when a site's status changes", how: "ntfy" },
  { from: "job-tracker", to: "alerts", what: "New job matches that score 75 or more", how: "ntfy" },

  // Parliament on phones
  { from: "parliament-mobile", to: "parliament", what: "Sign-in with 2FA and passkeys, the native screens, and a signed-in hand-off to pages that aren't native yet", how: "Parliament's mobile API" },
  { from: "parliament", to: "parliament-mobile", what: "Push notifications", how: "Expo's push service" },
]
