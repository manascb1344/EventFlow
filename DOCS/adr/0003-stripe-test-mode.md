# 3. Stripe test mode only

Date: 2026-11-18

The deployed app uses Stripe test keys. Checkout and webhooks work with test cards, and no real
charges are taken.

The app is a resume project. Live payments would require business verification, refund handling,
and tax and compliance work that does not improve what a reviewer can evaluate.

Consequence: never put a live secret key in Vercel for this project. Document the test-card flow
for anyone demoing the app.
