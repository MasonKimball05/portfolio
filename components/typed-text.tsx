"use client"

import { useEffect, useState } from "react"

export function TypedText({
  text,
  className,
  startDelay = 0,
  speedMs = 45,
}: {
  text: string
  className?: string
  startDelay?: number
  speedMs?: number
}) {
  // Starts as the full string so SSR output and no-JS visitors see real
  // content immediately; the animation only kicks in after client mount.
  const [shown, setShown] = useState(text)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    setShown("")

    const timers: ReturnType<typeof setTimeout>[] = []
    const start = setTimeout(() => {
      let i = 0
      const tick = () => {
        if (cancelled) return
        i++
        setShown(text.slice(0, i))
        if (i < text.length) timers.push(setTimeout(tick, speedMs))
      }
      tick()
    }, startDelay)
    timers.push(start)

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [text, startDelay, speedMs])

  return <span className={className}>{shown}</span>
}
