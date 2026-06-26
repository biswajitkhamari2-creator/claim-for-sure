# Customer Appreciation Program

A discretionary, post-purchase gratitude program — never an inducement to buy insurance. Reuses the existing `rewards` / `rewards_config` / `rewards_audit_log` tables and extends them so the same backend powers both flows.

## 1. Homepage section (`src/routes/index.tsx`)

New `<AppreciationSection />` inserted between testimonials and the final CTA.

- Apple-inspired layout: large heading, generous whitespace, soft navy → cream gradient with grain texture
- Animated SVG gift box (lid lifts on scroll-in, ribbon shimmer) — pure CSS keyframes
- Glassmorphism card holding the program description
- "Surprise Gift" gold pill badge + `Gift` / `Sparkles` icon
- Primary copy = exact paragraph from the brief
- `Learn More` → `/appreciation`; secondary `View My Status` → `/dashboard/rewards`
- Fine-print disclaimer block at the bottom, verbatim from the brief
- Motion: fade-up on scroll + gift-box hover tilt

Copy explicitly frames gifts as post-relationship gratitude, discretionary, T&C-bound — never as a purchase incentive.

## 2. New info page `/appreciation`

`src/routes/appreciation.tsx`:
- What the program is (and isn't)
- Who may be considered (existing customers in good standing)
- Selection at sole discretion of ClaimForSure
- What is NOT promised (no guarantee, no cashback, no premium rebate — Section 41 compliance)
- Full T&Cs + disclaimer
- CTA: "Sign in to view your status"

## 3. Admin controls

Extend `/admin/rewards` with an **Appreciation Program** tab:
- Master toggle: enable / disable homepage section + dashboard widget
- Per-customer entry fields:
  - Eligibility status (`not_eligible` | `under_review` | `approved` | `shipped` | `delivered`)
  - Gift type (free-text, e.g. "Diwali hamper", "Branded mug")
  - Gift value (₹)
  - Shipping status + courier + AWB
  - Admin remarks (internal)
- "Select customer" picker to create an entry for any existing user
- Every change logged to `rewards_audit_log`

## 4. Customer dashboard

Extend `/dashboard/rewards` with an **Appreciation Status** card above existing rewards UI:
- Status badge: Not Eligible / Under Review / Approved / Shipped / Delivered
- Shipped → courier + AWB
- Delivered → delivery date + thank-you message
- Disclaimer footer verbatim from brief
- Hidden entirely when admin master toggle is OFF

## 5. Database

One migration to extend `rewards`:
- Add `program_type` (`'request' | 'appreciation'`, default `'request'`)
- Add `gift_type`, `gift_value_inr`, `shipping_status`, `courier`, `awb`, `delivered_at`, `admin_remarks`
- Add `appreciation_enabled` bool to `rewards_config`
- RLS: existing user-owns-row + admin policies cover the new flow — no new policy surface

No new tables. No anon read.

## 6. Visual tokens

New entries in `src/styles.css`:
```text
--gradient-appreciation: navy → cream
--shadow-glass: layered low-opacity navy
```

## 7. Compliance guardrails

- No mention of gifts on any policy-buy CTA, hero, or `/policies` page
- Disclaimer present on homepage section, dedicated page, AND dashboard widget
- Section ships **disabled** by default so legal can review before going live

## Out of scope (ask if needed)

- Real shipping API integration (manual AWB only)
- Automated eligibility scoring
- Email notifications on status change
