import type { Metadata } from "next"
import {
  CaseStudyHeader, CaseStudyShell, DashList, Intro, P, SectionHeading, Stats, Stories, Terminal,
} from "@/components/case-study"

const DESCRIPTION =
  "An arcade FPS in the spirit of Call of Duty / XDefiant, built in Godot 4 to learn game development: seven modes, team bots, and online play with netcode written from scratch."

export const metadata: Metadata = {
  title: "Skirmish — Mason Kimball",
  description: DESCRIPTION,
  openGraph: { title: "Skirmish — Mason Kimball", description: DESCRIPTION },
}

const NET_TEST = `PS> .\\open-godot.ps1 -Net -Lag 150 -Loss 10
  dedicated server + client, 150 ms ping, 10% packet loss

  F1     client-side prediction   off: every move waits a round trip
  F5     entity interpolation     off: other players jump, not glide
  F2     lag compensation         off: lead targets by ping + 100 ms
  F7     correction smoothing     off: corrections snap the camera
  F3/F4  ping -/+ 50 ms           all on: you barely notice the lag
  F8/F9  packet loss -/+`

export default function SkirmishCaseStudy() {
  return (
    <CaseStudyShell>
      <CaseStudyHeader
        title="Skirmish"
        tagline="An arcade FPS in the spirit of Call of Duty / XDefiant — in development"
        tech={["GDScript", "Godot 4", "Blender", "Python"]}
        links={[{ label: "GitHub", href: "https://github.com/MasonKimball05/Skirmish", primary: true }]}
      />

      <Intro accent="border-l-orange-500">
        <P>
          Skirmish is my own arcade shooter: fast movement, a quick time-to-kill, and snappy gunplay, playable offline
          against bots or online. The main goal is learning how games are actually made, so the core systems are
          built from scratch instead of pulled from a library — the netcode, the bot AI, and the guns themselves,
          which are modelled in Blender by script.
        </P>
        <P>
          It started as a single-file browser prototype in Three.js to find the feel of the movement and guns. Once
          that worked I moved to Godot 4, and it has grown into a full game loop: seven modes, four maps, classes and
          progression, and bots that play as a team. The prototype stays around as a lab for tuning numbers fast.
        </P>
        <P>Screenshots and video are coming once the current round of UI work lands.</P>
      </Intro>

      <Stats
        items={[
          { value: "10", label: "guns" },
          { value: "7", label: "game modes" },
          { value: "4", label: "maps" },
          { value: "49", label: "test files" },
        ]}
      />

      <section className="space-y-4">
        <SectionHeading title="What's In It" />
        <DashList
          title="Gunplay"
          items={[
            "Ten guns across assault rifles, SMGs, a shotgun, an LMG, a sniper, a marksman rifle, and two sidearms — with burst fire, a pump that reloads shell by shell, and a sniper you steady by holding your breath",
            "Attachments in five slots (optics, muzzles, grips and lasers, barrels, magazines) that change the gun's real stats, not just its look",
            "Per-gun recoil patterns that repeat closely enough to learn but never trace the same line twice",
          ]}
        />
        <DashList
          title="Seven modes"
          items={[
            "Free-for-all and Team Deathmatch",
            "Sectors: capture and hold three flags",
            "Hot Zone: one zone at a time, and it moves every minute",
            "Escalation: a gun ladder where every two kills swaps your weapon — finish with a knife kill",
            "Claim: kills only score once someone walks over the tag the victim dropped",
            "FUSE: round-based plant and defuse with one life per round",
          ]}
        />
        <DashList
          title="Around the match"
          items={[
            "Create-a-Class with perks and tactical equipment (flash, stun, smoke), plus frag grenades, a knife, and four killstreaks",
            "Weapon levels that unlock attachments, an account rank, medals, mastery challenges, and weapon finishes in a store paid for with in-game credits",
            "Four maps, a pre-match lobby, an end-of-match map vote, a career stats screen, controller support, and accessibility options like colour palettes and sound captions",
          ]}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading title="Bots That Play Like a Team" />
        <P>
          The first bot walked in a straight line and hopped when it hit a wall. Now every map gets a navigation mesh
          baked at load, and each bot chooses each tick whether to fight, retreat to cover and regenerate, hunt
          down where it last saw you, or play the objective.
        </P>
        <DashList
          items={[
            "Hunting bots sprint to your last known spot, pre-aim corners on the way in, and sometimes flank 8–12 m off the direct line",
            "They hear unsuppressed gunfire and footsteps, so a suppressor or a crouch-walk actually keeps you hidden",
            "Bots with long guns climb to high ground and hold the longest sightline, scoped in",
            "Teammates call out where they've seen you, trade a teammate's death by pushing the killer, and leave an anchor on captured flags — in testing, teams lost 40% fewer held flags",
          ]}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="The Netcode"
          subtitle="The hard part of an online shooter, and the part I wanted to learn most."
        />
        <P>
          A dedicated server has the final say on everything. Waiting a round trip for every move would feel like
          wading through mud, so the client predicts its own movement, corrects itself when the server disagrees,
          smooths out everyone else, and lets the server rewind time to judge your shots fairly.
        </P>
        <DashList
          title="How a tick works"
          items={[
            "The client samples your input every tick, sends it, and simulates it immediately so movement feels instant",
            "The server runs each client's inputs in order and never invents one: if an input is late, that player waits",
            "Snapshots tell your client where the server has you; it resets to that, drops confirmed inputs, and replays the rest",
            "Other players are drawn 100 ms in the past, blended between snapshots, so they move smoothly",
            "Each shot carries the tick you saw; the server rewinds everyone's hitboxes to that moment to check the hit",
          ]}
        />
        <DashList
          title="Ready for the real internet"
          items={[
            "Every input packet repeats the last four inputs, so a lost packet costs nothing. At 10% packet loss, corrections dropped from 372 to 24 and lost inputs from 356 to zero",
            "Snapshots shrank from 4.6 KB to under 1 KB with eight players: other players are packed into 26 bytes each, and names, scores and loadouts are only sent when they change",
            "Leftover corrections glide the camera over a fifth of a second instead of snapping it",
            "Players push each other softly instead of colliding like boxes, and the push uses the same rewound positions as lag compensation, so client and server agree on it",
          ]}
        />
        <P>
          A built-in network test runs a local server with simulated ping and packet loss, and each piece can be
          switched off live to feel what it&rsquo;s doing:
        </P>
        <Terminal>{NET_TEST}</Terminal>
      </section>

      <section className="space-y-4">
        <SectionHeading title="Its Own Look and Sound" />
        <DashList
          items={[
            "Every gun, attachment, the soldier, and the gloved hands are modelled in Blender by Python scripts at real-world proportions, so each asset is original and can be rebuilt from code",
            "Maps are styled at load: grey-box layouts become concrete, corrugated steel, and worn paint through procedural shaders with no texture files, plus a generated city skyline",
            "There are no sound files either: every gunshot, footstep, and reload is synthesized in code from layered noise, filters, and reverb, with a voice per gun type",
            "Everything has its own name — guns, modes, perks, even bot callsigns — so the game borrows no one else's IP",
          ]}
        />
      </section>

      <section className="space-y-6">
        <SectionHeading title="Under the Hood" />

        <Stats
          items={[
            { value: "202", label: "GDScript files" },
            { value: "27", label: "3D models built by script" },
            { value: "15 s", label: "to simulate a 10-min bot match" },
            { value: "0.000 cm", label: "replay drift on stairs" },
          ]}
        />

        <DashList
          title="Design decisions"
          items={[
            "Input is kept separate from simulation: a player only ever reads an input object, never the keyboard, so the same code runs for you, the bots, a replay, and the headless server",
            "Health, damage, and rewards are decided only by the server — a client can ask for a killstreak but can't grant itself one",
            "Game modes are subclasses that override only how a kill scores, what happens each tick, and who wins, so a new mode is a small file",
            "Movement never depends on mode rules: planting in FUSE needs you to stand still rather than locking you in place, so prediction stays exact",
            "Guns, maps and items are append-only lists, so saved classes and network messages keep pointing at the right thing as content grows",
          ]}
        />

        <Stories
          title="Bugs worth remembering"
          stories={[
            {
              title: "Bots that only got lost online",
              body: "Every offline test passed, but on the dedicated server the bots wandered aimlessly. Godot builds level geometry on the idle frame after it loads, and the server's bots think on the very first tick — so they baked a navigation mesh from an empty level. The bake now waits for the geometry to exist.",
            },
            {
              title: "Stairs that broke replay",
              body: "Replaying inputs on stairs during reconciliation drifted by up to 4 m, because Godot's character controller keeps hidden \"was on the floor\" state that can't be restored. I replaced its floor handling with my own grounding logic; recorded stair runs now replay to exactly 0.000 cm.",
            },
            {
              title: "Deltas that were never confirmed",
              body: "Delta snapshots resend a change until the client confirms it. But every resend was stamped with the current tick, so the client's confirmation always looked older than the latest send, and nothing was ever confirmed. Stamping the first send fixed it, and there's a test for exactly that.",
            },
            {
              title: "The server that guessed",
              body: "When a client's input was late, the first server repeated the last one. At 200 ms of ping that caused about 1.5 corrections a second, some as large as 15 cm. Making the server wait instead of guessing cut it to small, rare ones.",
            },
            {
              title: "A test runner that always passed",
              body: "A typo broke six of nine test files, and the runner still reported success: Godot exits with 0 when a script fails to compile. The runner now treats any script error in the output as a failure.",
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading title="What's Next" />
        <DashList
          items={[
            "An online lobby where players join with their names, and a real test between two PCs over the internet",
            "Moving profiles to the server — right now the server trusts a client about which attachments it has unlocked",
            "Authored spawns for the smaller maps, where FUSE rounds end too fast",
          ]}
        />
      </section>
    </CaseStudyShell>
  )
}
