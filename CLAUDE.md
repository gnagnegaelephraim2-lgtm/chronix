# CLAUDE.md — Chronix Frontend

## What Chronix is

Chronix is a workforce attendance and management **web app** for Mauritian businesses (SMEs first: hospitality, construction, retail, factories, logistics). It is accessed at **chronix.com** — there is NO downloadable mobile app. The web app must therefore be fully mobile-responsive and work flawlessly in mobile browsers and iOS webviews.

It solves manual attendance fraud, payroll errors, and poor accountability. Core value proposition: no business owner in Mauritius should spend late nights auditing paper attendance sheets to calculate salaries.

## The one sentence that explains the architecture

Chronix is **one shared system with two views**: an **Admin side** (owners/HR/supervisors) and an **Employee side** (staff). Everything an employee does appears instantly on the admin side, and every admin decision appears instantly on the employee side.

## Read these docs before writing UI code

1. `docs/01-DESIGN-SYSTEM.md` — brand colors, typography, component patterns, layout rules. Follow it exactly; the visual identity is already locked in from approved UI designs.
2. `docs/02-SCREENS.md` — the complete per-screen specification (every page, every widget, every button) for the marketing site, login, Admin side, and Employee side.
3. `docs/03-DATA-AND-EVENTS.md` — the shared data model, the cross-side sync rules, and the event handling conventions.

## Hard rules

- **No inline `onclick` handlers.** Use a central event dispatcher with `data-action` attributes and event delegation (`addEventListener` on a root element). Inline handlers break in iOS webviews and this was already fixed once — do not regress it.
- **Mobile-first responsive.** Sidebar collapses on small screens; tables become scrollable or card-based; all tap targets ≥ 44px.
- **Two roles, one login page.** A Business/Employee toggle on the login screen decides which side you land on. Nothing else is asked.
- **Statuses are consistent everywhere:** `Pending` (amber), `In Review` (blue), `Approved` (green), `Rejected` (red), plus attendance statuses `On-time` (green), `Late` (amber), `Absent` (grey/red).
- **Language:** default English; French support is planned — keep all user-facing strings in one place (a strings/i18n object) so translation is trivial later.
- **Currency is MUR** (Mauritian Rupee) wherever money appears (reimbursements, payroll).
- Logo file: `assets/chronix_logo.png` — navy wordmark "Chroni" + amber "x", with an amber clock-face person icon inside the C.

## Tech context

- Current prototype: single-file interactive HTML (mobile-responsive) with connected workflows: clock in/out, leave requests, admin approvals, reimbursements.
- Planned backend: Rust (axum, sqlx, argon2, rust_decimal, tokio-cron-scheduler). Frontend should keep data access behind a thin API layer / mock-data module so it can swap from mock data to real endpoints without touching components.
- Payroll integration is **"Coming Soon"** — show it as a disabled/teaser card on Reports, never as a working feature.

## Screen inventory (details in docs/02-SCREENS.md)

| Area | Admin side | Employee side |
|---|---|---|
| Landing | chronix.com marketing page (shared) | same |
| Auth | Login with Business/Employee toggle (shared) | same |
| Home | Dashboard (team overview) | Home (own status + clock in/out) |
| Attendance | Attendance (full team table) | — (own record lives in History) |
| Leave | Leave Management (approve/reject) | Request (submit + track) |
| Expenses | Reimbursements (approve/reject) | Request (same form, type = expense) |
| Reports | Reports (4 reports + CSV export + payroll teaser) | History (own shifts) |
| Settings | Business-wide rules (10 sections) | Personal preferences (9 sections) |
