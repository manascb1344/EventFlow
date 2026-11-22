# Deployment

This is the current deployment guide for EventFlow. The pre-fix gap register that preceded this work is preserved at `archive/notes/DEPLOYMENT_REQUIREMENTS.md`.

## Topology

| Concern | Service |
| --- | --- |
| Application hosting | Vercel, custom domain `https://eventflow.zephop.com` |
| Database | Neon PostgreSQL |
| Payments | Stripe in test mode |
| Image uploads | UploadThing |
| Transactional email | SMTP |
| CI | GitHub Actions on every pull request and push to `main` |

Vercel preview deployments use a separate Neon branch. Production uses the main branch.

## Environment

Copy `.env.example` to `.env` for local work and fill in the values. Do not commit `.env`. The full set of keys is documented there, including `NEXTAUTH_SECRET` and `AUTH_SECRET`, which must match, and the optional Rabata keys used only by the seed script.

Set the same keys in the Vercel project for both Production and Preview. `DEMO_CHECKOUT=true` issues demo tickets without a Stripe payment. Keep it disabled whenever real charges are enabled.

## Local development

```bash
docker compose up -d        # Postgres on localhost:5435
pnpm install
pnpm db:setup
pnpm db:seed                # optional, needs the Rabata and Unsplash keys
pnpm dev
```

## Database migrations

Migrations live in `lib/db/migrations`. They are Drizzle generated files with snapshots and a journal. Apply them as an explicit release step with `pnpm deploy-migrate` after the build and before serving traffic. The build does not run migrations.

Migration `0002` adds the attendee preference columns. It has been applied to the Neon branch.

## External setup

- Google OAuth allows both the custom domain and the Vercel domain as redirect URIs.
- The Stripe webhook is registered for `/api/stripe/webhook` on the custom domain and uses `STRIPE_WEBHOOK_SECRET`.
- UploadThing needs `UPLOADTHING_TOKEN`. The profile image endpoint is `strictImageAttachment`.
- SMTP settings come from the `SMTP_*` variables. Email failures are logged and do not block a booking.

## Release

Every pull request runs `pnpm lint`, `pnpm typecheck` and `pnpm build` in GitHub Actions, and Vercel builds a preview. Merge with a guarded squash merge after checks and independent review pass. A push to `main` deploys to production. See the decision records in `DOCS/adr/` for the reasoning behind the topology and Stripe choices.

## Known limitation

Real Stripe payments remain blocked by account activation. Demo checkout is enabled so the full attendee flow can be exercised without a charge. The flow was last walked end to end on production on 22 November 2026; see [`user-guide.md`](user-guide.md) for the steps and screenshots.
