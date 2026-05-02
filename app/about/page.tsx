import Script from "next/script"
import { Button } from "@/components/ui/button"

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-24 space-y-10 sm:space-y-16">

        {/* Intro */}
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">about</h1>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            I'm a CS junior at Samford University in Birmingham, concentrating in Cyber Security
            with a minor in German. I like to build things — mostly web apps, sometimes internal tools for
            my fraternity chapter.
          </p>
          <div className="pt-2">
            <Button variant="outline" asChild>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
            </Button>
          </div>
        </section>

        {/* Education */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Education</h2>
          <div className="border border-border border-l-4 border-l-blue-500 divide-y divide-border">
            <div className="px-4 py-4 space-y-1">
              <p className="text-sm font-medium">Samford University</p>
              <p className="text-xs text-muted-foreground">B.S. Computer Science · Cyber Security concentration · German minor</p>
              <p className="text-xs text-muted-foreground">Expected graduation May 2027</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Applying to MS CS/Cyber Security programs — Texas A&M and University of Alabama are my primary targets.
          </p>
        </section>

        {/* Currently */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Currently</h2>
          <div className="border border-border divide-y divide-border">
            {[
              { label: "EVP", detail: "Executive Vice President, Beta Theta Pi Alpha Mu Chapter", color: "text-amber-500" },
              { label: "Parliament", detail: "Building chapter admin software — Django + PostgreSQL", color: "text-blue-500" },
              { label: "German", detail: "Working toward B2, heading to Berlin for immersion this summer", color: "text-green-500" },
            ].map(({ label, detail, color }) => (
              <div key={label} className="px-4 py-3 flex gap-3 sm:gap-6">
                <span className={`text-xs w-20 flex-shrink-0 pt-0.5 font-medium ${color}`}>{label}</span>
                <span className="text-sm">{detail}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Certifications</h2>
          <div
            data-iframe-width="290"
            data-iframe-height="340"
            data-share-badge-id="272c81a8-8efa-4cbe-94b3-ba5e033d8ba3"
            data-share-badge-host="https://www.credly.com"
          />
          <Script src="//cdn.credly.com/assets/utilities/embed.js" strategy="lazyOnload" />
        </section>

        {/* Outside of code */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Outside of code</h2>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            From Dallas, TX. Oldest of four brothers. My family has deep German roots, which is part
            of what pushed me toward German. When I'm not at a computer programming I'm usually jogging,
            playing video games games, or finding something to do with friends.
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            This summer I'll be at the Freie Universität Berlin for language immersion. I'll be
            posting photos and notes from the trip in the{" "}
            <a href="/berlin" className="text-foreground underline underline-offset-4">
              journal
            </a>
            .
          </p>
        </section>

      </main>
    </div>
  )
}
