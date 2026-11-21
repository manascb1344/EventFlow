# Contributing to EventFlow

Thanks for your interest in this project. This is a portfolio app, but the workflow is a real one, so contributions and issues are welcome.

## Ways to help

- Report a bug with a clear reproduction and the URL or page involved.
- Suggest an improvement to the README or the docs under `DOCS/`.
- Open a pull request for a small, focused fix.

## Development workflow

```bash
git clone https://github.com/manascb1344/EventFlow.git
cd EventFlow
pnpm install
cp .env.example .env
docker compose up -d
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Before opening a pull request, run:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

CI runs the same commands. Keep pull requests focused on one change and describe what you verified.

## Conventions

- Keep business logic in `lib/` and keep pages and actions thin.
- Validate external input at the boundary with Zod.
- Do not put secret values in code or docs. Use `.env.example` for names and placeholders.
- Generate migrations with `pnpm db:generate` and commit the SQL. Never generate migrations during the build.
- Write copy that describes what the product actually does. Avoid invented metrics and testimonials.

## Questions

Open an issue. If you are a student using this project to learn, say what you are trying to understand and I will point you to the relevant file.
