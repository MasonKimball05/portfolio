import type { Metadata } from "next"
import {
  CaseStudyHeader, CaseStudyShell, DashList, Intro, P, SectionHeading, Stats, Stories, Terminal,
} from "@/components/case-study"

const DESCRIPTION =
  "An offline-first inventory and meal-planning app for Alabama Baptist Disaster Relief's food trucks, built by a student Scrum team in React Native, SQLite and Supabase. I led the data, sync and release work."

export const metadata: Metadata = {
  title: "Mobilized Food Trucks — Mason Kimball",
  description: DESCRIPTION,
  openGraph: { title: "Mobilized Food Trucks — Mason Kimball", description: DESCRIPTION },
}

const SYNC = `Screens          read and write the local database, never the network
   │
Local SQLite     every row has a synced flag
   │
syncAll()        push unsynced rows, table by table in foreign-key order,
   │             then pull what changed since the last pull, 1,000 rows a page
Supabase         Postgres, Auth, and row-level security for managers and admins`

export default function MobilizedFoodTrucksCaseStudy() {
  return (
    <CaseStudyShell>
      <CaseStudyHeader
        title="Mobilized Food Trucks"
        tagline="Offline-first inventory for disaster relief food trucks, built by a student Scrum team"
        tech={["TypeScript", "React Native", "Expo", "SQLite", "Supabase"]}
        links={[]}
      />

      <Intro accent="border-l-red-500">
        <P>
          Alabama Baptist Disaster Relief sends food trucks into disaster zones, and they tracked inventory in Excel.
          This app replaces that: stock at each site, transfers between them, unit and case-size conversions, and a
          meal planner that works out what a menu will use.
        </P>
        <P>
          Disaster zones often have no signal, so every device keeps its own database and syncs whenever it can
          reach the server. It&apos;s a course project built by a team of students in two-week Scrum sprints. I was
          the top committer (about two thirds of this semester&apos;s commits) and led the parts underneath the
          screens: the database, the sync engine, CI and the installers.
        </P>
      </Intro>

      <section className="space-y-6">
        <SectionHeading title="What It Does" />
        <DashList
          items={[
            "Inventory by site, with transfers, item change history, and conversions between units and case sizes",
            "A meal calculator and planner that turns a menu and a head count into the ingredients it needs",
            "Admin user management and password resets, with manager-only rules enforced in the database, not just the app",
            "Runs on iOS, Android and the web. The web build installs as an app and opens offline, and there are signed Mac and Windows desktop builds that check for updates",
          ]}
        />
      </section>

      <section className="space-y-6">
        <SectionHeading title="Under the Hood" />

        <Stats
          items={[
            { value: "~417", label: "tests on in-memory SQLite" },
            { value: "25", label: "database migrations" },
            { value: "4", label: "platforms from one codebase" },
            { value: "2-week", label: "Scrum sprints" },
          ]}
        />

        <Terminal>{SYNC}</Terminal>

        <DashList
          title="What I built"
          items={[
            "The local SQLite layer and the queries every screen goes through, and the Supabase schema with row-level security",
            "The sync engine: pushing in foreign-key order so nothing arrives before what it points to, pulling in pages, and setting aside rows the server refuses instead of stopping",
            "Stock as a ledger: on-hand quantity is rebuilt from an append-only log of changes, so two offline devices can both deduct from the same item",
            "The meal calculator and its tests, and the split between the shared catalog and each site's stock",
            "CI (typecheck, tests and the web build on every push), the offline web app, and the signed desktop installers. Also merging teammates' screens into the data layer",
          ]}
        />

        <Stories
          title="Decisions that took more than one try"
          stories={[
            {
              title: "Choosing the backend",
              body: "The project started on Firebase. Several sites, mostly offline, each with more than one person writing, pointed us to SQLite on each device syncing with Supabase's Postgres instead. We looked at PowerSync to do the syncing for us, but its free tier shuts a project down after a week idle, which doesn't suit a tool used in bursts. Switching the app to Flutter came up too; we stayed on React Native rather than have six people learn a new stack mid-semester.",
            },
            {
              title: "Losing a deduction",
              body: "Stock first synced as a running total, and the last write won. If two trucks offline both used the same item, one deduction disappeared when they synced. Now every change is a row in an append-only log, and the on-hand number is rebuilt from it: the baseline plus every change, never below zero. Changes from both trucks survive.",
            },
            {
              title: "The changes no one saw",
              body: "Pulls asked for rows changed since the device's last sync, by the time the change was made. A change made offline and uploaded hours later carried an old time, so devices that had already synced never saw it. Downloads also stopped silently at Supabase's 1,000-row limit. The fix took a couple of passes: a database trigger now stamps when a change reaches the server, pulls page through everything since then with a two-minute overlap, and every device's position was reset once.",
            },
            {
              title: "One bad row stopped everything",
              body: "If the server refused one row, the whole sync stopped and nothing else went up. Now a refused batch is retried one row at a time, the rest go through, and the refused ones wait with the server's reason in a screen where they can be retried or dropped. A row that depends on a refused one waits too, so nothing reaches the server half-connected.",
            },
          ]}
        />
      </section>
    </CaseStudyShell>
  )
}
