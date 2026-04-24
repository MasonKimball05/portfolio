"use client"

// This file is a client component — it needs to be because usePathname()
// is a hook, and hooks can only run on the client side.
// The "use client" directive at the top is what tells Next.js that.

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

const links = [
  { href: "/about",    label: "about" },
  { href: "/projects", label: "projects" },
  { href: "/skills",   label: "skills" },
  { href: "/berlin",   label: "berlin" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">

          {pathname !== "/" ? (
              <span className="text-sm font-medium">
                <Link href="/" className="hover:text-foreground transition-colors">
                  mason kimball
                </Link>
              </span>
          ):
              <span className="text-sm font-medium">mason kimball</span>
          }

        <div className="flex items-center gap-6 text-sm">
          {pathname !== "/" && (
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              home
            </Link>
          )}
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              // If the current path matches this link's href, apply blue.
              // Otherwise use the default muted color.
              className={
                pathname === href
                  ? "text-blue-500"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
