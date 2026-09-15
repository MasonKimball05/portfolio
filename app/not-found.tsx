import Link from "next/link"
import { TerminalWindow } from "@/components/terminal-window"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-24">
        <TerminalWindow title="guest@masonkimball:~">
          <div className="space-y-4 text-sm">
            <p>
              <span className="text-primary">$</span> cd ./this-page
            </p>
            <p className="text-red-500 dark:text-red-400">
              bash: cd: ./this-page: No such file or directory
            </p>
            <div className="space-y-1 pt-2">
              <p className="text-2xl font-semibold tracking-tight text-foreground">404</p>
              <p className="text-muted-foreground leading-relaxed">
                This page doesn&apos;t exist in this filesystem.
              </p>
            </div>
            <p className="pt-2">
              <Link href="/" className="text-primary hover:underline">
                cd ~
              </Link>
              <span className="text-muted-foreground"> to go home — or open the terminal (bottom right) and type </span>
              <span className="text-primary">ls</span>
              <span className="text-muted-foreground">.</span>
            </p>
          </div>
        </TerminalWindow>
      </main>
    </div>
  )
}
