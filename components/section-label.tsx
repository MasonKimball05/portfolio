export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest">
      <span className="text-primary">[</span>
      <span className="text-muted-foreground">{children}</span>
      <span className="text-primary">]</span>
    </h2>
  )
}
