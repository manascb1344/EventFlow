# 1. Single Next.js application on Vercel

Date: 2026-11-18

We keep the App Router pages, server actions, and route handlers in one application deployed to
Vercel.

The code already mixes server components, server actions, and API handlers. Splitting a backend
would mean rewriting every data call and would add a service to operate without changing what
users see. A single deployment keeps the change set small and the demo easy to run.

Consequence: all server code runs in Vercel functions, so database access must use a pooled
connection and webhook work must stay short.
