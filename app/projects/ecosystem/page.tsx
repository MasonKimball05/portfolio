import type { Metadata } from "next"
import { CaseStudyHeader, CaseStudyShell, DashList, Intro, P, SectionHeading, Stats } from "@/components/case-study"
import { EcosystemMap } from "@/components/ecosystem-map"
import { APPS, CONNECTIONS } from "@/lib/ecosystem"

const DESCRIPTION =
  "How the apps I've built talk to each other: a browser, an IDE, a launcher and a calendar on my Mac, a supervisor and local models on my desktop, and the sites and phone apps around them."

export const metadata: Metadata = {
  title: "How It Fits Together — Mason Kimball",
  description: DESCRIPTION,
  openGraph: { title: "How It Fits Together — Mason Kimball", description: DESCRIPTION },
}

export default function Ecosystem() {
  return (
    <CaseStudyShell>
      <CaseStudyHeader
        title="How it fits together"
        tagline="The apps I've built, where they run, and how they talk to each other"
        tech={[]}
        links={[]}
      />

      <Intro accent="border-l-primary">
        <P>
          Most of what I build, I use every day, so the apps have grown into each other. My browser knows when an
          app on my desktop goes down. My launcher adds a task to my calendar or plays a movie from the desktop. My
          IDE borrows the desktop&apos;s GPU, and a local model on that GPU works through coding tasks while I&apos;m
          out.
        </P>
        <P>
          This page maps where each app runs and every connection between them that I can point to in the code.
          Pick an app to see what it talks to.
        </P>
      </Intro>

      <Stats
        items={[
          { value: String(APPS.length), label: "apps and services" },
          { value: String(CONNECTIONS.length), label: "connections" },
          { value: "4", label: "places they run" },
          { value: "1", label: "GPU, shared through homebase" },
        ]}
      />

      <section className="space-y-6">
        <SectionHeading title="The Map" />
        <EcosystemMap />
      </section>

      <section className="space-y-6">
        <SectionHeading title="Patterns That Kept Showing Up" />
        <DashList
          items={[
            "One door to the desktop. homebase runs everything there, and most of what the Mac does on the desktop goes through it or an app it supervises, over Tailscale. The GPU is shared the same way: Loom and Eclipse both reach the local models through homebase's proxy, and Ollama never listens on the network itself",
            "Files as the interface between Mac apps. Daybook writes a small JSON file that hop and Eclipse read, and hop reads Eclipse's session and page index directly. No server sits between apps on the same Mac",
            "Links for actions. daybook://, shelf:// and eclipse-browser:// let one app ask another to do something (add a task, play a movie, switch a tab) without either knowing how the other works",
            "Calendar feeds for dates. Job Tracker, gradtrack and Parliament each publish one, so Daybook reads their dates like any other calendar, and Eclipse turns gradtrack's into a Live Folder",
            "One way to reach my phone. homebase, Sentinel and Job Tracker all send alerts through ntfy",
            "Shared code over shared services. KrakenLite's commit graph is the same in Repo Radar and Loom, and Loom's Repos module is Repo Radar's code, so nothing has to be running for them to work",
          ]}
        />
      </section>
    </CaseStudyShell>
  )
}
