import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border px-4 sm:px-6 py-6">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          mason kimball · samford university · {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <a
            href="https://github.com/MasonKimball05"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/mason-kimball2005/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <Link href="/contact" className="hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
