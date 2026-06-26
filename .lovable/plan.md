## What I'll restore from your zip

**Pages (18):** Index, HowItWorks, ClaimTypes, Pricing, SuccessStories, About, Contact, Auth, AdminAuth, ForgotPassword, ResetPassword, Dashboard, AdminDashboard, PrivacyPolicy, TermsOfService, Disclaimer, RefundPolicy, NotFound

**Components:** Navbar, Footer, NavLink, Hero/HowItWorks/ClaimTypes/WhyChooseUs/Testimonials/CTA sections

**Backend:** Supabase auth + database + 2 edge functions (send-claim-confirmation, send-contact-message) + 12 SQL migrations

## Approach — fastest fidelity port

Your original is **Vite + React Router DOM + Tailwind v3 + Supabase**. This project is **TanStack Start + Tailwind v4 + Lovable Cloud**. Two realistic options:

### Option A — Compatibility shim (recommended, ~fast)
- Install `react-router-dom` and keep your original `App.tsx` routing intact
- Mount the whole App inside a single TanStack splat route — no rewriting page-by-page
- Copy `src/pages/`, `src/components/`, `src/hooks/` **as-is** from the zip
- Rewrite `src/styles.css` to Tailwind v4 form (your `:root` HSL tokens → v4 `@theme inline`, fonts via `<link>` in `__root.tsx`)
- Enable Lovable Cloud, apply your 12 migrations, port the 2 edge functions
- Wire `src/integrations/supabase/client.ts` to the new Cloud credentials

Trade-off: no per-route SSR/SEO meta. Acts as a SPA inside the shell. Everything else (UI, auth, DB, edge functions) works identically to the original.

### Option B — Full TanStack rewrite
Convert every page to `src/routes/*.tsx`, replace every `<Link>`/`useNavigate` from react-router-dom with TanStack equivalents, add per-route `head()` metadata. Much more work, higher chance of regressions on the first pass, but gives proper SSR + SEO per page.

## My recommendation

Go with **Option A** first to get your full site back online today. Once verified working, we incrementally migrate hot pages (Index, ClaimTypes, Pricing, Contact) to native TanStack routes for SEO.

## Steps if you approve Option A

1. Enable Lovable Cloud
2. Copy pages, components, hooks, integrations, public assets from zip
3. Install `react-router-dom`, `@supabase/supabase-js`, `@hookform/resolvers`, `zod`, `react-hook-form` if missing
4. Rewrite `src/styles.css` with your Navy/Saffron/Green theme in v4 form
5. Replace `src/routes/index.tsx` + add `src/routes/$.tsx` splat that mounts your original `App.tsx`
6. Apply 12 SQL migrations to Cloud DB
7. Deploy 2 edge functions
8. Smoke test

**Which option — A or B?**
