import type { Metadata } from "next"
import {
  CaseStudyHeader, CaseStudyShell, DashList, Intro, P, SectionHeading, Stats, Stories, Terminal,
} from "@/components/case-study"
import { ScreenshotTabs } from "@/components/screenshot-tabs"

const DESCRIPTION =
  "A process supervisor and dashboard for the apps I self-host on my desktop — written in Go with only the standard library."

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

export default function HomebaseCaseStudy() {
  return (
    <CaseStudyShell>
      <CaseStudyHeader
        title="homebase"
        tagline="A process supervisor and dashboard for the apps I self-host"
        tech={["Go", "Windows", "Tailscale", "ntfy"]}
        links={[{ label: "GitHub", href: "https://github.com/MasonKimball05/homebase", primary: true }]}
      />

      <Intro accent="border-l-amber-500">
        <P>
          My desktop hosts my own apps, like Job Tracker and Sentinel, and I reach them from anywhere over
          Tailscale. homebase is what keeps them running: it starts every app at boot, restarts anything that
          crashes, health-checks each one, and gives me a single dashboard with live logs and start, stop and
          restart buttons.
        </P>
        <P>
          Adding a project is one entry in a JSON file. When I push changes to GitHub, one command pulls,
          rebuilds and redeploys an app on the desktop, or homebase itself. If something breaks, my phone gets a
          notification.
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
              caption: "A deliberately broken demo app. Each crash doubles the wait before the next restart, so a broken app can't spin the CPU, and the dashboard flags it as needing attention.",
              points: [
                "App output (white), errors (red) and homebase's own notes (blue) stream into the log viewer and a rotating log file",
                "Three or more restarts within ten minutes sends a phone alert, and another when the app recovers",
              ],
            },
          ]}
        />
      </section>

      <section className="space-y-6">
        <SectionHeading title="Under the Hood" />

        <Stats
          items={[
            { value: "0", label: "third-party dependencies" },
            { value: "~1.9k", label: "lines of Go" },
            { value: "36", label: "test functions" },
            { value: "2", label: "platforms tested: Windows, macOS" },
          ]}
        />

        <DashList
          title="How it works"
          items={[
            "One goroutine per app owns that app's process. Buttons and health checks send it requests over a channel instead of touching the process, so two restarts can never race to launch duplicate copies",
            "Each app is a small state machine: stopped, starting, running, stopping, restarting after a crash, crashed, or external",
            "External means something is already answering on the app's health URL, for example the old startup task. homebase reports it instead of starting a second copy that would fail on a port conflict",
            "The dashboard can only start and stop apps listed in the config. There's no API for running arbitrary commands, and the buttons require a custom header, so another website can't press them for you",
            "Secrets live in per-app env files outside the repo; the config itself is committed to git",
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
              body: "The supervisor tests don't mock anything. The test binary re-runs itself as a tiny app that serves HTTP, crashes, or returns 500s, and the tests start, crash and kill it. I cross-compiled the same suite for Windows and ran it on the desktop, which is how I caught that Go refuses to run a program by relative path there.",
            },
            {
              title: "Probing a site can get you banned by it",
              body: "Sentinel, which homebase runs, used to probe for exposed files like /.env. On Parliament those paths are honeypots that ban the visitor's IP, so the first run banned my own IP address. Now any path a site treats as a trap goes in a skip list.",
            },
            {
              title: "Deploys that can't take the apps down",
              body: "Windows won't overwrite a running .exe, so an update stops the app through homebase, rebuilds, and starts it again, and a failed build brings the old version back up. homebase updates itself the same way: build the new exe, check it against the new config, and only then swap it in, keeping the previous version for a one-step rollback.",
            },
          ]}
        />
      </section>
    </CaseStudyShell>
  )
}
