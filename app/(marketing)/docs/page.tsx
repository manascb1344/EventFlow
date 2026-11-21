import Link from "next/link"

const sections = [
  {
    title: "Run it locally",
    body: "Install dependencies with pnpm, copy .env.example to .env, start PostgreSQL with Docker, apply migrations, then run the dev server. The README has the full command list.",
    link: { href: "https://github.com/manascb1344/EventFlow#getting-started", label: "Setup in README" },
  },
  {
    title: "Understand the data model",
    body: "Nine Drizzle tables cover organizers, attendees, events, tickets, payments, speakers, surveys, reports, and saved events. Types and constraints live in one schema file.",
    link: { href: "https://github.com/manascb1344/EventFlow/blob/main/lib/db/schema.ts", label: "Read the schema" },
  },
  {
    title: "Follow a ticket purchase",
    body: "The Stripe route reads the price from the database. The webhook and success page share one function that issues the ticket, records payment, and reserves a seat in a transaction.",
    link: { href: "https://github.com/manascb1344/EventFlow/blob/main/lib/ticketing/issue-ticket.ts", label: "See the ticket helper" },
  },
  {
    title: "See the API routes",
    body: "Five route handlers cover NextAuth, Stripe checkout, the Stripe webhook, UploadThing, and a health check. Each maps to one job.",
    link: { href: "https://github.com/manascb1344/EventFlow#api-routes", label: "API route table" },
  },
  {
    title: "Read the decisions",
    body: "The ADRs record why the app is one Next.js deployment, why Neon, why Stripe test mode, and why the demo checkout exists.",
    link: { href: "https://github.com/manascb1344/EventFlow/tree/main/DOCS/adr", label: "Open the ADRs" },
  },
  {
    title: "Contribute",
    body: "The contributing guide covers the development loop, the commands to run before a pull request, and the conventions the codebase follows.",
    link: { href: "https://github.com/manascb1344/EventFlow/blob/main/CONTRIBUTING.md", label: "Read the guide" },
  },
]

export default function DocsPage() {
  return (
    <div className="container max-w-5xl py-20 lg:py-28">
      <p className="editorial-kicker">Docs</p>
      <h1 className="editorial-title max-w-3xl">Find your way around the code.</h1>
      <p className="editorial-lead mt-8">
        This project is meant to be read. These links point at the real source
        and the docs in the repository, not placeholder pages.
      </p>

      <div className="mt-14">
        {sections.map((section, index) => (
          <article key={section.title} className="grid gap-4 border-t border-white/10 py-8 md:grid-cols-[3rem_1fr]">
            <span className="font-mono text-xs text-p1">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[#f4f5f7]">{section.title}</h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-[#8b93a3]">{section.body}</p>
              <Link href={section.link.href} target="_blank" className="mt-4 inline-block text-sm font-medium text-p1 underline decoration-p1/40 underline-offset-4 hover:decoration-p1">
                {section.link.label}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
