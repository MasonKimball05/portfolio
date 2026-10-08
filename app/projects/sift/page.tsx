import type { Metadata } from "next"
import {
  CaseStudyHeader, CaseStudyShell, DashList, Intro, P, SectionHeading, Stats, Stories, Terminal,
} from "@/components/case-study"

const DESCRIPTION =
  "A file sorter for macOS in Rust. It files new downloads by rules you can read, starts out only suggesting moves, and can undo every one."

export const metadata: Metadata = {
  title: "sift — Mason Kimball",
  description: DESCRIPTION,
  openGraph: { title: "sift — Mason Kimball", description: DESCRIPTION },
}

const RULE = `[[rule]]
name = "Canvas downloads"
from_hosts = ["instructure.com"]
to = "~/Documents/School/{course}"
tags = ["School"]

[[rule]]
name = "Receipts"
extensions = ["pdf"]
text_any = ["receipt", "order total", "amount paid", "payment received", "invoice"]
to = "~/Documents/Finance/{year}"
rename = "{date} {name}"
tags = ["Finance"]`

const EXPLAIN = `$ sift explain ~/Downloads/Lab3.pdf
~/Downloads/Lab3.pdf
  type:          pdf
  arrived:       Oct 7, 2026 9:04 PM
  unused for:    0 days
  from:          samford.instructure.com
  course:        COSC 470
  tags:          (none)
  text:          (none read)

  ✗ Screenshots: name doesn't match /^Screen ?[Ss]hot /
  ✗ Installers: not a dmg/pkg file
  ✓ Canvas downloads  →  ~/Documents/School/COSC 470/Lab3.pdf`

export default function SiftCaseStudy() {
  return (
    <CaseStudyShell>
      <CaseStudyHeader
        title="sift"
        tagline="Sorts new files in Downloads and Desktop into the right folders, by rules you can read"
        tech={["Rust", "Tauri", "JavaScript", "macOS"]}
        links={[{ label: "GitHub", href: "https://github.com/MasonKimball05/sift", primary: true }]}
      />

      <Intro accent="border-l-orange-600">
        <P>
          My Downloads folder is where class files, receipts, screenshots and installers pile up. sift watches it and
          Desktop, and files each new arrival where it belongs. A Canvas download goes to that course&apos;s folder, a
          receipt goes to Finance with the date on its name, and screenshots go into a folder for the month.
        </P>
        <P>
          I wrote it in Rust to learn the language, so the code is written to be read, with a suggested order in the
          README. It starts out only suggesting moves for me to approve, and it can put back anything it moved.
        </P>
      </Intro>

      <section className="space-y-6">
        <SectionHeading title="Rules You Can Read" subtitle="The first rule that matches wins" />
        <Terminal>{RULE}</Terminal>
        <DashList
          items={[
            "Conditions are which folder, the file type, a name pattern, the site it was downloaded from, words inside PDFs and text files, and how long since it was opened",
            "Actions move, rename with {date}, {year}, {month} and {course}, add Finder tags, or send to the Trash",
            "sift explain shows everything sift knows about a file and why each rule does or doesn't match",
          ]}
        />
        <Terminal>{EXPLAIN}</Terminal>
      </section>

      <section className="space-y-6">
        <SectionHeading title="Under the Hood" />

        <Stats
          items={[
            { value: "~1.9k", label: "lines of Rust in the library" },
            { value: "24", label: "tests" },
            { value: "3", label: "ways in: watcher, command line, app" },
            { value: "0", label: "files overwritten, by design" },
          ]}
        />

        <DashList
          title="How it works"
          items={[
            "A library holds the whole pipeline, from facts about a file to matching rules to moving it. The command line and a Tauri desktop app are thin layers over it",
            "The watcher gets file events over a channel and waits until a file has sat unchanged for a few seconds, so half-finished downloads are never touched",
            "Where a file came from is the download URL macOS stores in an extended attribute. A Canvas link has the course number in it, and Daybook keeps a list of my course numbers and names",
            "Every move is logged as a line of JSON, which is what Undo reads. The Trash is Finder's own, so Put Back works too",
            "Only files directly in a watched folder are sorted, never their subfolders, and a taken name becomes \"name (2)\"",
          ]}
        />

        <Stories
          title="Decisions that took more than one try"
          stories={[
            {
              title: "One odd PDF shouldn't stop the sorter",
              body: "The PDF reader I use panics on some unusual files instead of returning an error, and a panic would take the whole watcher down. sift wraps that one call in catch_unwind, which turns a panic back into an ordinary error, and quiets the panic message while it does. The PDF's text is only read if a rule actually asks for it.",
            },
            {
              title: "Editing settings without losing comments",
              body: "The app lets you choose folders and turn rules on and off, but rewriting the rules file from scratch would wipe out every comment explaining it. The settings use toml_edit, which edits the file in place and keeps its comments and layout. Each edit is a plain function from the old text to the new one, so each is easy to test.",
            },
            {
              title: "Suggest first, move later",
              body: "A sorter that moves the wrong file is worse than none. sift begins in suggest mode, where moves wait in a review list grouped by rule, with Move and Leave on each. Once the suggestions have looked right for a while, one setting switches it to moving files itself.",
            },
            {
              title: "A permission prompt that names the right app",
              body: "macOS asks before an app reads Downloads, and the prompt names whoever is asking. When the background watcher was a separate command-line tool, the prompt named that instead. Now the watcher is the sift app itself, started in the background at login by a LaunchAgent, so the prompt says sift.",
            },
          ]}
        />
      </section>
    </CaseStudyShell>
  )
}
