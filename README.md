# EventFlow

EventFlow is a two-sided event management and ticketing application. Organizers create and
publish events, manage attendees, and read sales analytics. Attendees browse events, save the
ones they like, buy tickets with Stripe, and view their tickets in a dashboard.

## Stack

- Next.js 15 App Router, React 19, TypeScript
- PostgreSQL with Drizzle ORM
- NextAuth with credentials and Google sign-in
- Stripe Checkout and webhooks in test mode
- UploadThing for image uploads
- SMTP email for payment receipts
- Tailwind CSS and shadcn/ui

## Local setup

Requirements: Node.js 20.9 or newer, pnpm, Docker, and a Stripe CLI for webhook forwarding.

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env` and fill in the values.
3. Start PostgreSQL with `docker compose up -d`.
4. Apply migrations with `pnpm db:migrate`. Use `pnpm db:seed` to load sample events.
5. Start the app with `pnpm dev`.

Open http://localhost:3000.

## Environment variables

`.env.example` lists every variable the app reads. The groups are database (`POSTGRES_URL`),
auth (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`), origin
URLs (`NEXT_PUBLIC_APP_URL`, `BASE_URL`), payments (`STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`), email (`SMTP_*`), and uploads (`UPLOADTHING_TOKEN`). The Unsplash key
is only needed when regenerating seed data. Never commit real values.

## Scripts

- `pnpm dev` starts the development server.
- `pnpm build` creates a production build.
- `pnpm lint` runs ESLint.
- `pnpm typecheck` runs the TypeScript compiler without emitting files.
- `pnpm db:generate` creates a migration from schema changes.
- `pnpm db:migrate` applies migrations.
- `pnpm db:seed` loads sample data.
- `pnpm db:reset` drops all tables. Use it only in development.

## Architecture

The browser talks to a single Next.js application on Vercel. NextAuth middleware gates protected
routes, and pages and server actions check the session again on the server. Server components
and server actions read and write PostgreSQL through Drizzle. Stripe Checkout creates a payment
session from the price stored in the database. The webhook issues the ticket, payment record,
and seat reservation in one transaction. Receipts go out over SMTP. UploadThing stores images.

`DOCS/DEPLOYMENT_REQUIREMENTS.md` holds the deployment contract and gap register.
`DOCS/adr/` records the main design decisions.

## Testing

Run `pnpm lint` and `pnpm typecheck` before opening a pull request. CI runs both plus a full
production build on every pull request. The Python Selenium scripts and the generated DOCX
reports under `test_reports/` are historical artifacts from a browser-testing exercise. They
require a running app and Chrome and are not part of CI.

## Deployment

Vercel hosts the application. Neon hosts PostgreSQL. Set the environment variables in Vercel for
each environment, apply migrations with `pnpm deploy-migrate` as a release step, and let Vercel
run the build. Configure the Stripe webhook for each deployed origin and register the Google
OAuth callback URLs. Stripe stays in test mode, so checkout can be demonstrated without real
charges.
