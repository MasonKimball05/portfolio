'use client'

import Image from "next/image"
import { useState } from "react"

export type ScreenshotTab = {
  label: string
  src: string
  darkSrc?: string
  width: number
  height: number
  alt: string
  /** One or two sentences about what this screen shows. */
  caption: string
  /** Details worth pointing out, shown under the image. */
  points?: string[]
}

/** A set of screenshots behind tabs, styled like the case-study blocks. */
export function ScreenshotTabs({ tabs }: { tabs: ScreenshotTab[] }) {
  const [active, setActive] = useState(0)
  const tab = tabs[active]
  const img = "w-full h-auto border border-border"

  return (
    <div className="space-y-3">
      <div role="tablist" aria-label="App screens" className="flex flex-wrap gap-1.5">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            role="tab"
            id={`shot-tab-${i}`}
            aria-selected={i === active}
            aria-controls="shot-panel"
            onClick={() => setActive(i)}
            className={`text-xs border px-2.5 py-1 transition-colors ${
              i === active
                ? "border-foreground text-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <figure id="shot-panel" role="tabpanel" aria-labelledby={`shot-tab-${active}`} className="space-y-3">
        <Image
          key={tab.src}
          src={tab.src}
          alt={tab.alt}
          width={tab.width}
          height={tab.height}
          className={`${img} ${tab.darkSrc ? "dark:hidden" : ""}`}
        />
        {tab.darkSrc && (
          <Image
            key={tab.darkSrc}
            src={tab.darkSrc}
            alt={tab.alt}
            width={tab.width}
            height={tab.height}
            className={`${img} hidden dark:block`}
          />
        )}
        <figcaption className="space-y-2">
          <p className="text-sm text-muted-foreground leading-relaxed">{tab.caption}</p>
          {tab.points && (
            <ul className="space-y-1.5">
              {tab.points.map((p) => (
                <li key={p} className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                  <span className="flex-shrink-0 select-none">—</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}
        </figcaption>
      </figure>
    </div>
  )
}
