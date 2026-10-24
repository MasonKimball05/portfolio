import type { Metadata } from "next"
import {
  CaseStudyHeader, CaseStudyShell, DashList, Intro, P, SectionHeading, Stats, Stories, Terminal,
} from "@/components/case-study"

const DESCRIPTION =
  "An Arc-style browser for macOS in Python and PyQt6: Spaces, a command bar, its own Chrome extension runtime, and Claude features through the local CLI."

export const metadata: Metadata = {
  title: "Eclipse — Mason Kimball",
  description: DESCRIPTION,
  openGraph: { title: "Eclipse — Mason Kimball", description: DESCRIPTION },
}

const COMMAND_BAR = `github.com/...          → open it, or the tab it's already in
yt lofi                 → search YouTube (Tab after a site's name works too)
gh pyqt6                → search GitHub
12 oz in grams          → converted as you type
who owns this site?     → Ask Claude, streamed in the bar
that article on ipv6    → pages found by their text, marked Read
restart job tracker     → restarts it on my desktop through homebase`

export default function EclipseCaseStudy() {
  return (
    <CaseStudyShell>
      <CaseStudyHeader
        title="Eclipse"
        tagline="My own Arc-style browser for macOS, built since Arc is being wound down"
        tech={["Python", "PyQt6", "QtWebEngine", "JavaScript"]}
        links={[{ label: "GitHub", href: "https://github.com/MasonKimball05/Eclipse", primary: true }]}
      />

      <Intro accent="border-l-amber-500">
        <P>
          Arc is being wound down in favor of Dia. Rather than give up the
          vertical sidebar, Spaces and a command bar in place of a new-tab page, I built my own. Eclipse runs on
          QtWebEngine (Chromium) through PyQt6, and it&apos;s now my default browser.
        </P>
        <P>
          It started in April as PythonBrowser, a small project to learn Qt&apos;s signals and slots. It became the
          browser I use every day, and it works with the other apps I&apos;ve built: homebase, Job Tracker, Daybook
          and Parliament.
        </P>
      </Intro>

      <section className="space-y-6">
        <SectionHeading title="What It Does" />
        <Terminal>{COMMAND_BAR}</Terminal>
        <DashList
          items={[
            "Arc's model: Favorites, Spaces with their own colors and gradient themes, pinned tabs that remember their home page, and Today tabs that archive themselves after 12 hours unused",
            "Split View, Peek, Little windows for links from other apps, Boosts, Notes, Easels (whiteboard tabs) and Live Folders that fill themselves from feeds, GitHub or my own apps' APIs",
            "File → Import from Arc brings over Spaces, pinned folders, Favorites, history and site icons from Arc's local data, read-only",
            "Arc Max's ideas without an API key: tidied tab titles, grouping tabs into folders, Ask on Page, 5-second link previews and Browse for Me, through the Claude CLI already signed in on the Mac",
            "Built-in ad blocking, cookie-banner rejection (never Accept), tracking tags removed from links, private windows, site permissions and certificate warnings",
            "Built as a real Mac app that can be the default browser, with crash recovery and daily updates from its own GitHub branch",
          ]}
        />
      </section>

      <section className="space-y-6">
        <SectionHeading title="Under the Hood" />

        <Stats
          items={[
            { value: "~22k", label: "lines of Python" },
            { value: "209", label: "tests, plus live window tests" },
            { value: "3", label: "runtime dependencies" },
            { value: "200k", label: "blocking rules loaded in under 1 s" },
          ]}
        />

        <DashList
          title="How it works"
          items={[
            "Data and widgets are kept apart. Widgets never change data; they ask the main window, which updates the Store, and the Store signals the sidebar to rebuild once per event-loop pass",
            "Each tab row listens only to its own tab's title and icon, so a page loading never rebuilds the sidebar",
            "Web views are lazy: a restored or pinned tab gets no Chromium page until you click it, and tabs left alone for an hour go to sleep (3 of 4 sleeping pages went from 407 MB to 104 MB in testing)",
            "Chrome extensions run on my own runtime: content scripts, MV3 service workers as hidden pages, chrome.storage, tabs, ports, native messaging and declarativeNetRequest",
            "Blocking rules are indexed by domain and keyword on a background thread, so an ad blocker's 200,000 rules cost a fraction of a millisecond per request",
            "The searchable history of what I've read is a local SQLite FTS5 index written on its own thread, never fed by private windows or sign-in pages",
          ]}
        />

        <Stories
          title="Decisions that took more than one try"
          stories={[
            {
              title: "Writing my own extension runtime",
              body: "Qt WebEngine has extension support, but it crashes on macOS (still true in Qt 6.11 and 6.12). So Eclipse implements the chrome.* APIs itself. Each extension's content scripts run in their own JavaScript world, and Qt only allows its web channel in one world per page, so those worlds talk to Python through console messages stamped with a secret token per world. Forged tokens are ignored, one extension can't act as another, and websites can't reach the runtime at all. The tests check all three.",
            },
            {
              title: "Claude without an API key, and without trusting the page",
              body: "The AI features use the claude CLI that's already signed in, so there's no key and no per-call bill. Starting it takes about 8 seconds, so one process is always kept warm and waiting, and answers begin in under a second. Web pages are untrusted input, so the CLI runs with every tool turned off, no MCP servers and no settings files, from a neutral folder. The worst a hostile page can do is make an answer wrong.",
            },
            {
              title: "Renaming without losing anything",
              body: "PythonBrowser became Halo, then Eclipse. What you see uses the new name, but the data folder, the Keychain entries and the bundle ID keep the original one. That way a rename never strands your tabs or saved tokens, and macOS still remembers it as the default browser along with its camera and microphone permissions.",
            },
            {
              title: "Why GitHub took 30 seconds to load",
              body: "curl fetched GitHub in a second while the browser took 15 to 30. The Mac's IPv6 routes went through VPN tunnels that led nowhere, and Chromium tries IPv6 first and waits on each attempt before falling back. The fix was in the network settings, not the code. Separately, pages loaded slowly behind other windows because of App Nap, so the browser now holds it off while anything is loading, which roughly halved load times.",
            },
            {
              title: "Where Apple draws the line",
              body: "The iCloud Passwords extension starts Apple's helper over native messaging, and macOS kills the helper on launch. Apple only lets it run for browsers that pass its code-signing rules. I tested ad hoc signing, an Apple Development certificate, and that certificate with the hardened runtime; all three were killed. A Developer ID certificate with notarization is next. Until then, the browser says what happened instead of failing silently.",
            },
          ]}
        />
      </section>
    </CaseStudyShell>
  )
}
