"use client"

import Link from "next/link"
import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#080b10]">
      <div className="container px-4 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight text-[#f4f5f7]">EventFlow</h3>
            <p className="text-sm leading-relaxed text-[#8b93a3]">
              A full-stack event management and ticketing app. Built as a working
              portfolio project and open source.
            </p>
            <Button variant="ghost" size="icon" className="text-[#8b93a3] hover:text-p1" asChild>
              <Link href="https://github.com/manascb1344/EventFlow" target="_blank" aria-label="EventFlow on GitHub">
                <Github className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f4f5f7]">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/features" className="text-[#8b93a3] hover:text-p1 transition-colors">Features</Link></li>
              <li><Link href="/events" className="text-[#8b93a3] hover:text-p1 transition-colors">Browse events</Link></li>
              <li><Link href="/pricing" className="text-[#8b93a3] hover:text-p1 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f4f5f7]">Project</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-[#8b93a3] hover:text-p1 transition-colors">About</Link></li>
              <li><Link href="/docs" className="text-[#8b93a3] hover:text-p1 transition-colors">Docs</Link></li>
              <li><Link href="/contact" className="text-[#8b93a3] hover:text-p1 transition-colors">Contact</Link></li>
              <li><Link href="/changelog" className="text-[#8b93a3] hover:text-p1 transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f4f5f7]">Get started</h3>
            <p className="text-sm leading-relaxed text-[#8b93a3]">
              Create an organizer account and publish an event. The demo uses
              Stripe test cards, so no real money moves.
            </p>
            <Button className="h-9 rounded-md bg-p1 px-4 text-sm font-semibold text-[#05121a] hover:bg-[#7bf6ff]" asChild>
              <Link href="/auth/organizer/signup">Create an event</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[#8b93a3]">
            <p>&copy; {new Date().getFullYear()} EventFlow. MIT licensed.</p>
            <Link href="https://github.com/manascb1344/EventFlow" target="_blank" className="hover:text-p1">
              Source on GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
