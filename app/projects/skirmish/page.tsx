import type { Metadata } from "next"
import {
  CaseStudyHeader, CaseStudyShell, DashList, Intro, P, SectionHeading, Stats, Stories, Terminal,
} from "@/components/case-study"

const DESCRIPTION =
  "An arcade FPS in the spirit of Call of Duty / XDefiant, built in Godot 4 to learn game development, with online play and netcode written from scratch."

export const metadata: Metadata = {
  title: "Skirmish — Mason Kimball",
  description: DESCRIPTION,
  openGraph: { title: "Skirmish — Mason Kimball", description: DESCRIPTION },
}

const NET_TEST = `PS> .\\open-godot.ps1 -Net -Lag 150
  dedicated server + client on 127.0.0.1:7777, 150 ms simulated ping

  F1     client-side prediction   off: every move waits a full round trip
  F5     entity interpolation     off: the bot jumps 30 times a second
  F2     lag compensation         off: lead the bot by ping + 100 ms to hit
  F3/F4  ping -/+ 50 ms           all on: you barely notice the lag`

export default function SkirmishCaseStudy() {
  return (
    <CaseStudyShell>
      <CaseStudyHeader
        title="Skirmish"
        tagline="An arcade FPS in the spirit of Call of Duty / XDefiant — in development"
        tech={["GDScript", "Godot 4", "Three.js"]}
        links={[{ label: "GitHub", href: "https://github.com/MasonKimball05/Skirmish", primary: true }]}
      />

      <Intro accent="border-l-orange-500">
        <P>
          Skirmish is my own arcade shooter: fast movement, a quick time-to-kill, and snappy gunplay, aimed at
          eventually playing online. The main goal is learning how games are actually made, so most of it is built by
          hand rather than pulled from a library — including the multiplayer netcode.
        </P>
        <P>
          It started as a single-file browser prototype in Three.js to find the feel of the movement and guns. Once
          that worked, I chose Godot 4 for the real game, mostly for how fast it is to learn. The prototype stays
          around as a lab for trying ideas and tuning numbers before porting them over.
        </P>
        <P>Screenshots and video are coming once the current round of UI work lands.</P>
      </Intro>

      <section className="space-y-4">
        <SectionHeading title="What's In It" />
        <DashList
          items={[
            "Walk, sprint, crouch, jump, and slide, with custom step-up so stairs don't act like walls",
            "Seven guns across five classes (M4, Vector, BR12, M249, M24, plus the M9 and R357 sidearms) — shotgun pellets, semi-auto triggers, and sniper scopes are all just data on each weapon",
            "Create-a-Class: five saved loadouts with stat bars and time-to-kill computed from each gun's numbers",
            "Frag grenades with their own physics, a one-hit knife, and four killstreaks: UAV, armor, a mortar strike, and a destroyable sentry gun",
            "A bot that fights at its gun's best range, waits for full aim with snipers, and throws grenades at where it last saw you",
            "1v1 deathmatch to 15 kills, offline against the bot or online, with menus, settings, and fully rebindable controls",
          ]}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="The Netcode"
          subtitle="The hard part of an online shooter, and the part I wanted to learn most."
        />
        <P>
          The game runs on a dedicated server that has the final say on everything. Waiting on a round trip for every
          move would feel like wading through mud, so the client predicts its own movement, corrects itself when the
          server disagrees, smooths out everyone else, and lets the server rewind time to judge your shots fairly.
        </P>
        <DashList
          title="How a tick works"
          items={[
            "The client samples your input every tick, sends it, and simulates it immediately so movement feels instant",
            "The server queues each client's inputs and runs them in order. It never invents an input: if none has arrived, that player waits a tick",
            "Every two ticks the server sends a snapshot of every player, plus the last input it processed for you",
            "Your client resets to the server's state, drops the inputs the server has confirmed, and replays the rest — prediction and reconciliation",
            "Other players are drawn 100 ms in the past, blended between snapshots, so they move smoothly instead of jumping",
            "Each shot carries the tick you saw; the server rewinds everyone's hitboxes to that moment, checks the hit, and puts them back — lag compensation",
          ]}
        />
        <P>
          A built-in network test runs a local server with simulated ping, and each piece can be switched off live to
          feel what it&rsquo;s doing:
        </P>
        <Terminal>{NET_TEST}</Terminal>
      </section>

      <section className="space-y-6">
        <SectionHeading title="Under the Hood" />

        <Stats
          items={[
            { value: "7", label: "guns" },
            { value: "4", label: "killstreaks" },
            { value: "6", label: "milestones done" },
            { value: "~105", label: "automated checks" },
          ]}
        />

        <DashList
          title="Design decisions"
          items={[
            "Input is kept separate from simulation: a player only ever reads an input object, never the keyboard, so the same code runs for you, the bot, a replay, and the headless server",
            "Health, damage, and killstreak awards are decided only by the authority — a client can ask for a streak but can't grant itself one",
            "Recoil turns your real view, like Call of Duty, and bullet spread is seeded per shot, so the tracer your client predicts matches the server's actual shot",
            "Bullets hit separate hitboxes rather than the movement capsule, and \"on the ground\" is stored state instead of a physics query, so reconciliation can restore it exactly",
            "Eight headless test files cover movement, weapons, grenades, killstreaks, the bot, loadouts, settings, and the netcode, run from one command",
          ]}
        />

        <Stories
          title="Bugs worth remembering"
          stories={[
            {
              title: "The server that guessed",
              body: "When a client's input was late, the first version of the server repeated that client's last input. At 200 ms of ping that caused about 1.5 corrections a second, some as large as 15 cm. Making the server wait instead of guessing cut it to roughly one small correction every two seconds.",
            },
            {
              title: "Hitboxes that hadn't moved yet",
              body: "Lag compensation moves the other players' hitboxes back in time and raycasts in the same tick — but in Godot, setting a node's position doesn't reach the physics engine until later in the frame, so the raycast was checking the old spot. The network test caught it, and the rewind now updates the physics server directly.",
            },
            {
              title: "Headshots that couldn't happen",
              body: "Shots were hitting the player's movement capsule, which wraps the whole body, so a ray always reached the capsule before the head inside it. Headshots on players were impossible until bullets were moved onto dedicated hitboxes.",
            },
            {
              title: "A grenade you could hear across the map",
              body: "Explosions were painfully loud and harsh. The synthesized waveform was clipping well past full scale, and the sound was set to stay at full volume for 25 meters — basically the whole arena. Normalizing it and shrinking the falloff fixed both.",
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading title="What's Next" />
        <DashList
          items={[
            "A real test between two PCs over the internet, with redundant inputs in each packet to survive packet loss",
            "Smoothing reconciliation corrections over a few frames instead of snapping the camera",
            "Delta-compressed snapshots so more than two players fit",
            "More content: smoke and flash grenades, attachments, more guns per class, and a second map",
            "Real sound recordings and weapon models to replace the grey-box placeholders",
          ]}
        />
      </section>
    </CaseStudyShell>
  )
}
