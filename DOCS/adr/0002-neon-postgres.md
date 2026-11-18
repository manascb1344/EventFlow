# 2. Neon for PostgreSQL

Date: 2026-11-18

Production uses Neon. Preview deployments get their own database branches.

Neon gives a pooled connection string and database branching, which fits Vercel previews. The
app uses Drizzle and PostgreSQL, so no ORM migration is needed.

Consequence: `POSTGRES_URL` must use the pooled endpoint, and migrations run as a release step
rather than during the build.
