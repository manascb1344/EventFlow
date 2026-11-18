# 4. Scope and autonomous product calls

Date: 2026-11-18

We keep all existing features and fix their gaps instead of trimming the app to an MVP.

Five smaller calls were made under the full-autonomy grant. Event browsing is public, saving and
checkout still require a session. SMTP keeps its current variable names, with Resend as the
documented provider. UploadThing is the only upload vendor. Deployment origins come from Vercel
environment variables. Stripe Connect payout columns stay for now because removing them needs a
schema migration and touches seeding.

Consequence: the public event listing is covered by the browser test, and the unused Rabata
variables are absent from the environment template.
