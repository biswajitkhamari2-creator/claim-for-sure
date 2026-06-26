# ClaimForSure Auth System

Integrates a complete user authentication and claim-submission flow on top of the current Navy/Gold landing page, legal pages, and existing admin panel — without removing anything that already works.

## What's already in place (reuse, do not rebuild)
- Landing page `/` (Navy/Gold) with logo, contact info, footer links.
- Legal pages: `/privacy`, `/terms`, `/refund`, `/disclaimer`.
- Admin panel: `/admin/login`, `/admin` (claims dashboard, status updates).
- Database: `profiles`, `claims`, `user_roles` (with `has_role` + admin role for `biswajitkhamari2@gmail.com`), `claim-documents` private storage bucket.

## New public auth routes
- `/auth/signup` — Full Name, Email, Mobile (10 digits), Password, Confirm Password, Privacy checkbox. Zod validation matching the spec (8+ chars, upper/lower/number/special). Submit button disabled until valid. Creates Supabase user with `emailRedirectTo` → `/auth/verified`, stores name + mobile in `profiles`, shows "Verification email sent" screen with **Resend** button + 60s countdown.
- `/auth/login` — Email + Password. On `Email not confirmed` error, shows inline notice with Resend Verification link. Links to `/auth/forgot` and `/auth/signup`.
- `/auth/forgot` — Email input, calls `resetPasswordForEmail` with redirect to `/auth/reset`.
- `/auth/reset` — New password + Confirm; calls `supabase.auth.updateUser({ password })`, then redirects to `/auth/login`.
- `/auth/verified` — Landing after email link; shows success then redirects to `/dashboard`.

Apple-inspired card UI on Navy/Gold theme, glassmorphism, smooth transitions, password visibility toggle, sonner toasts, mobile-first.

## Protected user area (under `_authenticated/`)
The integration-managed `src/routes/_authenticated/route.tsx` already redirects unauthenticated users to `/auth` — we will add a tiny shim route that forwards `/auth` to `/auth/login` so the gate keeps working.

- `/dashboard` — "Welcome, {name}", quick cards: Submit New Claim, My Claims, Documents, Profile, Logout.
- `/dashboard/profile` — Edit full name, mobile, optional avatar (uses `profiles` table; email read-only).
- `/dashboard/claims/new` — Claim submission form (matches existing `claims` schema: full_name, phone, email, city, state, insurance_type, insurance_company, policy_number, claim_amount, rejection_date, rejection_reason). Generates `claim_id` `CFS-{timestamp}`, sets `user_id = auth.uid()`.
- `/dashboard/claims` — List of user's own claims (RLS already restricts).
- `/dashboard/claims/$id` — Detail view + document upload to `claim-documents/{user_id}/{claim_id}/...` (private bucket, signed URLs).

## Landing page wiring
- Header: add **Login** / **Sign Up** buttons (keep "Call" CTA).
- Hero "Start Your Claim" CTA → `/auth/signup` (guests) or `/dashboard/claims/new` (signed-in).
- Footer: add Login / Sign Up links.
- No existing copy, contact info, or legal links removed.

## Database
Existing schema covers everything. One small migration:
- Add `avatar_url text` to `public.profiles` (optional photo).
- Ensure `handle_new_user` trigger inserts `full_name` and `phone` from `raw_user_meta_data` (already does name; add phone).

No new tables. RLS already scopes `claims` and `profiles` to `auth.uid()`; admin sees all via `has_role`.

## Auth configuration
- Email/password enabled, **auto-confirm OFF** (mandatory verification), HIBP password check ON, anonymous sign-ups OFF — applied via `configure_auth`.
- Default Lovable auth emails are used (no custom templates this round — can be added later if you want branded emails).

## Security
Supabase handles password hashing, session JWTs, secure cookies, prepared statements (via PostgREST), and email verification. We add: Zod validation client + server, RLS already enforces per-user data isolation, signed URLs for private documents, rate-limited resend (60s client cooldown), and the public-route rule that protected server fns are never called from public loaders.

## Out of scope this round
- Custom-branded auth email templates (default Lovable emails will send).
- Admin "deactivate user" UI (admin panel already lists claims; user management can be a follow-up).

## Technical notes
- New files under `src/routes/auth.*.tsx` and `src/routes/_authenticated/dashboard*.tsx`.
- Shared `AuthCard` component for the glass UI.
- Use `supabase` browser client for auth flows; `requireSupabaseAuth` server fn only if we need server-side claim insert (client insert is fine — RLS enforces `user_id = auth.uid()`).
- `/auth` index route redirects to `/auth/login` so the managed gate's redirect target resolves.
