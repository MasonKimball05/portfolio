import type { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr"
import { Button } from "@/components/ui/button"
import { SectionLabel } from "@/components/section-label"

const DESCRIPTION =
  "CS senior at Samford University, concentrating in Cyber Security, with a minor in German. What I've built, where I've worked, and how I like to work."

export const metadata: Metadata = {
  title: "About — Mason Kimball",
  description: DESCRIPTION,
  openGraph: { title: "About — Mason Kimball", description: DESCRIPTION },
}

// Newest first. `accent` colors the role line, matching the rest of the site.
const EXPERIENCE: { when: string; role: string; place: string; accent: string; points: string[] }[] = [
  {
    when: "Sep 2026 – now",
    role: "Gloo Hackathon 2026",
    place: "Church Buddy, team project",
    accent: "text-sky-500",
    points: [
      "Built the pipeline runner host for our church-discovery crawler, with one-command setup, a crawl CLI with per-run logs and clear exit codes, and config checks at startup (HTTPS-only endpoints, minimum key lengths)",
    ],
  },
  {
    when: "Sep 2025 – now",
    role: "Scrum Master & Backend Developer",
    place: "Mobilized Food Trucks, student team",
    accent: "text-teal-500",
    points: [
      "Lead two-week sprints for a mobile app that replaces spreadsheet inventory tracking for Southern Baptist disaster-relief food trucks",
      "Designed the backend and database, a version-controlled Supabase schema with row-level security",
    ],
  },
  {
    when: "Nov 2025 – Jan 2027",
    role: "Executive Vice President",
    place: "Beta Theta Pi, Alpha Mu Chapter",
    accent: "text-amber-500",
    points: [
      "Built and run Parliament, the chapter's management platform, used by about 60 members",
      "Before that, Constitution & Bylaws Chair and Tabling Chair, and a member of the Finance, Ritual and Brotherhood committees",
    ],
  },
  {
    when: "Sep 2024 – now",
    role: "Computer Science Tutor",
    place: "Samford University Academic Success Center",
    accent: "text-primary",
    points: [
      "Tutor students one-on-one and in groups in Intro to Python and Intro to Java, plus 200- and 300-level courses, and help them plan for exams and projects",
    ],
  },
  {
    when: "Summers 2021 – 2025",
    role: "Head Lifeguard",
    place: "Jewish Community Center, Dallas & Birmingham",
    accent: "text-rose-500",
    points: [
      "Led shifts of 15 to 30 lifeguards in Dallas and 10 to 20 in Birmingham, and kept the pools to safety and health-code standards",
    ],
  },
]

// How I build things, each backed by a project on the site.
const PRINCIPLES: { title: string; body: string; href: string; link: string }[] = [
  {
    title: "Security from the start",
    body: "Parliament has two-factor login, per-IP rate limiting, field-level encryption and honeypot routes that ban scanners. My tools default to read-only, and secrets stay out of repos.",
    href: "/projects/parliament",
    link: "Parliament",
  },
  {
    title: "Tested, then shipped",
    body: "Parliament runs about 3,000 automated tests in CI. Even my small tools keep their logic in a package with no UI, so it can be tested on its own.",
    href: "/projects/daybook",
    link: "Daybook",
  },
  {
    title: "Building what I use every day",
    body: "My calendar, my launcher, my file sorter and the server that keeps my apps running are all things I built and use every day.",
    href: "/projects/hop",
    link: "hop",
  },
  {
    title: "Learning a language by building in it",
    body: "Go for Sentinel and homebase, C# for Job Tracker, Rust for sift and Repo Radar, Swift for Daybook and Media Player. Each one started as a real problem, not an exercise.",
    href: "/projects/sift",
    link: "sift",
  },
]

const HONORS = [
  "Eagle Scout",
  "Dean's List, five semesters",
  "Davis Scholarship",
  "Marian Scholarship",
]

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-24 space-y-10 sm:space-y-16">

        {/* Intro */}
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">about</h1>
          <p className="text-muted-foreground leading-relaxed">
            I&apos;m a computer science senior at Samford University in Birmingham, concentrating in Cyber Security
            with a minor in German. I graduate in May 2027.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Most of what I know I learned by building things people actually use. In April 2025 I started
            Parliament, the platform my fraternity chapter now uses for legislation, elections, attendance and
            service hours. About 60 members use it, and it has more than 550 commits behind it. Since then I&apos;ve
            built tools for my own day, from a calendar app to a launcher to a server that keeps my apps running,
            often to learn a new language or see how something works from the inside.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" asChild>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/projects">Projects</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Get in touch</Link>
            </Button>
          </div>
        </section>

        {/* Looking for */}
        <section className="space-y-4">
          <SectionLabel>What&apos;s next</SectionLabel>
          <div className="border border-border rounded-md border-l-4 border-l-primary px-4 py-4 space-y-2">
            <p className="text-sm font-medium">Looking for new-grad software engineering and security roles</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Starting after May 2027, in Birmingham, Dallas or remote. I&apos;m also applying to MS programs in
              Computer Science and Cyber Security, with Texas A&amp;M and the University of Alabama at the top of my list.
            </p>
          </div>
        </section>

        {/* Experience */}
        <section className="space-y-4">
          <SectionLabel>Experience &amp; Leadership</SectionLabel>
          <ol className="border border-border divide-y divide-border">
            {EXPERIENCE.map((e) => (
              <li key={e.role} className="px-4 py-4 grid sm:grid-cols-[9.5rem_1fr] gap-1 sm:gap-6">
                <p className="text-xs text-muted-foreground pt-0.5 tabular-nums">{e.when}</p>
                <div className="space-y-1.5">
                  <div>
                    <p className={`text-sm font-medium ${e.accent}`}>{e.role}</p>
                    <p className="text-xs text-muted-foreground">{e.place}</p>
                  </div>
                  <ul className="space-y-1">
                    {e.points.map((p) => (
                      <li key={p} className="text-sm text-muted-foreground leading-relaxed flex gap-2.5">
                        <span className="flex-shrink-0 select-none">—</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* How I work */}
        <section className="space-y-4">
          <SectionLabel>How I Build</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="border border-border rounded-md px-4 py-4 space-y-2 flex flex-col">
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.body}</p>
                <Link href={p.href} className="text-xs text-primary hover:underline">See {p.link} →</Link>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="space-y-4">
          <SectionLabel>Education</SectionLabel>
          <div className="border border-border rounded-md border-l-4 border-l-primary px-4 py-4 space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-sm font-medium">Samford University</p>
              <p className="text-xs text-muted-foreground">Expected May 2027 · GPA 3.68</p>
            </div>
            <p className="text-xs text-muted-foreground">B.S. Computer Science · Cyber Security concentration · German minor</p>
            <div className="flex flex-wrap gap-1.5">
              {["Operating Systems", "Database Design", "Computer Architecture", "Artificial Intelligence"].map((c) => (
                <span key={c} className="text-xs border border-border px-2 py-0.5 text-muted-foreground">{c}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications & honors */}
        <section className="space-y-4">
          <SectionLabel>Certifications &amp; Honors</SectionLabel>
          <a
            href="https://www.credly.com/badges/272c81a8-8efa-4cbe-94b3-ba5e033d8ba3/public_url"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between border border-border rounded-md px-4 py-3 transition-colors group hover:bg-muted hover:shadow-[inset_2px_0_0_0_var(--color-primary)]"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck size={28} className="text-green-500 flex-shrink-0" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium group-hover:underline">Certified in Cybersecurity (CC)</p>
                <p className="text-xs text-muted-foreground">ISC2 · Verified</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">verify →</span>
          </a>
          <div className="flex flex-wrap gap-1.5">
            {HONORS.map((h) => (
              <span key={h} className="text-xs border border-border px-2.5 py-1 text-muted-foreground">{h}</span>
            ))}
          </div>
        </section>

        {/* Outside of code */}
        <section className="space-y-4">
          <SectionLabel>Outside of code</SectionLabel>
          <p className="text-muted-foreground leading-relaxed">
            I&apos;m from Dallas, the oldest of four brothers, and an Eagle Scout. My family has deep German roots,
            which is part of what pushed me toward German. I&apos;m working toward B2 and have been in Samford&apos;s
            German Club since 2024. When I&apos;m not at a computer I&apos;m usually jogging, playing video games, or
            finding something to do with friends.
          </p>
        </section>

      </main>
    </div>
  )
}
