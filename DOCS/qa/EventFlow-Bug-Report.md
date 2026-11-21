# EventFlow — Bug Report

- **Site:** https://eventflow.zephop.com/
- **Tested:** 21 Nov 2026, production, Chromium desktop + 390×844 mobile emulation
- **Test accounts used:**
  - Attendee: `eventflow.qa.20261121@example.com`
  - Organizer: `eventflow.qa.organizer.20261121@example.com`
- **Test data present on site:** two events named "Demo Tech Meetup" at `/events/1` and `/events/2` (₹25.00, Demo Hall, 1 Dec 2026).
- **Screenshots:** filenames below refer to the `screenshots/` folder delivered with this report.
- **Scope note:** This document describes defects and how to reproduce them only.

## Summary

| ID | Severity | Area | Title |
|---|---|---|---|
| EF-01 | High | Organizer | "Create Event" redirects to the homepage; event creation form unreachable |
| EF-02 | High | Events catalog | Search, location and date filters have no effect on results |
| EF-03 | High | Settings / Security | Two-Factor Authentication toggle turns on with no enrollment and resets on reload |
| EF-04 | Medium | Settings | Attendee and organizer preference toggles do not persist |
| EF-05 | Medium | Profile | Phone field accepts and saves non-phone text |
| EF-06 | Medium | Images | Event/ticket placeholder image is missing (404) → broken images, image optimizer 400 |
| EF-07 | Medium | Organizer analytics | "Average Revenue per Event" shows ₹NaN with zero events |
| EF-08 | Medium | Mobile layout | Organizer Analytics header/tabs overflow at 390px |
| EF-09 | Low | Mobile navigation | Navigation drawer stays open after choosing a link |
| EF-10 | Medium | Mobile navigation | Attendee mobile menus have no Settings entry |
| EF-11 | Medium | Accessibility | Mobile menu button and drawer dialog have no accessible name; DialogTitle console error |
| EF-12 | Low | Contact page | "Preview message" button does nothing |
| EF-13 | Medium | Auth | Public "Sign In" rejects valid organizer credentials with "Invalid email or password" |
| EF-14 | Medium | Booking | Organizer can book a ticket, but "View My Tickets" goes to organizer overview and ticket can't be found |
| EF-15 | Low | Forms | Password inputs missing `autocomplete` attributes |
| EF-16 | Low | Routing | `/onboarding?_rsc=…` request returns 404 during onboarding |
| EF-17 | Needs confirmation | Profile | Profile image upload control appeared disabled |

---

## EF-01 — "Create Event" redirects to the homepage

- **Severity:** High. Organizers cannot create events, so publishing, editing, deleting and managing events are all blocked.
- **Where:** `https://eventflow.zephop.com/dashboard/organizer`. The link target is `/dashboard/organizer/events/create`.
- **Steps to reproduce:**
  1. Go to `https://eventflow.zephop.com/auth/organizer/signup` and create a new organizer account.
  2. Complete onboarding. You land on the organizer dashboard (`/dashboard/organizer`).
  3. Click **Create Event** in the top header.
  4. Go back to the dashboard and click **Create New Event** in the dashboard body or the My Events empty state.
- **Expected:** The event creation form at `/dashboard/organizer/events/create` opens.
- **Actual:**
  - Every entry point lands on `https://eventflow.zephop.com/` and shows the landing-page hero.
  - The header still shows the organizer as signed in.
  - No error message appears, and the creation form never loads.
  - Reproduced several times, including after signing out and back in.
- **Additional observation:**
  - With no session, `GET /dashboard/organizer/events/create` returns `307` to `/auth/attendee/signin?callbackUrl=%2Fdashboard%2Forganizer%2Fevents%2Fcreate`. This is the attendee sign-in, not the organizer one.
  - With a valid organizer session, the browser ends up at `/`.
- **Screenshots:** `ss_c527ad4f.png`, `ss_6785218c.png`

## EF-02 — Search, location and date filters do not filter results

- **Severity:** High. Event discovery does not work.
- **Where:** `https://eventflow.zephop.com/events`
- **Steps to reproduce (search):**
  1. Open `/events`.
  2. Type a term that matches nothing (e.g. `zzzz-no-match`) in the search box.
  3. Click **Apply Filters**.
- **Steps to reproduce (location + date):**
  1. Open `/events`.
  2. Enter `No such city QA` as the location.
  3. Pick **November 22nd, 2026** in the date picker.
  4. Click **Apply Filters**.
- **Expected:** Only matching events show, or an empty "no events found" state.
- **Actual:** Both "Demo Tech Meetup" cards (Demo Hall, December 1, 2026) stay visible in both cases. The result list never changes.
- **Screenshots:** `ss_ac553fb1.png` (search), `ss_b6dc52a2.png` (location/date)

## EF-03 — Two-Factor Authentication toggle is non-functional

- **Severity:** High. The security control is misleading: users believe 2FA is on when it is not.
- **Where:** `https://eventflow.zephop.com/dashboard/attendee/settings`
- **Steps to reproduce:**
  1. Sign in as an attendee and open Settings.
  2. Turn on **Two-Factor Authentication**.
  3. Note that no QR code, code entry or confirmation appears, and the switch shows as on.
  4. Reload the page.
- **Expected:** An enrollment and verification flow runs before 2FA is enabled, and the enabled state survives a reload. If 2FA is not supported, the control is shown as unavailable.
- **Actual:** The switch flips to on instantly with no enrollment. After reload it is off again. No second factor is configured or asked for at sign-in.
- **Screenshots:** `ss_e63f3840.png` (on), `ss_2999357f.png` (off after reload)

## EF-04 — Preference toggles do not persist (attendee and organizer)

- **Severity:** Medium
- **Where:** `/dashboard/attendee/settings`, `/dashboard/organizer/settings`
- **Steps to reproduce (attendee):**
  1. Open attendee Settings.
  2. Turn **Email Notifications** off.
  3. Turn **Marketing Emails**, **Public Profile** and **Show Event Attendance** on.
  4. There is no Save button. Reload the page.
- **Steps to reproduce (organizer):**
  1. Open organizer Settings.
  2. Toggle the notification preference.
  3. Reload the page.
- **Expected:** Changes persist, or a Save action exists and the UI shows unsaved state.
- **Actual:**
  - All four attendee toggles return to their defaults: Email on; Marketing, Public Profile and Attendance off.
  - The organizer notification toggle also resets.
  - No error or "unsaved" indicator is shown.
  - For comparison, organizer profile name edits do persist.
- **Screenshots:** `ss_2087bf24.png` → `ss_3b919230.png` (attendee), `ss_aa8b1eef.png` → `ss_cfdc26ae.png` (organizer)

## EF-05 — Phone field accepts invalid values

- **Severity:** Medium
- **Where:** `https://eventflow.zephop.com/dashboard/attendee/profile`
- **Steps to reproduce:**
  1. Open Profile.
  2. Enter `not-a-phone` in the phone field.
  3. Click Save.
  4. Reload the page.
- **Expected:** A validation error appears and the value is not saved.
- **Actual:** Save succeeds and `not-a-phone` is still shown after reload.
- **Screenshot:** `ss_3b8382c8.png`

## EF-06 — Event/ticket placeholder image missing; broken images

- **Severity:** Medium
- **Where:** `/dashboard/attendee/my-tickets` (ticket card and ticket details modal), `/events` (event cards), `/events/[id]`
- **Steps to reproduce:**
  1. As an attendee, register for "Demo Tech Meetup" (demo registration).
  2. Open **My Tickets** and look at the ticket card.
  3. Open the ticket details.
  4. Also open `/events` and look at the card image area.
- **Expected:** An event image, or a deliberate styled fallback.
- **Actual:**
  - The ticket card and details modal show the browser's broken-image icon with alt text.
  - Event cards show empty image blocks.
- **Network evidence (reproducible now with curl):**
  - `GET https://eventflow.zephop.com/placeholder-event.jpg` → **404**
  - `GET https://eventflow.zephop.com/_next/image?url=%2Fplaceholder-event.jpg&w=640&q=75` → **400** `INVALID_IMAGE_OPTIMIZE_REQUEST`. The same happens for `w=384` and `w=3840`.
- **Intermittent, related:** During the session, `/_next/image` requests for `/images/dashboard.png`, `/images/events.png`, `/images/tickets.png` and `/images/event-detail.png` (homepage product previews) also returned 400 about 20 times. They returned 200 when re-checked later, and the homepage did eventually render them.
- **Screenshots:** `ss_e01cf2ad.png` (ticket modal), `ss_c34fe398.png` (mobile ticket card), `ss_b6dc52a2.png` (blank catalog images)

## EF-07 — Revenue analytics shows ₹NaN

- **Severity:** Medium
- **Where:** `https://eventflow.zephop.com/dashboard/organizer/analytics`, Revenue tab
- **Steps to reproduce:**
  1. Sign in as a new organizer with zero events.
  2. Open Analytics.
  3. Click the **Revenue** tab.
- **Expected:** "Average Revenue per Event" shows ₹0.00 or an empty/"—" state.
- **Actual:** It shows **₹NaN**, while Total Revenue shows ₹0.00.
- **Screenshot:** `ss_fc19cd98.png`

## EF-08 — Organizer Analytics overflows on mobile

- **Severity:** Medium
- **Where:** `/dashboard/organizer/analytics` at 390px width
- **Steps to reproduce:**
  1. Set the viewport to 390×844 (or use a phone).
  2. Sign in as an organizer.
  3. Open Analytics.
- **Expected:** The heading, **Generate Report** button and all tabs fit, wrap or scroll in a usable way.
- **Actual:**
  - Generate Report runs past the right edge of the screen.
  - The last analytics tab label is cut off.
  - The title/description and the button do not reflow.
- **Screenshot:** `ss_06fe9bf8.png`

## EF-09 — Mobile navigation drawer stays open after navigating

- **Severity:** Low
- **Where:** Organizer and attendee dashboards at mobile width
- **Steps to reproduce:**
  1. At 390px width, open the hamburger menu.
  2. Tap Dashboard, My Tickets or any other link.
- **Expected:** The drawer closes and the new page is visible.
- **Actual:** The URL and the page behind change, but the drawer stays open over the content. The user must tap Close.
- **Screenshot:** `ss_55a4af74.png`

## EF-10 — No Settings link in attendee mobile navigation

- **Severity:** Medium
- **Where:** `/dashboard/attendee` at mobile width
- **Steps to reproduce:**
  1. At 390px width, sign in as an attendee.
  2. Open the hamburger drawer.
  3. Open the account/avatar menu.
- **Expected:** Settings can be reached from mobile navigation, as it is from the desktop sidebar.
- **Actual:**
  - The drawer contains only Browse Events, My Tickets, Saved Events and Profile.
  - The account menu contains only Dashboard and Sign Out.
  - Settings can only be reached by typing the URL.
- **Screenshots:** `ss_bd82c602.png` (drawer), `ss_033255b0.png` (account menu)

## EF-11 — Mobile menu accessibility issues

- **Severity:** Medium
- **Where:** `/dashboard/attendee`, `/dashboard/organizer` at mobile width
- **Steps to reproduce:**
  1. At 390px width, inspect the hamburger button in DevTools → Accessibility.
  2. Open the drawer and check the dialog's accessible name.
  3. Check the browser console.
- **Expected:** The button has a label (e.g. "Open navigation") and the dialog has an accessible title.
- **Actual:**
  - The button has no accessible name, and the dialog has no accessible name.
  - The console logs a Radix error: "`DialogContent` requires a `DialogTitle` for the component to be accessible for screen reader users." It also logs a missing `Description`/`aria-describedby` warning.
  - Both appear every time a drawer opens (4 errors and 5 warnings captured).
- **Screenshot:** `ss_bd82c602.png`

## EF-12 — Contact "Preview message" does nothing

- **Severity:** Low
- **Where:** `https://eventflow.zephop.com/contact`
- **Steps to reproduce:**
  1. Fill in Email, Subject and Message with valid values.
  2. Click **Preview message**.
- **Expected:** A preview of the message appears, or some visible feedback.
- **Actual:** Nothing happens. There is no preview, toast or error, and the form stays filled.
- **Note:** The page says the form is a UI example and does not send email. Not sending email is not the bug; the inactive Preview button is.
- **Screenshots:** `ss_9104c59a.png`

## EF-13 — Public "Sign In" rejects organizer credentials without explanation

- **Severity:** Medium
- **Where:** The header's **Sign In** link, which goes to `https://eventflow.zephop.com/auth/attendee/signin`
- **Steps to reproduce:**
  1. Create and onboard an organizer account, then sign out.
  2. Click **Sign In** in the public header.
  3. Enter the organizer's email and password.
- **Expected:** One of the following:
  - Organizer credentials work here.
  - The user chooses a role first.
  - The page is clearly labeled attendee-only and links to organizer sign-in.
- **Actual:**
  - The page is titled just "Sign In" and shows **"Invalid email or password"**. `POST /api/auth/callback/credentials` returns 401.
  - The same credentials work at `/auth/organizer/signin`, which is only reachable through the link on the organizer signup page.
- **Related:** Protected organizer routes (e.g. `/dashboard/organizer`) redirect signed-out users to `/auth/attendee/signin?callbackUrl=%2Fdashboard%2Forganizer`, which organizers cannot use.
- **Screenshot:** `ss_9958aae5.png`

## EF-14 — Organizer booking confirmed but ticket not retrievable

- **Severity:** Medium
- **Where:** `https://eventflow.zephop.com/events/2`, then `/events/2/success?session_id=…&demo=1`
- **Steps to reproduce:**
  1. Sign in as an organizer.
  2. Open `/events/2` and complete the demo registration.
  3. On the success page ("ticket confirmed, no payment taken"), click **View My Tickets**.
- **Expected:** Either organizers are blocked from booking, or the booked ticket can be viewed.
- **Actual:**
  - The booking is confirmed, but View My Tickets goes to the organizer overview (`/dashboard/organizer`).
  - The organizer has no tickets view, so the ticket cannot be found.
  - The attendee account was not affected: it still showed only its own ticket.
- **Screenshot:** `ss_e10d8542.png`

## EF-15 — Password inputs missing autocomplete attributes

- **Severity:** Low
- **Where:** `/auth/attendee/signup`, `/auth/organizer/signup` and the sign-in pages
- **Steps to reproduce:** Open a signup page and check the console with verbose logs enabled.
- **Actual:**
  - Chrome reports: `[DOM] Input elements should have autocomplete attributes (suggested: "new-password")` (14 occurrences).
  - Password managers may not offer to generate or save passwords.

## EF-16 — 404 on onboarding RSC request

- **Severity:** Low
- **Where:** During signup/onboarding
- **Steps to reproduce:** Sign up as a new user with the Network tab open.
- **Actual:**
  - `GET /onboarding?_rsc=…` returns **404**.
  - Onboarding still completed and the user reached the dashboard, so this is not blocking.

## EF-17 — Profile image upload appeared disabled (needs confirmation)

- **Severity:** To be confirmed
- **Where:** `/dashboard/attendee/profile`
- **Observation:** During exploration, the profile picture upload control looked disabled or non-interactive. This was not fully documented with a screenshot. Re-check that an avatar can be uploaded and saved.

---

## Areas that could not be tested

- **Event lifecycle:** Event create, edit, delete, publish, image upload, capacity/price validation, attendee lists and check-in. All are blocked by EF-01.
- **Payments:** Real Stripe checkout, card declines, webhooks and refunds. Only "demo / no payment" registration was available.
- **Email:** Verification, receipts and reminders (no inbox for the test accounts).
- **Third-party login and other environments:** Google sign-in, Safari/Firefox, and physical mobile devices.

## What worked (for regression reference)

- Landing page, Features, Pricing, About, Docs, Changelog and Contact pages render.
- Signup validation works: empty fields and password mismatch are rejected.
- Attendee and organizer signup, onboarding and role-specific login/logout work.
- Invalid credentials show an error.
- Profile text edits persist.
- Saving an event and viewing Saved Events works.
- Attendee demo registration works: seats drop 10 → 9, and the ticket appears in My Tickets and opens.
- Analytics tabs open, and Generate Report downloads a PDF on desktop.
- No HTTP 5xx responses or uncaught JS exceptions were seen.
