"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

// Live status of my deployed sites, published by Sentinel
// (/projects/sentinel) to a public gist. The workflow is scheduled every 30
// minutes, but GitHub runs free scheduled jobs best-effort: in practice every
// 1-6 hours.
//
// Read through api.github.com rather than the raw gist URL because the
// site's Content-Security-Policy already allows that origin.
export const STATUS_GIST_ID = "dff5a80f15e319618626658a1280a671"

/** Past this age the data is shown as stale: the scheduled runs have stopped,
 * not just been delayed (gaps of up to ~6 hours are normal). */
const STALE_AFTER_MS = 8 * 60 * 60 * 1000

const DISPLAY_NAMES: Record<string, string> = {
  parliament: "Parliament",
  portfolio: "This site",
}

interface SiteStatus {
  name: string
  url: string
  up: boolean
  response_ms?: number
  tls_days_left?: number
  post_quantum?: boolean
}

interface Summary {
  generated_at: string
  sites: SiteStatus[]
}

type State = { kind: "loading" } | { kind: "error" } | { kind: "ok"; summary: Summary }

function timeAgo(iso: string, now: number): string {
  const mins = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000))
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins} min ago`
  const hours = Math.round(mins / 60)
  return hours < 48 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`
}

export function LiveStatus({ showLink = true }: { showLink?: boolean }) {
  const [state, setState] = useState<State>({ kind: "loading" })
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!STATUS_GIST_ID) return
    const ctrl = new AbortController()
    fetch(`https://api.github.com/gists/${STATUS_GIST_ID}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((gist) => {
        const summary = JSON.parse(gist.files?.["status.json"]?.content ?? "") as Summary
        if (!Array.isArray(summary.sites)) throw new Error("bad status")
        setState({ kind: "ok", summary })
      })
      .catch((e) => {
        if (e?.name !== "AbortError") setState({ kind: "error" })
      })
    const tick = setInterval(() => setNow(Date.now()), 60_000)
    return () => {
      ctrl.abort()
      clearInterval(tick)
    }
  }, [])

  // Not configured yet: render nothing rather than an empty box.
  if (!STATUS_GIST_ID) return null

  if (state.kind !== "ok") {
    return (
      <p className="text-sm text-muted-foreground">
        {state.kind === "loading" ? "Checking…" : "Status is unavailable right now."}
      </p>
    )
  }

  const { summary } = state
  const stale = now - new Date(summary.generated_at).getTime() > STALE_AFTER_MS

  return (
    <div className="space-y-2">
      <div className="border border-border divide-y divide-border">
        {summary.sites.map((s) => {
          const dot = stale ? "bg-slate-400" : s.up ? "bg-green-500" : "bg-red-500"
          const label = stale ? "unknown" : s.up ? "operational" : "down"
          return (
            <div key={s.name} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} aria-hidden />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{DISPLAY_NAMES[s.name] ?? s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{new URL(s.url).host}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs">{label}</p>
                <p className="text-xs text-muted-foreground">
                  {[
                    s.up && s.response_ms != null ? `${s.response_ms} ms` : null,
                    s.tls_days_left != null ? `cert ${s.tls_days_left}d` : null,
                    s.post_quantum ? "PQ TLS" : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Checked {timeAgo(summary.generated_at, now)}
        {stale && " — the checker may be behind schedule"}
        {showLink && (
          <>
            {" "}by{" "}
            <Link href="/projects/sentinel" className="underline hover:text-foreground">
              Sentinel
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
