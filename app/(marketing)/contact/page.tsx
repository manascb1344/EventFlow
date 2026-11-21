"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

interface MessagePreview {
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [preview, setPreview] = useState<MessagePreview | null>(null)

  const handlePreview = (event: React.FormEvent) => {
    event.preventDefault()
    setPreview({ email, subject, message })
  }

  return (
    <div className="container max-w-5xl py-20 lg:py-28">
      <p className="editorial-kicker">Contact</p>
      <h1 className="editorial-title max-w-2xl">Questions about the project?</h1>
      <p className="editorial-lead mt-8">
        EventFlow is a portfolio project. The fastest way to reach the author is
        to open an issue on GitHub. Bug reports, questions about the code, and
        suggestions for students using it are all welcome.
      </p>

      <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <div className="border-t border-white/10 pt-6">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-p1">GitHub</div>
            <p className="mt-4 leading-relaxed text-[#8b93a3]">
              Open an issue with the page or file involved, what you expected,
              and what happened. Read the contributing guide before opening a
              pull request.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Button variant="outline" className="rounded-md border-white/20 bg-transparent" asChild>
                <Link href="https://github.com/manascb1344/EventFlow/issues" target="_blank">
                  Open an issue
                </Link>
              </Button>
              <Button variant="outline" className="rounded-md border-white/20 bg-transparent" asChild>
                <Link href="https://github.com/manascb1344/EventFlow/blob/main/CONTRIBUTING.md" target="_blank">
                  Contributing guide
                </Link>
              </Button>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-p1">Live demo</div>
            <p className="mt-4 leading-relaxed text-[#8b93a3]">
              Use the hosted app to try the full organizer and attendee flow.
              No account is needed to browse events.
            </p>
            <Button variant="outline" className="mt-5 rounded-md border-white/20 bg-transparent" asChild>
              <Link href="https://eventflow.zephop.com" target="_blank">
                Open the demo
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-white/10 p-8">
          <h2 className="text-xl font-semibold text-[#f4f5f7]">Send a message</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#8b93a3]">
            This form is a UI example. It does not send email. Use GitHub issues
            for anything you need a reply to.
          </p>
          <form className="mt-8 space-y-5" onSubmit={handlePreview}>
            <div>
              <label htmlFor="contact-email" className="text-sm font-medium text-[#e7e9ee]">Email</label>
              <Input id="contact-email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 rounded-md border-white/20 bg-transparent" />
            </div>
            <div>
              <label htmlFor="contact-subject" className="text-sm font-medium text-[#e7e9ee]">Subject</label>
              <Input id="contact-subject" placeholder="What is this about?" value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-2 rounded-md border-white/20 bg-transparent" />
            </div>
            <div>
              <label htmlFor="contact-message" className="text-sm font-medium text-[#e7e9ee]">Message</label>
              <Textarea id="contact-message" placeholder="Tell me what you are working on..." value={message} onChange={(event) => setMessage(event.target.value)} className="mt-2 min-h-[140px] rounded-md border-white/20 bg-transparent" />
            </div>
            <Button type="submit" className="rounded-md bg-p1 font-semibold text-[#05121a] hover:bg-[#7bf6ff]">
              Preview message
            </Button>
          </form>
          {preview && (
            <div className="mt-8 rounded-md border border-white/10 bg-white/5 p-6" aria-live="polite">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-p1">Message preview</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-[#8b93a3]">From</dt>
                  <dd className="mt-1 break-words text-[#e7e9ee]">{preview.email || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="text-[#8b93a3]">Subject</dt>
                  <dd className="mt-1 break-words text-[#e7e9ee]">{preview.subject || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="text-[#8b93a3]">Message</dt>
                  <dd className="mt-1 whitespace-pre-wrap break-words text-[#e7e9ee]">{preview.message || "Not provided"}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
