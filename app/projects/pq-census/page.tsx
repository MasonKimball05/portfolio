import type { Metadata } from "next"
import {
  CaseStudyHeader, CaseStudyShell, DashList, Intro, P, SectionHeading, Stats, Stories, Terminal,
} from "@/components/case-study"

const DESCRIPTION =
  "A Go scanner that measured how many of the 10,000 most popular websites negotiate a post-quantum TLS key exchange, and a follow-up study of why the rest don't."

export const metadata: Metadata = {
  title: "pq-census — Mason Kimball",
  description: DESCRIPTION,
  openGraph: { title: "pq-census — Mason Kimball", description: DESCRIPTION },
}

const REPO = "https://github.com/MasonKimball05/pq-census"

// From data/2026-09-30/summary.json in the repo (Tranco list V349N, top 10,000).
// Providers with at least 30 reachable sites, most post-quantum first.
const PROVIDERS: { name: string; sites: number; percent: number }[] = [
  { name: "Amazon CloudFront", sites: 698, percent: 99.6 },
  { name: "Cloudflare", sites: 1948, percent: 97.1 },
  { name: "Vercel", sites: 74, percent: 95.9 },
  { name: "Akamai", sites: 272, percent: 85.3 },
  { name: "Fastly", sites: 272, percent: 81.2 },
  { name: "Microsoft Azure", sites: 47, percent: 68.1 },
  { name: "Google", sites: 362, percent: 57.5 },
  { name: "Self-hosted / other", sites: 3283, percent: 20.4 },
  { name: "Netlify", sites: 30, percent: 6.7 },
  { name: "AWS ELB / S3", sites: 272, percent: 4.4 },
]

const RUN = `$ go run . scan -list top-1m.csv -n 10000 -out results.jsonl -q
10000 domains, 0 already scanned, 10000 to go
done: 10000 scanned this run, 4086 post-quantum, 5m22s

$ go run . report -in results.jsonl
Scanned 10,000 sites. 7,340 answered over HTTPS;
4,086 of those (55.7%) negotiated a post-quantum key exchange.`

function ProviderChart() {
  return (
    <figure className="space-y-3">
      <div className="space-y-2.5" role="list" aria-label="Share of sites negotiating post-quantum key exchange, by provider">
        {PROVIDERS.map((p) => (
          <div key={p.name} role="listitem" className="grid grid-cols-[9.5rem_1fr_3.5rem] sm:grid-cols-[12rem_1fr_3.5rem] items-center gap-3 text-sm">
            <div className="text-right leading-tight">
              <div>{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.sites.toLocaleString()} sites</div>
            </div>
            <div className="h-3 bg-muted" aria-hidden>
              <div className="h-full bg-primary" style={{ width: `${p.percent}%` }} />
            </div>
            <div className="tabular-nums text-right">{p.percent < 99.5 ? Math.round(p.percent) : p.percent}%</div>
          </div>
        ))}
      </div>
      <figcaption className="text-xs text-muted-foreground">
        Share of each provider&rsquo;s reachable sites that negotiated X25519MLKEM768. The provider is whoever
        terminated TLS, detected from response headers. Scanned September 30, 2026.
      </figcaption>
    </figure>
  )
}

export default function PqCensusCaseStudy() {
  return (
    <CaseStudyShell>
      <CaseStudyHeader
        title="pq-census"
        tagline="Measuring how much of the web uses post-quantum TLS"
        tech={["Go", "TLS", "Cryptography"]}
        links={[
          { label: "GitHub", href: REPO, primary: true },
          { label: "Census data", href: `${REPO}/tree/main/data/2026-09-30` },
          { label: "Follow-up study", href: `${REPO}/tree/main/data/2026-10-01-probe` },
        ]}
      />

      <Intro accent="border-l-sky-500">
        <P>
          Encrypted traffic can be recorded today and decrypted years from now, once quantum computers are strong
          enough: &ldquo;harvest now, decrypt later.&rdquo; The defense already exists. A hybrid key exchange,{" "}
          <code className="text-foreground">X25519MLKEM768</code>, pairs classic X25519 with ML-KEM, the
          post-quantum algorithm NIST standardized in 2024 (FIPS 203). Chrome and Firefox offer it on every
          connection. Whether you actually get it depends on the server.
        </P>
        <P>
          So I measured it. pq-census connects to the 10,000 most popular sites on the Tranco list and records the
          key exchange each one picks, along with the TLS version and who serves the site. Then a follow-up study
          asked why the sites that chose classical encryption did: can&rsquo;t they use post-quantum, or won&rsquo;t
          they?
        </P>
      </Intro>

      <Stats
        items={[
          { value: "10,000", label: "sites scanned" },
          { value: "7,340", label: "answered over HTTPS" },
          { value: "55.7%", label: "of those post-quantum" },
          { value: "15.5%", label: "still on TLS 1.2" },
        ]}
      />

      <section className="space-y-4">
        <SectionHeading title="Your CDN Decides" subtitle="Post-quantum share by who terminates TLS" />
        <ProviderChart />
      </section>

      <section className="space-y-6">
        <SectionHeading title="What the Data Shows" />
        <DashList
          items={[
            "Popularity barely matters: 53.4% of the top 100, 55.2% of the top 1,000 and 55.7% of the top 10,000. What matters is the provider in front of the site",
            "The big CDNs turned it on for everyone: 97% behind Cloudflare and 99.6% behind CloudFront. Self-hosted sites are at 20%",
            "The same company can be on both sides: Amazon's CDN is nearly all post-quantum, while sites on its load balancers and S3 are at 4%",
            "Only one post-quantum method is in use: all 4,086 post-quantum sites chose X25519MLKEM768",
            "1,135 sites (15.5%) still run TLS 1.2, which can't negotiate a post-quantum key exchange at all",
          ]}
        />
        <Terminal>{RUN}</Terminal>
      </section>

      <section className="space-y-6">
        <SectionHeading title="Can't, or Won't?" subtitle="A follow-up on the sites that chose classical" />
        <P>
          My hypothesis was that many classical sites already supported post-quantum and were simply set to prefer
          the older option, since the major TLS libraries have been adding it. To test it, I reconnected to the 2,119
          sites that chose a classical key exchange over TLS 1.3, offering <em>only</em>{" "}
          <code className="text-foreground">X25519MLKEM768</code>. A server that supports it can still connect. One
          that doesn&rsquo;t shares no option with the client and, under the TLS 1.3 standard (RFC 8446), has to
          refuse with a <code className="text-foreground">handshake_failure</code> alert.
        </P>
        <Stats
          items={[
            { value: "2,119", label: "classical sites probed" },
            { value: "1,773", label: "gave a clear answer" },
            { value: "99.9%", label: "of those can't do post-quantum" },
            { value: "2", label: "had it and chose classical" },
          ]}
        />
        <P>
          The hypothesis was wrong, and not by a little. When a site doesn&rsquo;t use post-quantum, it&rsquo;s
          almost never a setting: the server doesn&rsquo;t support it. And 88% of those sites are self-hosted, the
          same group the census found lagging. Fixing it means upgrading TLS libraries, web servers or load
          balancers, some tied to an operating system or a vendor&rsquo;s hardware, and testing it all before
          production. For many teams that&rsquo;s a project with real cost, so it may be a while, and meanwhile their
          traffic can still be recorded.
        </P>
        <DashList
          items={[
            "1,771 of 1,773 conclusive sites (99.9%) refused the post-quantum-only handshake with handshake_failure; only purdue.edu and roche.com support it but chose classical",
            "Every result was checked against a second, independent TLS implementation: OpenSSL agreed on a random 40 of 40 refusals and both exceptions",
            "18 sites had switched post-quantum on within a day of the census, and 4 answered differently an hour apart: one name can front servers at different upgrade levels",
            "Two sites accept Go's post-quantum-only handshake but reject OpenSSL's, though both offer the same single option, so something in front of them treats clients differently",
          ]}
        />
      </section>

      <section className="space-y-6">
        <SectionHeading title="How It Works" />
        <DashList
          items={[
            "Go's default TLS client offers X25519MLKEM768 first and plain X25519 alongside it, like current browsers, so the group that gets negotiated is the server's choice",
            "One HEAD request per site, with redirects not followed: the measurement is the handshake with the domain itself. If the bare domain doesn't answer, it tries www",
            "The handshake is captured with httptrace as soon as it completes, so a site whose TLS works but whose HTTP layer then fails still counts",
            "Every failure is classified (DNS, timeout, connection reset, TLS error), and domains that resolve to private or loopback addresses are skipped",
            "Scans resume after an interruption, and the raw results, report and Tranco list ID are published so anyone can rerun it",
          ]}
        />
        <Stories
          title="Surprises along the way"
          stories={[
            {
              title: "My own network was hiding sites",
              body: "About 6% of domains reset the connection mid-handshake, identically with post-quantum and classical handshakes. That pointed at a filter, not the sites. A second machine on the same network saw the same resets, so I counted them as unreachable rather than guess, and documented it as a limit of the measurement.",
            },
            {
              title: "Windows Defender called my scanner a trojan",
              body: "Running it from my desktop, Defender's machine-learning detection quarantined the binary (Bearfoos.A!ml) about 30 seconds in: a new, unsigned program opening hundreds of connections a minute looks like malware. A false positive, but a real-world lesson about what network measurement tools look like to endpoint security.",
            },
            {
              title: "A second opinion caught a mistake",
              body: "The follow-up's first pass counted any TLS alert as \"no support\". Re-checking a sample with OpenSSL showed some of those servers failing for an unrelated reason, and showed sites flipping between post-quantum and classical. So only the alerts the TLS standard requires for \"no common option\" count now, and sites that look newly post-quantum get four more connections to rule out a mixed fleet.",
            },
            {
              title: "A bug in my own measurement",
              body: "The first version only recorded a site if its HTTP request succeeded, so a site that negotiated post-quantum TLS but then returned an HTTP/2 error was thrown away. Capturing the handshake on its own fixed it, and a test now covers that case.",
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading title="Limits" />
        <DashList
          items={[
            "One vantage point (a US residential connection) at one moment. Large sites can answer differently by region or load balancer",
            "It measures what servers support, not what share of real traffic is post-quantum",
            "Provider detection relies on response headers, so sites that strip them are counted as self-hosted",
            "A single connection measures one server, not a whole site: a few sites gave different answers an hour apart. 328 follow-up results were inconclusive and are left out of the percentages",
          ]}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading title="What's Next" />
        <P>
          Post-quantum cryptography is what I want to study in grad school, and this raised my next question:
          what&rsquo;s actually blocking these upgrades, and what&rsquo;s the cheapest path through them?
        </P>
      </section>
    </CaseStudyShell>
  )
}
