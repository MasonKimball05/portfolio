export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-5">
      <div className="max-w-3xl mx-auto text-xs text-muted-foreground">
        mason kimball · samford university · {new Date().getFullYear()}
      </div>
    </footer>
  )
}
