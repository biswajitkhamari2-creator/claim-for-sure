import { createFileRoute, Link } from "@tanstack/react-router";
import { Gift, Sparkles, ShieldCheck, ArrowRight, Phone } from "lucide-react";
import logoAsset from "@/assets/claim-for-sure-logo.png.asset.json";

export const Route = createFileRoute("/appreciation")({
  head: () => ({
    meta: [
      { title: "Customer Appreciation Program — Claim For Sure" },
      { name: "description", content: "A discretionary gratitude program for valued Claim For Sure customers. Eligibility, selection and availability are at our sole discretion and subject to Terms & Conditions." },
      { property: "og:title", content: "Customer Appreciation Program — Claim For Sure" },
      { property: "og:description", content: "A discretionary token of gratitude for valued customers. Not an inducement to buy insurance." },
    ],
  }),
  component: AppreciationPage,
});

function AppreciationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logoAsset.url} alt="Claim For Sure" className="h-10 w-10 rounded-md object-cover" />
            <span className="font-display text-lg font-bold tracking-tight text-primary">Claim For Sure</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Home</Link>
        </div>
      </header>

      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, oklch(0.2 0.05 265) 0%, oklch(0.32 0.06 265) 60%, oklch(0.95 0.02 80) 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.82_0.14_80)]/40 bg-[oklch(0.82_0.14_80)]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[oklch(0.92_0.1_80)]">
            <Sparkles className="h-3.5 w-3.5" /> Surprise Gift · By Invitation
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight md:text-5xl">
            Customer Appreciation Program
          </h1>
          <p className="mt-5 text-white/80 md:text-lg">
            A small token of gratitude for the customers who trust us with their claims and policies.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-3xl space-y-12 px-6 py-16">
        <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h2 className="font-display text-2xl font-semibold">What this program is</h2>
          <p className="mt-3 text-muted-foreground">
            From time to time, eligible customers may receive an exclusive appreciation gift or surprise reward as a token of
            gratitude for choosing Claim For Sure. It is our way of saying thank you — not a promise, not an offer, and never
            tied to the purchase of any insurance product.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h2 className="font-display text-2xl font-semibold">What this program is not</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Not a cashback, refund, or rebate on insurance premium.</li>
            <li>• Not a discount that influences your choice of policy.</li>
            <li>• Not a guaranteed benefit attached to any product we sell or recommend.</li>
            <li>• Not a rebate under Section 41 of the Insurance Act, 1938 — accepting or offering premium rebates is illegal in India.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h2 className="font-display text-2xl font-semibold">Who may be considered</h2>
          <p className="mt-3 text-muted-foreground">
            Existing customers in good standing — meaning your KYC is complete, your account is active, there are no open fraud
            flags, and you have engaged with our services genuinely. Selection is at the sole discretion of Claim For Sure and
            no customer has a right to demand a gift.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h2 className="font-display text-2xl font-semibold">How selection works</h2>
          <p className="mt-3 text-muted-foreground">
            Our team periodically reviews customer accounts and may invite a small number of customers to receive an appreciation
            gift. If selected, you will see the status update in your dashboard. No application is required, and there is no
            waiting list or queue.
          </p>
        </section>

        <section className="rounded-2xl border border-[oklch(0.82_0.14_80)]/40 bg-[oklch(0.98_0.02_80)] p-8">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-[oklch(0.5_0.15_70)]" />
            <div>
              <h3 className="font-semibold text-[oklch(0.3_0.1_70)]">Disclaimer</h3>
              <p className="mt-2 text-sm leading-relaxed text-[oklch(0.35_0.08_70)]">
                Any appreciation gift is entirely discretionary, subject to eligibility, availability, applicable laws, and our
                Terms &amp; Conditions. It is not guaranteed with the purchase of any insurance product. Claim For Sure reserves
                the right to modify, suspend, or withdraw this program at any time without prior notice.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-wrap justify-center gap-3">
          <Link to="/dashboard/rewards" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90">
            <Gift className="h-4 w-4" /> Sign in to view your status <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="tel:+919439572073" className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-muted">
            <Phone className="h-4 w-4" /> Talk to support
          </a>
        </section>

        <p className="text-center text-xs text-muted-foreground">
          Read our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </main>
    </div>
  );
}
