import {
  CaseStudyHeader, CaseStudyShell, DashList, Intro, P, Screenshot, SectionHeading, Stats, Stories,
} from "@/components/case-study"
import { ScreenshotTabs } from "@/components/screenshot-tabs"

const IMG = "/images/projects/parliament"

// What the app covers, grouped the way members and officers think about it.
const MODULES: { name: string; body: string }[] = [
  { name: "Legislation & voting", body: "Percentage, exact-count and plurality votes with automatic runoffs, anonymous ballots, and a verifiable receipt for every vote. Resolutions amend the constitution and bylaws, and apply the moment they pass." },
  { name: "Elections", body: "A configurable officer slating process: custom application forms, eligibility and GPA checks, interviews, and secret-ballot rounds." },
  { name: "Committees", body: "Dashboards, committee-level votes that can be pushed to the whole chapter, documents, minutes, and attendance." },
  { name: "Events & attendance", body: "Calendar with .ics subscriptions, recurring series you can edit or delete as a whole, sign-ups with caps and auto-promoting waitlists, attendance with an excuse workflow." },
  { name: "Service hours", body: "Submissions with a custom form builder, approval queues, per-period requirements, and hours credited automatically from service events." },
  { name: "Pledge education", body: "Phases that unlock tasks and pages, quizzes with per-question analysis, points, absence requests, and bigs that can be set ahead of time and revealed later." },
  { name: "Recruitment", body: "Rush events and a candidate pipeline from prospect to bid, with permission tiers for private notes." },
  { name: "Chat & notifications", body: "WebSocket chat for the chapter and each committee, in-app push notifications, and a GroupMe bot that posts announcements and event reminders only to groups whose members can all see them." },
  { name: "Public website", body: "The chapter's public site, fully editable by officers: WYSIWYG content, a photo library, a routed contact form, SEO previews." },
  { name: "Admin & operations", body: "Feature flags, page toggles, audit logs, quarantine and emergency lockdown, and a documented “log in as” support tool." },
]

export default function ParliamentCaseStudy() {
  return (
    <CaseStudyShell>
      <CaseStudyHeader
        title="Parliament"
        tagline="Chapter management platform for Beta Theta Pi · Alpha Mu Chapter"
        tech={["Python", "Django", "PostgreSQL", "Redis", "Django Channels", "Celery", "Tailwind CSS", "Alpine.js"]}
        links={[
          { label: "View Live", href: "https://am-parliament.org", primary: true },
          { label: "GitHub", href: "https://github.com/MasonKimball05/Parliament-New" },
        ]}
      />

      <Intro accent="border-l-primary">
        <P>
          Parliament is the platform I built from scratch to run the Alpha Mu chapter of Beta Theta Pi. It replaced a
          scattered mix of spreadsheets, group chats, and paper sign-in sheets with one app that every active member,
          pledge, and officer uses.
        </P>
        <P>
          It handles chapter business end to end: legislation and elections, committees, events and attendance,
          service hours, pledge education, real-time chat, and the chapter&apos;s public website. Its constitution
          and bylaws live in it too, amended by resolutions that brothers draft and edit together in real time. Security is built
          in rather than bolted on: passkeys, policy-driven two-factor, attack detection, and field-level encryption.
        </P>
        <P>
          I built and maintain it solo. Right now I&apos;m working on multi-chapter support, a mobile app, and the
          documentation future chapter leadership will need to take it over when I graduate in May 2027.
        </P>
      </Intro>

      <Screenshot
        src={`${IMG}/home.jpg`}
        darkSrc={`${IMG}/home-dark.jpg`}
        width={1600}
        height={1225}
        alt="Parliament's member home page: stats, a banner for legislation awaiting the member's vote, upcoming events, announcements, recent legislation results, and quick links"
        caption="A member's home page, following the light/dark theme like the rest of the app. Screenshots use a fictional chapter with made-up members."
      />

      <Stats
        items={[
          { value: "174k", label: "lines of Python" },
          { value: "3,600+", label: "automated tests" },
          { value: "263", label: "versioned releases" },
          { value: "670+", label: "commits, solo" },
        ]}
      />

      <section className="space-y-4">
        <SectionHeading title="Tour the App" subtitle="Real screens from the current version, running on demo data." />
        <ScreenshotTabs
          tabs={[
            {
              label: "Voting",
              src: `${IMG}/vote.jpg`,
              darkSrc: `${IMG}/vote-dark.jpg`,
              width: 1600,
              height: 875,
              alt: "The legislation page with an open bylaw amendment vote (Yes, No, Abstain, and a password field) and a plurality vote the member has already cast",
              caption: "Open votes, as a member sees them. A bylaw amendment needing a two-thirds majority, and a venue vote that runs a runoff automatically if nothing clears a majority.",
              points: [
                "Casting a ballot requires re-entering your password, so an unlocked phone left on a table can't vote for you",
                "Every ballot gets a receipt that the member can later verify was counted",
                "Three vote modes: percentage thresholds, exact counts, and plurality with automatic runoffs",
              ],
            },
            {
              label: "Committees",
              src: `${IMG}/committee.jpg`,
              width: 1600,
              height: 1250,
              alt: "The Brotherhood Committee dashboard with member counts, chairs, advisors, voting members, and actions for documents, votes, minutes, and attendance",
              caption: "A committee dashboard. Chairs manage membership and voting rights, run committee-level votes, keep minutes and documents, and take attendance.",
              points: ["Committee votes can be pushed to a full chapter vote once they pass"],
            },
            {
              label: "Officer portal",
              src: `${IMG}/officers.jpg`,
              width: 1600,
              height: 1200,
              alt: "The officer portal with shortcuts for announcements, events, chapter minutes, executive board minutes, and officer slating, plus recent reports and activity",
              caption: "Where officers run the chapter: announcements (with optional email), events, chapter and executive-board minutes, elections, and an activity feed.",
            },
            {
              label: "Pledge education",
              src: `${IMG}/pledge.jpg`,
              width: 1600,
              height: 1350,
              alt: "A pledge's task list showing points earned, required tasks with due dates, a past-due task, and a graded quiz",
              caption: "A pledge's view of their education program: required tasks, points, quiz scores, and anything past due, flagged so it can't be missed.",
              points: [
                "Quizzes record whether each answer was right, so educators get a question-by-question breakdown",
                "Absence requests for education meetings flow to the educator for approval",
              ],
            },
            {
              label: "Chat",
              src: `${IMG}/chat.jpg`,
              width: 1600,
              height: 875,
              alt: "A real-time chat channel for philanthropy planning",
              caption: "Real-time chat over WebSockets, with channels for the whole chapter and for each committee, and unread badges in the navigation.",
            },
            {
              label: "Public site",
              src: `${IMG}/landing.jpg`,
              width: 1600,
              height: 1075,
              alt: "The chapter's public landing page with the Beta Theta Pi crest, a welcome message, and sections about the chapter",
              caption: "The chapter's public website is part of the same app. Officers edit every word and photo from a WYSIWYG editor, and contact-form messages are routed to the right officer by topic.",
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading title="What It Covers" subtitle="Ten modules, all in one Django project." />
        <div className="grid sm:grid-cols-2 gap-px bg-border border border-border">
          {MODULES.map((m) => (
            <div key={m.name} className="bg-background px-4 py-3 space-y-1">
              <p className="text-sm font-medium">{m.name}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading title="Under the Hood" subtitle="What's actually running in production, not just the UI." />

        <DashList
          title="Architecture"
          items={[
            "Django served by Daphne, one ASGI server handling both HTTP and the WebSocket chat, behind nginx, which accepts traffic only from Cloudflare",
            "PostgreSQL behind PgBouncer for connection pooling; Redis for the cache, sessions, and the real-time channel layer",
            "A Celery worker, with the beat scheduler running inside it, for everything time-based: votes that open and close themselves, event reminders, digest emails, and a weekly weak-password audit",
            "Live co-editing on resolutions over the same WebSocket stack: a save writes only the fields you changed and never over someone else's, fields lock while someone is editing them, and a presence bar shows who else is there",
            "PDF previews are rendered by a short-lived separate process and cached, so a large scan can't tie up the server that answers every other request",
            "Each long-running process is its own systemd service; backups run nightly on a systemd timer",
          ]}
        />

        <DashList
          title="Security & access control"
          items={[
            "WebAuthn passkeys alongside policy-driven TOTP 2FA — the org can require it for admins only, officers and admins, everyone, or set per-user overrides, with a signed “remember this device” cookie",
            "Progressive rate limiting on login, password reset, and passkey auth, scoped by both IP and username with escalating lockouts, persisted for admin visibility",
            "Middleware that scans every request for injection and XSS patterns, auto-quarantining accounts and blacklisting IPs after repeated attempts — logged, not silent",
            "Geo-restriction: a session that logs in from outside the US is flagged and blocked from bulk data exports (member directories, audit logs, service-hour CSVs), matched by resolved URL name so a moved route stays covered",
            "Per-request CSP nonces with no unsafe-inline or unsafe-eval (Alpine.js runs as its CSP build), and explicit no-store cache headers on every dynamic response so a CDN or a phone's back/forward cache can never replay one member's session to someone else",
            "An admin “impersonate user” tool with a single documented allowlist of what it bypasses (account setup screens) versus what it never does (quarantine, lockdown, maintenance mode) — enforced by a test that fails the build if any code reads around it",
          ]}
        />

        <DashList
          title="How it stays reliable"
          items={[
            "3,600+ automated tests run in parallel as a pre-push gate. I cut it from almost five minutes to under one, and made the suite silent so a real failure can't hide in noise. CI runs the whole suite again on PostgreSQL",
            "Rules are enforced by tests rather than by memory: a test fails the build if a route captures a member id as a number, if a GET request changes state, if a submit button renders outside its form, if a page goes over its query budget, or if code reads the impersonation session key directly",
            "Every one of the 263 releases has its own changelog, a deployment ledger records which ones are live, and a Django system check flags any changelog whose commit or deploy status disagrees with git",
            "A weekly drill restores the newest backup into a throwaway database and checks it against the live one, and raises an alert if it is stale, unreadable, or doesn't restore",
            "Feature flags and per-page toggles let risky features ship dark and be switched off without a deploy",
          ]}
        />

        <Stories
          title="Bugs worth remembering"
          stories={[
            {
              title: "The “remember this device” cookie never worked for pledges",
              body: "It compared user IDs as integers, but a pledge's ID looks like P-C7JKZY, not a number — the comparison threw and silently fell back to asking for a TOTP code. It failed closed, so no one was ever at risk; it just took months to notice every new member was being asked twice on every login for no visible reason.",
            },
            {
              title: "Random CSRF failures traced to a phone's own cache",
              body: "Django doesn't set cache headers on ordinary responses by default, so a CDN — or a phone's back/forward cache — could hand one member's login page, CSRF token included, back to a different session. Fixed by forcing Cache-Control: no-store on every dynamic response, not just error pages.",
            },
            {
              title: "A committee page reporting “1 member” for every committee",
              body: "Filtering a queryset before annotating a Count() on that same relation makes the aggregate run over the join the filter already narrowed, not the full relation — distinct=True doesn't help, since it guards against multiplied rows, not a narrowed join. The fix was ordering: annotate before filter.",
            },
            {
              title: "Alpine.js never ran in production, for four months",
              body: "The production CSP has no unsafe-eval, and the standard Alpine build compiles every attribute expression at runtime, which that policy refuses. Development skips the CSP, so locally everything worked; in production an onboarding wizard showed all six steps at once and its buttons did nothing. The fix was Alpine's CSP build rather than loosening the policy, plus a test that keeps templates within what that build can parse.",
            },
            {
              title: "One scanned PDF took the site down",
              body: "A scan that declared its page size in pixels instead of points turned each phone-preview page into a bitmap of over 100 MB, rendered inside the one process serving the whole site, again for every viewer. Pages are now capped in size and rendered by a separate short-lived process with a cache, so viewing a 26-page PDF adds 3 MB to the server instead of 42 MB.",
            },
            {
              title: "A shared modal that broke every submit button inside it",
              body: "Moving a modal's footer into a reusable component rendered its buttons after the caller's closing </form> tag, and a submit button outside its form submits nothing. Three features silently stopped working. The bug lived in no single file, only in how two elements ended up on the rendered page, so the guard test now renders the page and checks that every submit button belongs to a form.",
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading title="What's Next" />
        <DashList
          items={[
            <>
              <span className="text-foreground">Multi-chapter support:</span> turning Parliament into a platform
              that can host more than one chapter. I started by classifying all 150 data models by how each would
              belong to a chapter, and finding every uniqueness rule that would collide between chapters, before
              changing any code. On its own branch so far: the chapter&apos;s identity and content (names,
              branding, constitution, songs, landing page) moved out of the code into one place, and a chapter
              table. Next is one shared database where every query has to name its chapter.
            </>,
            <>
              <span className="text-foreground">Mobile app:</span> the first phase is fixing existing bugs in the
              web app that its API would otherwise inherit.
            </>,
            <>
              <span className="text-foreground">Handoff:</span> documentation, an officer guide built into the app,
              and hardening, so the chapter can keep running it after I graduate.
            </>,
          ]}
        />
      </section>
    </CaseStudyShell>
  )
}
