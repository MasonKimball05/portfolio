import type { Metadata } from "next"
import {
  CaseStudyHeader, CaseStudyShell, DashList, Intro, P, SectionHeading, Stats, Stories, Terminal,
} from "@/components/case-study"

const DESCRIPTION =
  "My own calendar app for Mac and iPhone, in Swift. Every calendar, my tasks, coding time, sleep and a morning brief in one place, synced through iCloud with no server."

export const metadata: Metadata = {
  title: "Daybook — Mason Kimball",
  description: DESCRIPTION,
  openGraph: { title: "Daybook — Mason Kimball", description: DESCRIPTION },
}

const QUICK_ADD = `submit lab report friday 3pm !high    → task, due Fri 3:00 PM, high priority
event coffee with Sam thu 2pm         → event on Thursday at 2:00 PM
daybook://log?title=Study&start=…     → an hour of study, logged from hop`

export default function DaybookCaseStudy() {
  return (
    <CaseStudyShell>
      <CaseStudyHeader
        title="Daybook"
        tagline="One agenda for every calendar, my tasks and where my time goes, on Mac and iPhone"
        tech={["Swift", "SwiftUI", "EventKit", "HealthKit", "WidgetKit"]}
        links={[{ label: "GitHub", href: "https://github.com/MasonKimball05/Daybook", primary: true }]}
      />

      <Intro accent="border-l-blue-500">
        <P>
          My week lives in too many places. Classes are on Samford&apos;s Outlook calendar, assignments come from
          Canvas, chapter events come from Parliament, job follow-ups come from Job Tracker, and my own plans are in
          iCloud. Daybook reads all of them through the calendars macOS already syncs and shows them as one agenda,
          with my tasks (Apple Reminders) in the same list.
        </P>
        <P>
          It grew into the hub for my day. It tracks the hours I spend coding from my git commits, pulls my sleep from
          Apple Health, finds subscriptions in my billing emails, and writes a summary that a scheduled Claude agent
          turns into a morning brief on my phone. The Mac and iPhone apps share one codebase and stay in step through
          iCloud, so there&apos;s no server to run.
        </P>
      </Intro>

      <section className="space-y-6">
        <SectionHeading title="What It Does" />
        <DashList
          items={[
            "Today, Week, Month and Agenda views, with free time shown between events. Drag a task onto a free stretch to block the time, or let Plan My Day fit urgent and overdue tasks into today",
            "Quick add in plain English, from the app, the menu bar (⌃⌥Space from anywhere), Siri, or my launcher hop",
            "Mark calendar events done, even on calendars I can't edit, like school's. Priorities from none to urgent, with alerts that keep nagging for urgent tasks",
            "A Time tab for Sunday to Saturday. Hours by calendar, coding by repo, sleep, time I log by hand, and free time measured from when I actually woke up",
            "Canvas assignments become tasks, and checking one off marks the assignment done on the calendar too",
            "Widgets, a menu bar countdown to the next event, and leave-by alerts from Apple Maps travel time",
          ]}
        />
        <Terminal>{QUICK_ADD}</Terminal>
      </section>

      <section className="space-y-6">
        <SectionHeading title="Under the Hood" />

        <Stats
          items={[
            { value: "0", label: "third-party dependencies" },
            { value: "~8.5k", label: "lines of Swift" },
            { value: "66", label: "tests, run in GitHub Actions" },
            { value: "3", label: "targets: Mac, iPhone, widgets" },
          ]}
        />

        <DashList
          title="How it works"
          items={[
            "EventKit is the only way in. Everything it returns is copied into plain value types, so the views and the shared logic never touch EventKit and the logic is testable on its own",
            "The rules (parsing, grouping days, free time, sessions from commits, the weekly recap) live in a separate DaybookCore package with no UI, which is what the 66 tests cover",
            "The Mac app gathers what only a Mac can see, like git history, Mail and the GitHub CLI. The iPhone reads Health. Each shares what the other needs through iCloud",
            "Read-only where it matters. It reads Mail but never marks, moves or sends anything, and other apps can only add or check off through daybook:// links, never read or delete",
          ]}
        />

        <Stories
          title="Decisions that took more than one try"
          stories={[
            {
              title: "Syncing two apps without a server",
              body: "Calendar events have no \"done\" of their own, and a school calendar can't be written to at all. So a done mark is a completed reminder in a hidden Daybook list in iCloud, with a daybook:// link saying which event it belongs to. iCloud already syncs Reminders, so a check on the phone shows on the Mac. The same list now carries the morning brief, event priorities, my sleep and my coding time.",
            },
            {
              title: "Exchange quietly drops links",
              body: "Marks saved to my Samford account came back with their link missing, because Exchange doesn't keep a reminder's URL field. Every mark now writes its link on the first line of the notes as well, and the reader checks both. Later, sleep stopped showing on the Mac even though it was right there in the list. The reader only accepted links with a ?query, and the sleep link had none.",
            },
            {
              title: "A crash that only Swift 6 could see",
              body: "Reading reminders crashed the app at launch with a queue assertion. EventKit calls back on a background queue, and the callback was a closure the compiler had treated as belonging to the main thread. Moving those callbacks into nonisolated helpers that return plain values fixed it, and made the rule clear for every EventKit call after.",
            },
            {
              title: "A four minute email scan",
              body: "Finding subscriptions meant reading 13 months of billing emails through AppleScript, and asking Mail to filter with whose clauses took 252 seconds. Fetching every message's date and sender in one bulk call and filtering in Swift brought it to 67 seconds. It also moved to a weekly background run, so it never holds up the morning brief.",
            },
            {
              title: "Sleep that wasn't there",
              body: "Health showed last night's sleep, but Daybook found none in 60 days. iOS returns empty results instead of an error when an app can't read something, so I added a diagnosis that lists every sleep source the app can see with its newest record. It showed my Garmin had stopped writing to Health in May. The fix was on the Garmin side, and the diagnosis stays in the app.",
            },
          ]}
        />
      </section>
    </CaseStudyShell>
  )
}
