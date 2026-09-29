import type { Metadata } from "next"
import {
  CaseStudyHeader, CaseStudyShell, DashList, Intro, P, SectionHeading, Stats, Stories,
} from "@/components/case-study"
import { ScreenshotTabs } from "@/components/screenshot-tabs"

const DESCRIPTION =
  "A native macOS media player with YouTube-style controls and two playback engines, AVFoundation and libmpv, so it opens almost anything."

export const metadata: Metadata = {
  title: "Media Player — Mason Kimball",
  description: DESCRIPTION,
  openGraph: { title: "Media Player — Mason Kimball", description: DESCRIPTION },
}

const IMG = "/images/projects/media-player"

export default function MediaPlayerCaseStudy() {
  return (
    <CaseStudyShell>
      <CaseStudyHeader
        title="Media Player"
        tagline="A native macOS video and audio player, built because QuickTime wasn't cutting it"
        tech={["Swift", "SwiftUI", "AVFoundation", "libmpv"]}
        links={[{ label: "GitHub", href: "https://github.com/MasonKimball05/Custom-Mac-Media-Player", primary: true }]}
      />

      <Intro accent="border-l-rose-500">
        <P>
          QuickTime can&apos;t open MKV files, has no playlist, and hides subtitle and track options. I wanted a
          player that felt like YouTube&apos;s: a full-width scrubber with hover previews, one-click captions, a
          settings gear for tracks, chapters and speed, and a playlist beside the video.
        </P>
        <P>
          It&apos;s a native SwiftUI app with two playback engines. Apple&apos;s AVFoundation handles the formats
          macOS supports, and libmpv takes over for everything it can&apos;t open, like MKV, WebM and AVI. The
          controls work the same whichever engine is playing.
        </P>
      </Intro>

      <section className="space-y-4">
        <SectionHeading title="In Action" subtitle="The current version, playing demo videos generated with ffmpeg." />
        <ScreenshotTabs
          tabs={[
            {
              label: "Player",
              src: `${IMG}/player.jpg`,
              width: 1600,
              height: 958,
              alt: "The Media Player window playing a Mandelbrot zoom video with subtitles, a playlist sidebar of three videos, and YouTube-style transport controls",
              caption: "An MKV file with chapters and an embedded subtitle track, playing through libmpv. The playlist sidebar shows a thumbnail and a live now-playing indicator.",
              points: [
                "The scrubber previews a thumbnail on hover. For formats AVFoundation can't read, a second, hidden mpv instance takes the frame, fast enough to keep up with the pointer",
                "Subtitles move up while the controls are showing, so the bar never covers them",
                "The gear holds subtitles, audio tracks, chapters, playback speed, and video and subtitle adjustments",
              ],
            },
            {
              label: "Media Info",
              src: `${IMG}/info.jpg`,
              width: 1600,
              height: 958,
              alt: "The Media Info panel showing the mpv engine, MKV container, file size, duration, H.264 codec, 1920x1080 dimensions and 30 fps",
              caption: "Media Info (⌘I) shows which engine is playing the file, along with the container, codecs, resolution, frame rate and bitrate of every track.",
            },
            {
              label: "Downloader",
              src: `${IMG}/download.jpg`,
              width: 1600,
              height: 958,
              alt: "The Download from URL dialog asking for a link to a video or playlist on YouTube or another site yt-dlp supports",
              caption: "A built-in downloader powered by yt-dlp, for videos or whole playlists. It asks for video or audio only, the format, and which subtitles to keep, then shows progress in the background.",
              points: [
                "The save folder is picked once and remembered with a security-scoped bookmark, the sandbox-safe way to keep access",
                "YouTube's auto-captions are fixed as they're saved so they don't show up as two stacked lines, in this player or any other",
              ],
            },
          ]}
        />
      </section>

      <section className="space-y-6">
        <SectionHeading title="Under the Hood" />

        <Stats
          items={[
            { value: "~8.2k", label: "lines of Swift" },
            { value: "2", label: "playback engines" },
            { value: "27", label: "file formats" },
            { value: "0", label: "stock player controls" },
          ]}
        />

        <DashList
          title="Features"
          items={[
            "Chapters, audio and subtitle track selection, external subtitle files, subtitle delay, size, font and colors, and a text-encoding picker for legacy subtitle files",
            "On-device subtitle translation with Apple's Translation framework, for either engine",
            "Resume where you left off, per file, plus a home screen with Continue Watching",
            "Saved playlists with M3U import and export, shuffle and repeat, A–B looping, frame stepping, and snapshots",
            "Now Playing and AirPlay integration, trackpad gestures, and remappable keyboard shortcuts",
          ]}
        />

        <DashList
          title="How it works"
          items={[
            "Both engines sit behind one PlaybackEngine protocol. The file extension picks the engine, and each engine declares its capabilities, so the UI hides a control rather than offering one that silently does nothing",
            "mpv calls back from its own threads. Those callbacks forward everything to the main actor before touching any UI state",
            "UI calls into mpv use its asynchronous API, and the track and chapter lists are observed and cached, so a busy mpv core can't freeze the app",
            "Playback time ticks about ten times a second, so it lives on its own small object. Only the views that display time redraw on each tick",
          ]}
        />

        <Stories
          title="Bugs worth remembering"
          stories={[
            {
              title: "Subtitles that never arrived",
              body: "For translation, AVFoundation reports each subtitle line through a delegate method. It's an optional protocol method on a private class, and Swift doesn't expose those to Objective-C automatically, so AVFoundation never found it. Nothing crashed or logged an error; the translated line just stayed empty. The fix was one @objc attribute.",
            },
            {
              title: "Menus that flickered while anything played",
              body: "The current playback time was published on the main view model, so ten times a second every view that observed it redrew, including the menu bar commands. Open menus flickered and dropped clicks for as long as a video was playing. Moving the clock onto its own object, observed only by the time readout and scrubber, fixed it.",
            },
            {
              title: "A freeze caused by a permission prompt",
              body: "By default mpv looks for subtitle and cover-art files next to the video. In the App Sandbox, listing a folder in Documents made macOS ask for access, and mpv's core thread sat waiting on the answer. The next call into mpv froze the app. The fix was turning off mpv's folder scanning and loading subtitle files explicitly.",
            },
            {
              title: "Audio-only playback, for good",
              body: "mpv loads files asynchronously. If a file started before the video view had created its render context, mpv decided there was no video output and never turned video back on, so the file played as audio only. Loads now wait for the render context, and seeks and subtitle loads are queued until mpv reports the file has loaded.",
            },
          ]}
        />
      </section>
    </CaseStudyShell>
  )
}
