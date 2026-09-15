export function TerminalTitleBar({
  title,
  onClose,
}: {
  title: string
  onClose?: () => void
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/40 flex-shrink-0">
      {onClose ? (
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-2.5 h-2.5 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors"
        />
      ) : (
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
      )}
      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
      <span className="ml-2 text-xs text-muted-foreground truncate">{title}</span>
    </div>
  )
}

export function TerminalWindow({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-card shadow-2xl shadow-primary/10 overflow-hidden">
      <TerminalTitleBar title={title} />
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  )
}
