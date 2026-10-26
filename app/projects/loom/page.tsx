import type { Metadata } from "next"
import {
  CaseStudyHeader, CaseStudyShell, DashList, Intro, P, SectionHeading, Stats, Stories, Terminal,
} from "@/components/case-study"

const DESCRIPTION =
  "A desktop IDE in Tauri, Rust and React: real language servers, a debugger, git down to single lines, Claude Code, and a local model that works on its own while I'm away."

export const metadata: Metadata = {
  title: "Loom — Mason Kimball",
  description: DESCRIPTION,
  openGraph: { title: "Loom — Mason Kimball", description: DESCRIPTION },
}

const KEYS = `⌘P                 → quick open, fuzzy
⌘⇧P                → every command, by name
F2                 → rename a symbol across files; one ⌘Z undoes all of it
⌥F12               → peek the definition, editable, under the current line
F5                 → debug Python, Go, Node, Rust or C
⌥⌘P, then ⌘⇧C      → click an element in the preview, open the template line that made it
⌘Esc               → Claude Code, in the open folder
⌘⇧R                → every repo's git state, and the commit graph`

export default function LoomCaseStudy() {
  return (
    <CaseStudyShell>
      <CaseStudyHeader
        title="Loom"
        tagline="My own IDE, small enough to read end to end and change however I like"
        tech={["TypeScript", "React", "Rust", "Tauri", "CodeMirror"]}
        links={[{ label: "GitHub", href: "https://github.com/MasonKimball05/Loom", primary: true }]}
      />

      <Intro accent="border-l-purple-500">
        <P>
          Loom is a desktop IDE. Rust (through Tauri) does the work with the operating system, React and CodeMirror 6
          draw the editor, and real language servers provide the code intelligence. Every feature is a module that
          registers its own commands, views and settings, and I can add my own in plain JavaScript without a rebuild.
        </P>
        <P>
          It brings in two tools I built earlier: Repo Radar&apos;s dashboard and KrakenLite&apos;s commit graph live
          in it as the Repos module. It runs on my Mac and my Windows desktop, and it talks to homebase there: for the
          desktop&apos;s GPU running a local model, and for a queue of coding tasks that model works on while I&apos;m
          away.
        </P>
      </Intro>

      <section className="space-y-6">
        <SectionHeading title="What It Does" />
        <Terminal>{KEYS}</Terminal>
        <DashList
          items={[
            "Language servers for diagnostics, completion, hover, go to definition, rename, references, code actions and formatting. Pyright is bundled; more install from Open VSX",
            "A debugger over the Debug Adapter Protocol for Python, Go, Node and TypeScript, Rust and C, with breakpoints, inline values, hover, Run to Cursor, and attaching to a running program",
            "Git: stage single hunks or selected lines, blame, branches, stashes, an interactive rebase you drag to reorder, pull requests through the GitHub CLI, and merge conflicts labelled in plain words",
            "A preview of the local dev server docked beside the editor. Click an element and Loom opens the Django template or component line that made it",
            "Claude Code in a panel, connected to Loom as its IDE, so its edits open as diff tabs to accept or reject. It runs on my subscription through the CLI, never an API key",
            "A Local AI panel for a model in Ollama that reads, searches and edits the project, every change shown as a diff first, plus inline completions and search by meaning",
            "Away: tasks queued on my desktop that the local model works on when I'm idle, each on its own branch, then tested, checked and reviewed by Claude before I merge or discard it",
          ]}
        />
      </section>

      <section className="space-y-6">
        <SectionHeading title="Under the Hood" />

        <Stats
          items={[
            { value: "~28k", label: "lines of TypeScript" },
            { value: "~12.5k", label: "lines of Rust" },
            { value: "~550", label: "front-end and Rust tests" },
            { value: "11", label: "benchmark tasks for the local model" },
          ]}
        />

        <DashList
          title="How it works"
          items={[
            "The UI rests on three small pieces: a store, a command registry and a module API. The built-in features use the same API a user's module would",
            "Every OS call is a typed Rust command: files, terminals, language servers, debug adapters, git, Ollama. The page itself can only talk to Loom, so network calls go through Rust",
            "Reading git never takes its index lock. Staging and committing do, so they share one mutex in Rust and can't race. Status comes from git's NUL-separated format, so any file name is safe",
            "Partial staging sends only which lines to stage plus a fingerprint of the text shown. Rust re-reads both sides and builds the patch itself, and applies nothing if the file changed since the diff was drawn",
            "Extensions come from Open VSX, and Loom copies out only what it needs: themes, snippets, a language server's files. An extension's JavaScript never runs",
            "The local model can't leave the open folder (no .., absolute paths or symlinks out), can't write under .git, and never overwrites a file with unsaved edits. Every change it makes is kept in a local history, so a whole message can be undone",
          ]}
        />

        <Stories
          title="Decisions that took more than one try"
          stories={[
            {
              title: "Ours and theirs, in plain words",
              body: "Git's \"ours\" and \"theirs\" swap meaning during a rebase, so the same conflict reads backwards depending on how you got there. Loom hides the raw markers and labels each half for what it is: \"Your branch: main\" and \"Incoming from feature/x\" in a merge, \"Already on main\" and \"Your change being replayed\" in a rebase. Each label shows the last commit on that side that touched the file.",
            },
            {
              title: "No \"run any git command\" bridge",
              body: "The easy way to wire git into the UI is one command that takes arguments. But git options can run programs (-c core.sshCommand=…), so each action is its own Rust function, and every branch, ref and stash name is checked with git check-ref-format first. Paths always go after --, and the commit message goes to git on stdin, so quotes and newlines need no escaping.",
            },
            {
              title: "A preview that can't reach Loom",
              body: "The preview is a second webview inside Loom's window, and the page in it is code I'm developing, so it shouldn't be able to call Loom's commands. Tauri treats it as a remote origin, which reaches nothing unless a capability allows it, and its one capability grants a single message-forwarding command. Navigation outside localhost is cancelled. The less obvious gap: in development, Loom's own UI is served from localhost too, and a preview of that origin would have been treated as Loom itself. That origin is refused by name.",
            },
            {
              title: "Completions that went missing",
              body: "basedpyright's suggestions often didn't show up. Each lookup was creating a new completion source, and CodeMirror tracks sources by identity, so it kept throwing the server's results away. Completion now routes through fixed sources, and a name both the grammar and the server offer is listed once.",
            },
            {
              title: "Teaching the local model, then checking it",
              body: "Qwen kept making the same kinds of mistakes: inventing a function it was told to use, writing little scripts to \"try\" code it can't run, re-running tests that had already passed. Each one goes into the project's QWEN.md, which it reads at the start of every conversation, and the worst ones are now refused in code. To see whether that helps, I wrote a benchmark of small tasks built from that list. Each runs in a scratch repo with Loom's own agent loop and is graded by hidden tests and which files changed, never by another model. Every grader has a good answer that must pass and bad ones that must fail.",
            },
          ]}
        />
      </section>
    </CaseStudyShell>
  )
}
