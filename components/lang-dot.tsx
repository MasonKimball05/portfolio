import { LANG_COLORS } from "@/lib/lang-colors"

export function LangDot({ lang }: { lang: string }) {
  const color = LANG_COLORS[lang] ?? "bg-slate-500"
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={`w-2 h-2 flex-shrink-0 ${color}`} />
      {lang}
    </span>
  )
}
