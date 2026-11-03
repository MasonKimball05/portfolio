import type { Metadata } from "next"
import {
  CaseStudyHeader, CaseStudyShell, DashList, Intro, P, SectionHeading, Stats, Stories, Terminal,
} from "@/components/case-study"

const DESCRIPTION =
  "An Arc-style browser for the Mac in Python and PyQt6: Spaces, a command bar, its own passwords and passkeys, its own Chrome extension runtime, and Claude features through the local CLI. Signed, notarized and free."

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
that article on ipv6    → pages found by their text, with when I read them
restart job tracker     → restarts it on my desktop through homebase`

export default function EclipseCaseStudy() {
  return (
    <CaseStudyShell>
      <CaseStudyHeader
        title="Eclipse"
        tagline="My own Arc-style browser for the Mac, built since Arc is being wound down"
        tech={["Python", "PyQt6", "QtWebEngine", "JavaScript"]}
        links={[
          { label: "Download for Mac", href: "https://github.com/MasonKimball05/Eclipse/releases/latest/download/Eclipse.dmg", primary: true },
          { label: "GitHub", href: "https://github.com/MasonKimball05/Eclipse" },
        ]}
      />

      <Intro accent="border-l-amber-500">
        <P>
          Arc is being wound down in favor of Dia. Rather than give up the vertical sidebar, Spaces and a command bar
          in place of a new-tab page, I built my own. Eclipse renders pages with Chromium through Qt WebEngine and
          PyQt6, so sites work as they do in Chrome, and it&apos;s my default browser.
        </P>
        <P>
          It started in April as PythonBrowser, a small project to learn Qt&apos;s signals and slots. It&apos;s now a
          release anyone can download: signed with a Developer ID, notarized by Apple, and updated weekly through
          GitHub Releases. It keeps everything on your Mac, with no accounts, sync servers or analytics, and it works
          with the other apps I&apos;ve built: homebase, Job Tracker, Daybook and Parliament.
        </P>
      </Intro>

      <section className="space-y-6">
        <SectionHeading title="What It Does" />
        <Terminal>{COMMAND_BAR}</Terminal>
        <DashList
          items={[
            "Arc's model: Favorites, Spaces with their own colors, themes and sign-ins, pinned tabs that remember their home page, and Today tabs that archive themselves after 12 hours unused",
            "Split View, Peek, Little windows for links from other apps, Reader view, Notes, Easels (whiteboard tabs) and Live Folders that fill themselves from feeds, GitHub, subreddits, YouTube channels or my own apps' APIs",
            "A welcome that brings over bookmarks, history and passwords from Chrome, Brave, Edge, Safari or Arc, and offers to become the default browser",
            "Its own passwords and passkeys: saved and filled after Touch ID, with strong-password suggestions, two-factor codes, a breached-password check, security keys and address autofill for checkouts",
            "Built-in ad and tracker blocking (YouTube's included), cookie banners answered \"Reject\", tracking tags taken off links, and a Privacy Report of what was blocked, by company, over 30 days",
            "Watch This Page: tell me when a page, or just part of it, changes. Tab previews that show a Gmail or Slack tab's newest unread, and a mini player for video that glides to a corner of the screen",
            "Arc Max's ideas without an API key: tidied tab titles, grouping tabs into folders, a panel for asking about the page, 5-second link previews, Browse for Me, and questions about pages I've read, through the Claude CLI already signed in on the Mac",
            "Motion that follows Arc's and respects Reduce Motion, VoiceOver labels throughout, and a Low Power Mode that freezes background tabs when the Mac is saving battery",
            "Runs on Windows 10 and 11 from source too, with its secrets in Windows Credential Manager",
          ]}
        />
      </section>

      <section className="space-y-6">
        <SectionHeading title="Under the Hood" />

        <Stats
          items={[
            { value: "~42k", label: "lines of Python" },
            { value: "639", label: "tests, plus live window tests" },
            { value: "2", label: "OSes checked on every push" },
            { value: "200k", label: "blocking rules loaded in under 1 s" },
          ]}
        />

        <DashList
          title="How it works"
          items={[
            "Data and widgets are kept apart. Widgets never change data; they ask the main window, which updates the Store, and the Store signals the sidebar to rebuild once per event-loop pass",
            "Web views are lazy: a restored or pinned tab gets no Chromium page until you click it, and tabs left alone go to sleep and come back scrolled to where I was",
            "Passwords are encrypted with AES-256-GCM under a key kept in the macOS Keychain, written through Apple's Security framework so only Eclipse can read it without macOS asking. Passkeys are P-256 keys kept the same way, and a recovery PIN seals a copy of both into backups",
            "The release is a sealed app with its own Python and only the parts of Qt it uses. Its Python is compiled ahead of time and never writes into the app, so Settings can say whether a copy is Verified: exactly as it was signed",
            "Updates come from GitHub Releases, and macOS checks each download before anything happens: signed by the same team, notarized, the right bundle ID and a newer build",
            "Chrome extensions run on my own runtime: content scripts, MV3 service workers as hidden pages, chrome.storage, tabs, ports, native messaging and declarativeNetRequest",
            "GitHub Actions starts the app on a clean Mac and a Windows machine for every push and runs the unit tests. Live tests drive the real window locally against a test site, without ever taking focus",
          ]}
        />

        <Stories
          title="Decisions that took more than one try"
          stories={[
            {
              title: "Keeping passwords where other programs can't read them",
              body: "Chrome's old weakness was that any program could read its encryption key, so stealing passwords meant copying two files. Eclipse's key lives in the Keychain, trusting only Eclipse, so anything else asking gets macOS's prompt. Items made with the security command turned out to trust that command, which any program can run silently, so none of Eclipse's secrets use it any more. Filling a password needs a click on a card and Touch ID, and only on the login's own site: never on http, never in a frame from another site, and never across shared suffixes like github.io.",
            },
            {
              title: "Writing my own extension runtime",
              body: "Qt WebEngine has extension support, but it crashes on macOS. So Eclipse implements the chrome.* APIs itself. Each extension's content scripts run in their own JavaScript world, and Qt only allows its web channel in one world per page, so those worlds talk to Python through console messages stamped with a secret token per world. Forged tokens are ignored, one extension can't act as another, and websites can't reach the runtime at all. The tests check all three.",
            },
            {
              title: "Claude without an API key, and without trusting the page",
              body: "The AI features use the claude CLI that's already signed in, so there's no key and no per-call bill. Starting it takes about 8 seconds, so one process is always kept warm and waiting, and answers begin in under a second. Web pages are untrusted input, so the CLI runs with every tool turned off, no MCP servers and no settings files, from a neutral folder. The worst a hostile page can do is make an answer wrong.",
            },
            {
              title: "Where Apple draws the line",
              body: "Apple's iCloud Passwords helper is killed on launch for browsers that don't pass its signing rules. Ad hoc signing, an Apple Development certificate and the hardened runtime were all refused. Rather than wait, Eclipse got its own passwords and passkeys, and then a Developer ID and notarization. iCloud Keychain still needs Apple to approve Eclipse as a browser, so that switch in Settings stays off until it does.",
            },
            {
              title: "Renaming without losing anything",
              body: "PythonBrowser became Halo, then Eclipse. At first only the visible name changed, and the data folder, Keychain items and bundle ID kept the old one, so nothing was stranded. When it became a signed release it took the new name underneath too, and whatever still has the old name is moved over the first time it's used.",
            },
            {
              title: "Animations that don't stutter",
              body: "The obvious way to open Peek is to grow its card from small to full size. But resizing a web page every frame makes Chromium lay it out again each time, and the animation stutters. Peek opens at full size and only moves into place, which reads the same and stays smooth. The same rule shaped the other animations: move and fade things, but don't resize a page while it animates.",
            },
            {
              title: "Why GitHub took 30 seconds to load",
              body: "curl fetched GitHub in a second while the browser took 15 to 30. The Mac's IPv6 routes went through VPN tunnels that led nowhere, and Chromium tries IPv6 first and waits on each attempt before falling back. The fix was in the network settings, not the code. Separately, pages loaded slowly behind other windows because of App Nap, so the browser now holds it off while anything is loading, which roughly halved load times.",
            },
          ]}
        />
      </section>
    </CaseStudyShell>
  )
}
