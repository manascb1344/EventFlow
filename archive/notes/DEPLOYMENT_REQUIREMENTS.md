# EventFlow — Deployment Requirements & Readiness Spec

Status: agreed requirements, implementation not started.
Last updated: 2026-11-18.

This document is the single source of truth for what must be true before EventFlow is
deployed and presentable as a resume project. It is derived from a full read of the
codebase, not from the boilerplate README.

## 1. Locked decisions

| Area | Decision |
|---|---|
| Runtime topology | Keep the existing single Next.js App Router application on Vercel (server components, server actions and route handlers stay together). No separate backend service. |
| Database | Managed PostgreSQL on **Neon**. One database per environment; preview deployments use Neon branches. |
| Payments | **Stripe test mode only.** Fully working checkout and webhooks with test cards; no real charges. |
| Scope | Fix and ship the full existing feature set (auth, onboarding, events, ticketing, saved events, profiles, analytics, reports). No feature removal. |
| Package manager | To be locked to **pnpm** (single lockfile). `yarn.lock` must be removed. |
| Node version | Pin via `engines` to the version used in production; do not rely on Vercel defaults. |

## 2. System inventory (as built)

- Next.js 15.0.3, React 19 release candidate, App Router only.
- 30 pages, 4 route handlers, 3 layouts; route groups `(landing)`, `(marketing)`.
- Drizzle ORM + `postgres` driver, 9 tables, one initial migration on disk.
- NextAuth v4: JWT sessions, Credentials provider (role-aware), Google provider (attendees only).
- Stripe Checkout session creation + `checkout.session.completed` webhook.
- Nodemailer SMTP with inline HTML receipt/error templates.
- UploadThing for image uploads; Rabata/R2-style environment variables exist but are unused.
- shadcn/ui + Radix + Tailwind + framer-motion; dark branded theme.
- Python Selenium scripts and generated DOCX reports exist but are not a CI test suite.

## 3. Environment contract

One `.env.example` must be committed with names and placeholders only. Real values live in
Vercel project settings (Preview and Production separately) and in an untracked local `.env`.

| Variable | Service | Needed for | Notes |
|---|---|---|---|
| `POSTGRES_URL` | Neon | All runtimes | Use the pooled connection string. Never the direct admin URL in the app. |
| `NEXTAUTH_SECRET` | NextAuth v4 | Auth | One canonical secret. Existing `AUTH_SECRET` is a v5 leftover — remove it. |
| `NEXTAUTH_URL` | NextAuth v4 | Auth | Must equal the deployment origin (preview URLs included where needed). |
| `NEXT_PUBLIC_APP_URL` | App | Stripe redirect URLs | Must equal the deployment origin. |
| `BASE_URL` | Email | Absolute links in emails | Must equal the deployment origin. Consolidate with `NEXT_PUBLIC_APP_URL` if possible. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google Cloud | OAuth | Register production and preview callback URLs in Google Console. |
| `STRIPE_SECRET_KEY` | Stripe | Checkout | **Test-mode key** (`sk_test_...`) for this deployment. |
| `STRIPE_WEBHOOK_SECRET` | Stripe | Webhook verification | Separate secret per environment. `.env:7-8` currently duplicates this key — fix. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL` | Email provider | Receipts | Use a transactional provider with SPF/DKIM/DMARC configured. |
| `UPLOADTHING_TOKEN` | UploadThing | Image uploads | Production token; update allowed origins. |
| `UNSPLASH_API_KEY` | Unsplash | Seeding only | Not needed at runtime; keep out of production env if unused. |
| `NEXT_PUBLIC_RABATA_*` (4 vars) | Rabata/R2 | Unused | Remove, or choose this as the storage vendor and implement it. Do not ship dead config. |

No secret values may be committed anywhere, including screenshots, DOCX files and reports.

## 4. Per-provider deployment prerequisites

### Vercel
- One project, framework preset Next.js, pinned Node version.
- Environment variables set for Production and Preview; no `.env` in the build.
- Build command must succeed from a clean checkout. Currently it does not (see gap B1).
- Migrations run as an explicit release step, never as part of `next build`.
- `vercel.json` only if a specific override is needed (region, headers, function duration).
- Custom domain + HTTPS; all origin variables updated to that domain.

### Neon
- Production database and a branch per preview environment.
- Pooled connection string in `POSTGRES_URL`; set a sensible client `max` in `lib/db/drizzle.ts`.
- Migration runner executes committed migration files as a one-off deploy command.
- Backups enabled; connection limits reviewed against Vercel function concurrency.

### Stripe (test mode)
- Test-mode secret key and webhook signing secret.
- Webhook endpoint `https://<domain>/api/stripe/webhook` subscribed to `checkout.session.completed`.
- Stripe CLI configured for local webhook forwarding during development.
- Test card checklist documented for demoing checkout.
- Decide and document the payout model: Stripe Connect columns exist in the schema but no
  payout flow is implemented. Either implement it or remove the dead columns.

### Google OAuth
- OAuth client with authorized redirect URIs for production and preview domains.
- Consent screen configured; note that organizers are intentionally blocked from Google
  sign-in in `lib/auth/authOptions.ts:116-125` — confirm this is desired.

### Email
- Transactional SMTP provider account and verified sending domain.
- DNS: SPF, DKIM, DMARC.
- `/privacy` and `/terms` pages must exist because receipt emails link to them.

### Storage
- UploadThing production token and allowed origins.
- `cors-config.json` currently hardcodes `http://localhost:3000`; add the production origin.
- Resolve the unused Rabata variables.

## 5. Gap register (evidence in the current code)

Severity: **B** = blocks deployment, **H** = high risk, **M** = quality/reliability.

| ID | Sev | Gap | Evidence | Required fix |
|---|---|---|---|---|
| B1 | B | `pnpm build` fails on ESLint (unused vars, `no-explicit-any`, `<img>` warnings) across ~20 files | Build run 2026-11-18 | Fix all findings; do not disable rules globally. |
| B2 | B | Two lockfiles (`pnpm-lock.yaml`, `yarn.lock`) | repo root | Keep pnpm; delete `yarn.lock`. |
| B3 | B | pnpm 11 blocks `sharp`/`esbuild`/`core-js` build scripts | `ERR_PNPM_IGNORED_BUILDS` on build | Add explicit `onlyBuiltDependencies` / `allowBuilds` config. |
| B4 | B | Migrations are gitignored | `.gitignore:51` | Commit `lib/db/migrations` and its journal/snapshots. |
| B5 | B | Migration generation happens during build | `package.json:16-17` | Split into a one-off release step; generate migrations locally and commit them. |
| B6 | B | No `.env.example`; duplicate `STRIPE_WEBHOOK_SECRET` in local `.env` | `.env:7-8` | Add template; deduplicate; rotate real values. |
| B7 | B | No `engines` field; React 19 RC + Next 15.0.3 | `package.json:56,62`, local Node v24.16.0 | Pin Node; upgrade framework/deps to stable. |
| H1 | H | Direct Postgres connections, no pooling config | `lib/db/drizzle.ts:12` | Pooled Neon URL + bounded `max` connections. |
| H2 | H | Webhook seat decrement is a read-modify-write race; no transaction | `webhook/route.ts:103-125` | Atomic conditional decrement inside a transaction with ticket/payment inserts. |
| H3 | H | Webhook email uses non-existent fields `event.title` / `event.eventDate` | `webhook/route.ts:153-155` vs `schema.ts:93,95` | Use `event.name` / `event.startDate`. |
| H4 | H | Amount divided by 100 despite receiving a raw decimal | `lib/email/index.ts:82` | Pass minor units consistently; add a unit test. |
| H5 | H | Webhook `maxDuration=10` while doing DB + invoice + email work | `webhook/route.ts:13` | Keep work minimal, move email off the critical path, raise duration only if needed. |
| H6 | H | Production `console.log` of sessions, Stripe session and signature | `authOptions.ts:43,108`; `api/stripe/route.ts:18,28,59` | Replace with redacted structured logging. |
| H7 | H | `CORS: *` on the webhook route | `next.config.ts:24-44` | Remove; webhooks do not need browser CORS. |
| H8 | H | Auth guards inconsistent: some pages client-only; redirects to non-existent `/auth/signin` | `analytics/page.tsx`, `my-tickets`, `profile`, `saved-events`; `attendee/settings:19`, `organizer/settings:14` | Server-side guard in every protected page/action/API; one sign-in route per role. |
| H9 | H | `/events` is not public in middleware; tests disagree on expected behavior | `middleware.ts:5-17`; Selenium reports; browser check 2026-11-18 confirmed an immediate redirect to `/auth/attendee/signin?callbackUrl=%2Fevents` | **Decision needed:** confirm whether anyone can browse events without signing in. |
| H10 | H | No rate limiting on auth/checkout; no Zod validation on server actions | `bloom-fixes.txt:10-12` | Add validation at boundaries and basic rate limiting. |
| H11 | H | No missing-table/index coverage on hot queries | `schema.ts:85-130` | Add indexes on `events(status,start_date)`, ticket/event/attendee FKs, unique on `saved_events(attendee_id,event_id)`. |
| M1 | M | Root metadata still `Create Next App` | `app/layout.tsx:21-24` | Full metadata + Open Graph; update the Selenium assertion. |
| M2 | M | No `loading.tsx`, `error.tsx`, `not-found.tsx` | `app/` tree | Add route-level boundaries. |
| M3 | M | Dead code: subscription columns that do not exist in schema | `lib/db/queries.ts:26-43` | Delete or implement properly. |
| M4 | M | Docs are boilerplate; `DOCS/` has only diagrams; diagrams show NGINX/Docker/Redis not used in code | `README.md`, `DOCS/*.png` | Rewrite README; add architecture/setup/deploy docs; update diagrams. |
| M5 | M | Selenium suite is not reproducible in CI; results in DOCX reports are stale | `selenium_*.py`, `test_reports/` | Add Playwright/Vitest in CI; archive Selenium artifacts as evidence. |
| M6 | M | No error tracking, health check, or structured logging | repo-wide | Add Sentry (or equivalent) and `/api/health`. |

## 6. Target architecture

```
Browser
  -> Vercel Edge (Next.js middleware: session + role/onboarding gates)
  -> Vercel Node functions (server components, server actions, route handlers)
       -> Neon Postgres (pooled connection, migrations as release step)
       -> Stripe (test mode: Checkout + webhook)
       -> Google OAuth
       -> SMTP provider (Resend/SendGrid/Brevo or verified Gmail)
       -> UploadThing
  -> Observability (Sentry + structured logs)
```

## 7. Phased delivery plan

| Phase | Outcome | Exit check |
|---|---|---|
| 0. Decisions | This document agreed; remaining minor choices resolved (H9, storage vendor, email provider, domain). | Sign-off. |
| 1. Repository hygiene | One lockfile, pinned Node, `.env.example`, committed migrations, secrets rotated, metadata rebranded, dead code removed. | Clean checkout installs deterministically. |
| 2. Green build | All lint/type errors fixed; no `any`/`<img>` warnings suppressed. | `pnpm build` exits 0 on a clean checkout. |
| 3. Infrastructure & staging | Neon, Vercel, Stripe test, OAuth, SMTP and UploadThing configured; preview DB branch; release migration step. | Staging URL loads; signup/login and event listing work against Neon. |
| 4. Correctness & security | Atomic ticketing, webhook fixes, server-side authorization, validation, logging, indexes, CORS cleanup. | Test checkout creates exactly one ticket; seat count never negative; unauthorized access blocked. |
| 5. CI, observability, docs | CI pipeline, Sentry, health check, Playwright/Vitest, rewritten README and ADRs. | CI green on PR; resume-ready documentation. |

## 8. Definition of done

- `pnpm build` and CI pass from a clean clone with only `.env.example` present in the repo.
- Preview and Production URLs use HTTPS and the correct origin variables.
- A test-mode Stripe checkout creates one ticket, sends one receipt, and decrements seats exactly once — including when the webhook is retried.
- All protected routes and server actions reject unauthenticated/wrong-role requests on the server.
- No secrets, real credentials, or PII in logs, screenshots, or committed artifacts.
- README explains what the product does, how to run it, required env vars, architecture, and how it was deployed.
- The public demo can be explored without a real payment and without private data.

## 9. Resolved calls

- Event browsing is public. Anonymous visitors can open /events and event detail pages. Saving,
  checkout, onboarding, and dashboards still require a session.
- Email uses the existing SMTP variables. Resend is the documented provider. No provider account
  was created by the code work.
- UploadThing is the only upload vendor. The Rabata variables are left out of .env.example.
- No domain is hardcoded. Every origin comes from Vercel environment settings.
- Stripe Connect payout columns stay. Removing them needs a schema migration and touches seeding,
  so it is a follow-up rather than a blocker.

## 11. Program status

- PR1 makes a clean checkout install, lint, typecheck, and build. It adds .env.example, tracks
  migrations, pins Node, and fixes all lint and type errors.
- PR2 issues tickets atomically, prevents overselling, adds indexes and constraints, and fixes
  receipt data.
- PR3 makes event browsing public, fixes broken redirects, adds server-side guards, and removes
  log leakage and loose CORS.
- PR4 adds this documentation, CI, and a health endpoint.

Items still needing operator action: create the Vercel and Neon projects, set environment
variables, register OAuth callbacks and the Stripe webhook, choose a sending domain, and click the
merges. Independent review was blocked because the subagent runtime hit its usage limit.
