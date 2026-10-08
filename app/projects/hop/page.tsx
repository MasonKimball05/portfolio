import type { Metadata } from "next"
import {
  CaseStudyHeader, CaseStudyShell, DashList, Intro, P, SectionHeading, Stats, Stories, Terminal,
} from "@/components/case-study"

const DESCRIPTION =
  "A keyboard launcher for macOS in the spirit of Raycast, in Swift. Apps, math, dates, clipboard history, and shortcuts into the apps I've built."

export const metadata: Metadata = {
  title: "hop — Mason Kimball",
  description: DESCRIPTION,
  openGraph: { title: "hop — Mason Kimball", description: DESCRIPTION },
}

const EXAMPLES = `vsc                    → Visual Studio Code
(12+8)*1.08            → 21.6
5 km in miles          → 3.106855961 mi
3pm cst in berlin      → the same moment in Berlin
de good morning        → German, translated on-device
repo daybook           → branch, uncommitted and unpushed, open in Xcode
port 3000              → what's listening, and quit it
log study 10-11pm      → an hour of study, logged in Daybook`

export default function HopCaseStudy() {
  return (
    <CaseStudyShell>
      <CaseStudyHeader
        title="hop"
        tagline="A keyboard launcher for macOS, and a front door to the apps I've built"
        tech={["Swift", "AppKit", "SwiftUI"]}
        links={[{ label: "GitHub", href: "https://github.com/MasonKimball05/hop", primary: true }]}
      />

      <Intro accent="border-l-lime-500">
        <P>
          Press ⌥Space, type a few letters, press Return. hop opens apps, does math and unit conversions, answers
          time zone questions, translates on-device, and keeps a searchable clipboard history. It&apos;s the
          kind of tool I use a hundred times a day, so I wanted to know how one works from the inside.
        </P>
        <P>
          It&apos;s also how I reach everything else I&apos;ve built. It can restart an app on my desktop through
          homebase, play a movie from shelf in Media Player, show job follow-ups from Job Tracker, and add tasks or log
          time in Daybook, all without opening any of them.
        </P>
      </Intro>

      <section className="space-y-6">
        <SectionHeading title="What It Does" />
        <Terminal>{EXAMPLES}</Terminal>
        <DashList
          items={[
            "Fuzzy app search where apps I open often rise to the top, without burying a much better match",
            "A calculator, unit conversions, time zones, date math and Unix timestamps, answered as you type",
            "Clipboard history and snippets with {date}, {time} and {clipboard} placeholders",
            "My repos with their git status, opened in the IDE that fits the language. Open ports, quicklinks, web search and system commands",
            "Daybook's next event at the top when nothing is typed, and Return on a task checks it off",
          ]}
        />
      </section>

      <section className="space-y-6">
        <SectionHeading title="Under the Hood" />

        <Stats
          items={[
            { value: "0", label: "third-party dependencies" },
            { value: "~3.2k", label: "lines of Swift" },
            { value: "44", label: "tests" },
            { value: "1", label: "global shortcut, no permissions" },
          ]}
        />

        <DashList
          title="How it works"
          items={[
            "The parsing and ranking (fuzzy matching, the calculator, units, dates, Daybook commands) live in a HopCore package with no UI, which is what the tests cover",
            "The shortcut uses Carbon's RegisterEventHotKey. It needs no Accessibility permission, and the key press never reaches the app in front",
            "Fuzzy matching scores characters in order, with bonuses for word starts, runs, prefixes and initials. How often you open an app adds a boost on a log scale, so a favorite rises without outranking a far better match",
            "The calculator is a small recursive-descent parser. It only answers input that looks like math, so typing an app name never shows a number",
            "hop never touches Calendar, Reminders or my servers' data directly. Daybook writes a small JSON file for hop to read and answers daybook:// links, and the desktop services each have their own API",
          ]}
        />

        <Stories
          title="Decisions that took more than one try"
          stories={[
            {
              title: "A panel that doesn't steal focus",
              body: "If the launcher becomes the active app, the app you were in loses focus, and pasting from clipboard history lands in the wrong place. hop uses a non-activating panel, the same trick Spotlight uses. It takes the keyboard without making hop the active app, so whatever you were working in stays in front.",
            },
            {
              title: "Safari was missing from the results",
              body: "The app index skipped hidden files, which seemed harmless. On current macOS, /Applications/Safari.app is a symlink into a sealed part of the system called a cryptex, and that option quietly dropped it. The index now walks the app folders without it and filters what it finds itself.",
            },
            {
              title: "Never recording a password",
              body: "Clipboard history is kept in memory only, and anything a password manager marks as concealed or transient is never recorded. Apps announce that with pasteboard types listed at nspasteboard.org, which hop checks on every copy.",
            },
            {
              title: "Getting the math right",
              body: "-3^2 is -9, not 9, and 2^3^2 is 512, because powers bind tighter than a minus sign and group from the right. The tests pin both. For units, Foundation's pound and ounce are rounded, so hop defines them exactly.",
            },
          ]}
        />
      </section>
    </CaseStudyShell>
  )
}
