import type { Metadata } from "next"
import {
  CaseStudyHeader, CaseStudyShell, DashList, Intro, P, SectionHeading, Stats, Stories, Terminal,
} from "@/components/case-study"
import { LiveStatus, STATUS_GIST_ID } from "@/components/live-status"
import { ScreenshotTabs } from "@/components/screenshot-tabs"

const DESCRIPTION =
  "Uptime and security monitoring for my deployed sites, written in Go with only the standard library."

export const metadata: Metadata = {
  title: "Sentinel — Mason Kimball",
  description: DESCRIPTION,
  openGraph: { title: "Sentinel — Mason Kimball", description: DESCRIPTION },
}

const IMG = "/images/projects/sentinel"

const CLI = `$ sentinel
   SITE        CHECK          DETAIL
✓  parliament  status         200 in 251ms
✓  parliament  tls            expires in 45 days (2026-11-14)
✓  parliament  headers        all security headers present
✓  parliament  exposed-files  1 sensitive path(s) not exposed
✓  portfolio   status         200 in 167ms
✓  portfolio   tls            expires in 89 days (2026-12-28)
✓  portfolio   headers        all security headers present
✓  portfolio   exposed-files  4 sensitive path(s) not exposed`

export default function SentinelCaseStudy() {
  return (
    <CaseStudyShell>
      <CaseStudyHeader
        title="Sentinel"
        tagline="Uptime and security monitoring for my deployed sites"
        tech={["Go", "GitHub Actions", "ntfy"]}
        links={[{ label: "GitHub", href: "https://github.com/MasonKimball05/go-sentinel", primary: true }]}
      />

      <Intro accent="border-l-emerald-500">
        <P>
          Sentinel watches my deployed sites from the outside — Parliament and this portfolio — and pings my
          phone when something changes. It checks that each site is up and fast, that its TLS certificate isn’t
          about to expire, that it sends the security headers browsers rely on, and that files like{" "}
          <code className="text-foreground">.env</code> or <code className="text-foreground">.git/HEAD</code>{" "}
          aren’t publicly readable.
        </P>
        <P>
          I wrote it to learn Go. It uses only the standard library, runs as a CLI, a local dashboard, or on a
          GitHub Actions schedule, and ships as a single binary.
        </P>
      </Intro>

      {STATUS_GIST_ID && (
        <section className="space-y-4">
          <SectionHeading title="Live Right Now" subtitle="Published by Sentinel's scheduled run; refreshes every 30 minutes." />
          <LiveStatus showLink={false} />
        </section>
      )}

      <section className="space-y-4">
        <SectionHeading title="In Action" />
        <ScreenshotTabs
          tabs={[
            {
              label: "All clear",
              src: `${IMG}/dashboard-light.jpg`,
              darkSrc: `${IMG}/dashboard-dark.jpg`,
              width: 1600,
              height: 509,
              alt: "Sentinel's dashboard: Parliament and the portfolio, every check passing",
              caption: "The local dashboard (sentinel -serve), re-checking every five minutes.",
            },
            {
              label: "Catching problems",
              src: `${IMG}/problems.jpg`,
              darkSrc: `${IMG}/problems-dark.jpg`,
              width: 1600,
              height: 780,
              alt: "Sentinel flagging a deliberately misconfigured demo site: no HTTPS, five missing security headers, a leaked server version, and a publicly readable .env file",
              caption: "Next to my two real sites, a deliberately misconfigured demo site, the kind of staging server that ends up public by accident. Sentinel catches all of it.",
              points: [
                "No HTTPS, five missing security headers, and a Server header that leaks the exact software version",
                "A publicly readable .env file. Sentinel checks the content, not just the status code, so an HTML \"not found\" page or a redirect to a login screen doesn't count as a leak",
              ],
            },
          ]}
        />
        <Terminal>{CLI}</Terminal>
      </section>

      <section className="space-y-6">
        <SectionHeading title="Under the Hood" />

        <Stats
          items={[
            { value: "0", label: "third-party dependencies" },
            { value: "5", label: "checks per site" },
            { value: "30 min", label: "schedule on GitHub Actions" },
            { value: "27", label: "automated tests" },
          ]}
        />

        <DashList
          title="How it works"
          items={[
            "Each site is checked in its own goroutine; the homepage is fetched once and every check reads that single response, TLS certificate included",
            "Alerts fire on change, not on every run: a small state file remembers each check's last status, so a day-long outage is one alert, not 48 — plus one when it recovers",
            "If a notification fails to send, the change is rolled back and retried on the next run; state is written atomically so a crash can't corrupt it",
            "On GitHub Actions, the state file is carried between runs in the Actions cache, so the checks come from outside my network even while my laptop sleeps",
            "The dashboard is compiled into the binary with go:embed, listens on localhost only, and refuses cross-site requests to its Run button",
          ]}
        />

        <Stories
          title="Bugs worth remembering"
          stories={[
            {
              title: "My own monitor got me banned from my own site",
              body: "The very first run probed Parliament for /.env and /.git — which are honeypot routes I'd built into Parliament to catch scanners. It did its job: my IP was banned within seconds. Sentinel now takes a per-site list of paths it must never request, and the README warns about it in bold.",
            },
            {
              title: "Telling a real leak from a “soft 404”",
              body: "Plenty of sites answer a missing /.env with 200 OK and an HTML error page, and a redirect to a login page can look like success too. Each probe now checks for the file's real signature — a git HEAD starts with “ref:”, a .DS_Store with its magic bytes — and uses an HTTP client that never follows redirects.",
            },
            {
              title: "A recovery that could never be detected",
              body: "An unreachable site originally reported a “reachable” check that disappeared once the site came back, so there was nothing to compare against and no recovery alert. Reporting it under the “status” check every site always has fixed it — the kind of bug you only find by writing the state-change tests.",
            },
            {
              title: "It flagged this portfolio too",
              body: "Sentinel reported that this site was missing all five security headers. GitHub Pages can't set custom headers, so I put Cloudflare in front of it and added them with a response-header rule, including a Content-Security-Policy built from exactly what the site loads. The check has been green since.",
            },
          ]}
        />
      </section>
    </CaseStudyShell>
  )
}
