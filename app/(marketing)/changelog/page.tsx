const releases = [
  {
    date: "2026-11-21",
    tag: "Docs",
    title: "Repository made discoverable",
    body: "Rewrote the README for students, added an MIT license and a contributing guide, set the repository description and topics, and made the repo public.",
  },
  {
    date: "2026-11-21",
    tag: "Design",
    title: "Editorial redesign of the public pages",
    body: "Removed gradient headings, pill badges, and icon-card grids. Replaced stock imagery with real product screenshots and removed invented metrics and testimonials.",
  },
  {
    date: "2026-11-20",
    tag: "Domain",
    title: "Custom domain and OAuth",
    body: "Connected eventflow.zephop.com through Cloudflare and Vercel. Registered the domain in Google OAuth and added a Stripe webhook for the new origin.",
  },
  {
    date: "2026-11-20",
    tag: "Payments",
    title: "Demo checkout",
    body: "Added a labeled demo checkout that issues the same atomic ticket without Stripe, so the purchase flow is testable while Stripe account activation is pending.",
  },
  {
    date: "2026-11-19",
    tag: "Foundation",
    title: "Clean build, CI, and deployment",
    body: "Fixed all lint and type errors, tracked migrations, added GitHub Actions and a health endpoint, and upgraded to a patched Next.js release for deployment.",
  },
]

export default function ChangelogPage() {
  return (
    <div className="container max-w-4xl py-20 lg:py-28">
      <p className="editorial-kicker">Changelog</p>
      <h1 className="editorial-title max-w-2xl">What changed, and when.</h1>
      <p className="editorial-lead mt-8">
        A short record of the work that went into this project. The full history
        is in the public GitHub repository.
      </p>

      <div className="mt-14">
        {releases.map((release) => (
          <article key={release.title} className="grid gap-4 border-t border-white/10 py-8 sm:grid-cols-[7rem_1fr]">
            <div>
              <time className="font-mono text-xs text-[#8b93a3]">{release.date}</time>
              <div className="mt-2 inline-block rounded border border-p1/30 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-p1">
                {release.tag}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[#f4f5f7]">{release.title}</h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-[#8b93a3]">{release.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
