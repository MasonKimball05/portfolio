import type { Metadata } from "next"
import {
  CaseStudyHeader, CaseStudyShell, DashList, Intro, P, SectionHeading, Stats, Stories, Terminal,
} from "@/components/case-study"
import { ScreenshotTabs } from "@/components/screenshot-tabs"

const DESCRIPTION =
  "A process supervisor and dashboard for the apps I self-host on my Windows desktop, and the door to the local models on its GPU. Written in Go with only the standard library."

export const metadata: Metadata = {
  title: "homebase — Mason Kimball",
  description: DESCRIPTION,
  openGraph: { title: "homebase — Mason Kimball", description: DESCRIPTION },
}

const IMG = "/images/projects/homebase"

const CONFIG = `{
  "name": "jobtracker",
  "command": "JobTracker.exe",
  "dir": "C:\\\\Users\\\\Admin\\\\apps\\\\jobtracker",
  "env_file": "C:\\\\Users\\\\Admin\\\\apps\\\\jobtracker\\\\jobtracker.env",
  "health": "http://127.0.0.1:5206/",
  "autostart": true,
  "restart_when_unhealthy": true,
  "source": {
    "repo_dir": "C:\\\\Users\\\\Admin\\\\projects\\\\job-tracker",
    "build": ["dotnet", "publish", "src\\\\JobTracker", "-c", "Release", "-o", "..."]
  }
}`

const AWAY_CONFIG = `"away": {
  "idle_minutes": 20,
  "rounds": 2,
  "push": ["Parliament-Dev"],
  "autofill": { "Parliament-Dev": 8 },
  "tests": {
    "Parliament-Dev": "python manage.py test --noinput"
  }
}`

export default function HomebaseCaseStudy() {
  return (
    <CaseStudyShell>
      <CaseStudyHeader
        title="homebase"
        tagline="A process supervisor and dashboard for my desktop, and the door to its local models"
        tech={["Go", "Windows", "Tailscale", "ntfy", "Ollama"]}
        links={[{ label: "GitHub", href: "https://github.com/MasonKimball05/homebase", primary: true }]}
      />

      <Intro accent="border-l-amber-500">
        <P>
          My Windows desktop hosts my own apps, Job Tracker, Sentinel, Shelf, Gradtrack and KrakenLite, plus
          Ollama. I reach them from anywhere over Tailscale. homebase keeps them running. It starts every app at boot,
          restarts anything that crashes, health-checks each one, and gives me one dashboard with live logs and
          start, stop and restart buttons.
        </P>
        <P>
          Adding an app is one entry in a JSON file. When I push changes to GitHub, one command pulls, rebuilds and
          redeploys an app on the desktop, or homebase itself. If something breaks, my phone gets a notification.
        </P>
        <P>
          The desktop also has the GPU, so homebase grew into the way I use it from my Mac and phone: a chat page
          for the Qwen models Ollama runs there, a view of what changed in my git projects on the desktop, and
          Away, which works through a queue of coding tasks with the local model while I&apos;m not at the desk.
        </P>
      </Intro>

      <section className="space-y-4">
        <SectionHeading title="In Action" />
        <ScreenshotTabs
          tabs={[
            {
              label: "Dashboard",
              src: `${IMG}/dashboard.jpg`,
              darkSrc: `${IMG}/dashboard-dark.jpg`,
              width: 1600,
              height: 727,
              alt: "The homebase dashboard on my desktop showing Job Tracker and Sentinel running, with uptime, response time, memory, restarts and controls",
              caption: "The real dashboard on my desktop: every app's state, response time, memory, restart count and last exit, with controls and live logs.",
            },
            {
              label: "Crash recovery",
              src: `${IMG}/recovery.jpg`,
              width: 1600,
              height: 1133,
              alt: "A demo app crashing repeatedly while homebase restarts it with delays of 2, 4, 8 and 16 seconds, shown in the live log viewer",
              caption: "A deliberately broken demo app. Each crash doubles the wait before the next restart, up to a minute, so a broken app can't spin the CPU, and the dashboard flags it as needing attention.",
              points: [
                "App output (white), errors (red) and homebase's own notes (blue) stream into the log viewer and a rotating log file",
                "Three or more restarts within ten minutes sends a phone alert, and another when the app recovers",
              ],
            },
          ]}
        />
      </section>

      <section className="space-y-6">
        <SectionHeading title="The Desktop&apos;s GPU, From Anywhere" />
        <DashList
          items={[
            "A chat page for the models Ollama runs on the desktop. Answers stream in, Stop cancels the generation, and conversations stay in that browser",
            "homebase proxies a short list of Ollama's endpoints (version, models, loaded models, chat, generate and embed) for other tools, like Loom on my Mac. Nothing that pulls, creates or deletes models is reachable, and Ollama itself never listens on the network",
            "A live strip shows GPU load, VRAM, GPU temperature, RAM, CPU and how much of the loaded model fits on the GPU. A warning appears when VRAM, RAM, CPU or GPU temperature stays over its limit for a couple of readings, or when a model doesn't fit on the GPU",
            "A Projects page lists every git repo in my project folders on the desktop, with its uncommitted diff and file tree, plus Fetch, fast-forward-only Pull, Push without force, and Commit, which refuses if a secret-looking file would go in",
            "Remote editing, off by default, lets Loom open those projects in place. It needs its own token, saves through a temporary file so a dropped connection never leaves half a file, and moves deleted files aside instead of removing them",
          ]}
        />
      </section>

      <section className="space-y-6">
        <SectionHeading title="Away" subtitle="Coding tasks that run while I&apos;m out" />
        <P>
          I queue a task from the dashboard, and the desktop works on it when Away is on, or once nobody has touched
          the PC for 20 minutes. It stops the moment someone does, and the task goes back to the front of the queue.
        </P>
        <DashList
          title="One task"
          items={[
            "A git worktree on a new away/ branch, so my own checkout is never touched",
            "The local model (qwen3-coder 30B) does the task there, then Away runs the test files it touched. A failure goes straight back to the model without spending a review",
            "A quick check of the diff catches names the task asked for that the code never uses, constants typed out as numbers, and a test count that doesn't match the cases listed",
            "For a tests task, Away breaks the function under test on purpose, one small change at a time, and checks that the new tests notice. Changes they miss go back to the model once",
            "Claude Code reviews the branch read-only and passes it or sends it back with notes, up to two rounds. If it still hasn't passed, Claude finishes it",
            "My phone gets a notification. Accept merges the branch, Discard deletes it. Nothing is pushed except away/ branches of the projects I list, and never with force",
          ]}
        />
        <DashList
          title="Learning from its own history"
          items={[
            "Every finished attempt is kept: each round's transcript and diff, Claude's verdicts, who wrote the result, and whether I accepted it",
            "A new task is shown up to two similar accepted ones and one reviewer lesson, found by embedding. Every third task gets none on purpose, so the track record on the Away page compares fairly",
            "When the queue is empty it writes tasks for itself, up to 8 a day for Parliament-Dev. Claude writes the tests as an answer key and the task is queued only if they pass. Every third one is a drill: a bug planted in a function whose accepted tests catch it, to find and fix",
            "Each round is also graded on how the model showed its thinking, apart from the verdict. Away counts how many tool calls it explained first, and the reviewer rates the quality of its reasons from 1 to 5 and flags anything it claimed but didn't do",
          ]}
        />
        <Terminal>{AWAY_CONFIG}</Terminal>
      </section>

      <section className="space-y-6">
        <SectionHeading title="Under the Hood" />

        <Stats
          items={[
            { value: "0", label: "third-party Go dependencies" },
            { value: "~8.9k", label: "lines of Go, plus ~4.3k of tests" },
            { value: "160", label: "test functions" },
            { value: "6", label: "apps in the desktop's config" },
          ]}
        />

        <DashList
          title="How it works"
          items={[
            "One goroutine per app owns that app's process. Buttons and health checks send it requests over a channel instead of touching the process, so two restarts can never race to launch duplicate copies",
            "Each app is a small state machine: stopped, starting, running, stopping, restarting after a crash, crashed, or external",
            "External means something is already answering on the app's health URL. homebase reports it instead of starting a second copy that would fail on a port conflict",
            "The dashboard can only start and stop apps listed in the config. There's no API for running arbitrary commands, and every button requires a custom header and rejects cross-site requests, so another website can't press them for you",
            "Secrets live in per-app env files outside the repo; the config itself is committed to git. Unknown config keys are rejected, so a typo fails loudly",
            "The Projects and remote-editing routes refuse any path that leaves its project: .., absolute paths, drive letters, symlinks out and .git. Files that usually hold secrets are listed but never sent",
          ]}
        />

        <Terminal>{CONFIG}</Terminal>

        <Stories
          title="Decisions that took more than one try"
          stories={[
            {
              title: "Apps outliving their supervisor",
              body: "If homebase itself was force-killed, say by Task Scheduler or Task Manager, its apps kept running as orphans with no one watching them. The fix is a Windows Job Object: every app joins one job that's set to close with homebase, so Windows ends them automatically however homebase exits. I verified it on the desktop by force-killing homebase and checking that its app died with it.",
            },
            {
              title: "The test suite runs real processes, on Windows too",
              body: "The supervisor tests don't mock anything. The test binary re-runs itself as a tiny app that serves HTTP, crashes, or returns 500s, and the tests start, crash and kill it. I ran the same suite on Windows 11 as well as macOS, which is how I caught that Go refuses to run a program by relative path there.",
            },
            {
              title: "Deploys that can't take the apps down",
              body: "Windows won't overwrite a running .exe, so an update stops the app through homebase, rebuilds, and starts it again, and a failed build brings the old version back up. homebase updates itself the same way: build the new exe, check it against the new config, and only then swap it in, keeping the previous version for a one-step rollback.",
            },
            {
              title: "Sharing Ollama with its own tray app",
              body: (
                <>
                  Ollama normally runs from its tray app, which installs updates as it starts. It can&apos;t replace
                  ollama.exe while homebase&apos;s copy holds it. So Ollama&apos;s entry yields: while the tray app
                  runs, homebase doesn&apos;t start its own copy, and it stops its copy when the tray app starts. If
                  nothing answers within 3 minutes, homebase starts its copy anyway.
                </>
              ),
            },
            {
              title: "Tests that pass without the code",
              body: (
                <>
                  A test that passes whether or not the code works proves nothing, and reading a diff won&apos;t
                  always show it. So for a tests task Away breaks the function on purpose: replaces it with one that
                  raises, flips a comparison, drops a not, leaves a .filter out of a query, removes a login decorator.
                  It runs the new tests against each change and puts the file back. On one run it found that tests I had
                  already accepted for a Parliament function never checked the order of its results.
                </>
              ),
            },
            {
              title: "A model that isn't answering is different from a broken one",
              body: (
                <>
                  At first, any failure to reach the model switched Away off. Then the PC was switched on while
                  Ollama was still updating itself, and that rule would switch Away off for a model that just
                  wasn&apos;t ready yet. Now a
                  model that doesn&apos;t answer gets the task put back and a retry in 10 minutes, up to 4 tries,
                  before Away switches off and notifies me. A model that answers without calling a single tool, as
                  when Ollama ran with a 4,096-token context, still stops Away straight away.
                </>
              ),
            },
            {
              title: "A pass that read as a fail",
              body: (
                <>
                  Each review ends with one line of JSON holding the verdict. Away found it with a pattern that
                  couldn&apos;t contain braces, so when a review&apos;s notes quoted code with braces in it, the
                  verdict was missed and counted as revise. Claude then redid work the local model had got right.
                  The parser now tries a real JSON decoder from each opening brace, starting at the end.
                </>
              ),
            },
            {
              title: "Grading how it thinks, not only what it ships",
              body: (
                <>
                  I want to see how the model reached its result, so each round counts how many tool calls it
                  explained first. At first any sentence counted, and rounds that were half &quot;Now let me read the
                  file:&quot; came out 75 to 100% explained. Now that filler doesn&apos;t count. When its work goes back anyway
                  and it explained under 80% of its calls, or the reviewer graded its reasons under 4 of 5, the model
                  hears about that with the notes. It never changes the verdict.
                </>
              ),
            },
          ]}
        />
      </section>
    </CaseStudyShell>
  )
}
