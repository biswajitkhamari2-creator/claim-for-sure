import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Car, Shield, Plane, Home, UserCheck, Phone, ExternalLink, MessageCircle, Lock, BadgeCheck, ArrowRight, Gift, Headphones, FileSearch, Percent, Clock, Sparkles, Wallet, IndianRupee } from "lucide-react";
import logoAsset from "@/assets/claim-for-sure-logo.png.asset.json";

export const Route = createFileRoute("/policies")({
  head: () => ({
    meta: [
      { title: "Buy Insurance — Claim For Sure (POSP, RenewBuy)" },
      { name: "description", content: "Buy Health, Motor, Term Life, Personal Accident, Travel and Home insurance through Claim For Sure — a licensed POSP partner of RenewBuy. IRDAI-compliant. No premium rebates." },
      { property: "og:title", content: "Buy Insurance — Claim For Sure" },
      { property: "og:description", content: "Licensed POSP partner of RenewBuy. Buy policies across all major categories with end-to-end support." },
    ],
  }),
  component: PoliciesPage,
});

const POSP_CODE = "EI00349540";
const PRINCIPAL = "RenewBuy (D2C Insurance Broking Pvt. Ltd.)";
const WA = "919439572073";

type Category = {
  slug: string;
  icon: typeof Heart;
  title: string;
  tagline: string;
  bullets: string[];
  portal: string;
};

const CATEGORIES: Category[] = [
  {
    slug: "health",
    icon: Heart,
    title: "Health Insurance",
    tagline: "Cashless hospitalisation, day-care & critical illness cover.",
    bullets: ["Cashless at 10,000+ hospitals", "Individual & family floater", "Pre/post hospitalisation"],
    portal: "https://www.renewbuy.com/health-insurance/",
  },
  {
    slug: "motor",
    icon: Car,
    title: "Motor Insurance",
    tagline: "Car, bike & commercial vehicle — comprehensive or third-party.",
    bullets: ["Zero-dep & engine protect", "Instant policy issuance", "Cashless garage network"],
    portal: "https://www.renewbuy.com/car-insurance/",
  },
  {
    slug: "term-life",
    icon: Shield,
    title: "Term Life Insurance",
    tagline: "High-cover pure protection for your family's future.",
    bullets: ["Cover up to ₹2 Cr+", "Tax benefit u/s 80C", "Riders: CI, AD, WoP"],
    portal: "https://www.renewbuy.com/term-insurance/",
  },
  {
    slug: "personal-accident",
    icon: UserCheck,
    title: "Personal Accident",
    tagline: "Lump-sum payout for accidental death, disability & injury.",
    bullets: ["24x7 worldwide cover", "Weekly compensation", "Affordable premiums"],
    portal: "https://www.renewbuy.com/personal-accident-insurance/",
  },
  {
    slug: "travel",
    icon: Plane,
    title: "Travel Insurance",
    tagline: "Domestic & international trips, students, and senior citizens.",
    bullets: ["Medical emergencies abroad", "Baggage & flight delay", "Visa-compliant cover"],
    portal: "https://www.renewbuy.com/travel-insurance/",
  },
  {
    slug: "home",
    icon: Home,
    title: "Home Insurance",
    tagline: "Structure and contents cover against fire, theft & natural perils.",
    bullets: ["Building + contents", "Burglary & theft", "Natural calamities"],
    portal: "https://www.renewbuy.com/home-insurance/",
  },
];

function waLink(category: string) {
  const msg = encodeURIComponent(`Hi Claim For Sure team, I'd like a quote for ${category} insurance. (Ref: POSP ${POSP_CODE})`);
  return `https://wa.me/${WA}?text=${msg}`;
}

function PoliciesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <ComplianceBar />
        <Catalog />
        <RebatingNotice />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoAsset.url} alt="Claim For Sure" className="h-10 w-10 rounded-md object-cover" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-bold tracking-tight text-primary">Claim For Sure</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">by Sidheswar Enterprises</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/policies" className="font-semibold text-foreground">Buy Insurance</Link>
          <a href="/#services" className="hover:text-foreground">Claim Help</a>
        </nav>
        <a href="tel:+919439572073" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Phone className="h-4 w-4" /> Call
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28 text-primary-foreground">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur">
          <BadgeCheck className="h-3.5 w-3.5" /> Licensed POSP · IRDAI compliant
        </span>
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.1] md:text-5xl">
          Buy the right insurance — backed by people who also <em className="text-[oklch(0.85_0.13_80)]">fight your claim.</em>
        </h1>
        <p className="mt-5 max-w-2xl text-white/80 md:text-lg">
          We're a licensed POSP partner of <strong>RenewBuy</strong>. Compare and buy Health, Motor, Term Life, Travel and more — and if a claim ever gets rejected, our specialist team is already on your side.
        </p>
        <div className="mt-4 text-xs text-white/70">
          POSP Code: <span className="font-mono text-white">{POSP_CODE}</span> · Principal: {PRINCIPAL}
        </div>
      </div>
    </section>
  );
}

function ComplianceBar() {
  return (
    <section className="border-b border-border bg-secondary">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Premium paid directly to insurer</span>
        <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5" /> Issued by IRDAI-licensed insurers</span>
        <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Free claim assistance lifetime</span>
      </div>
    </section>
  );
}

function Catalog() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-glow">Policy categories</p>
        <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">All major insurance — one trusted advisor.</h2>
        <p className="mt-4 text-muted-foreground">Tap a category to get a quote on RenewBuy with our POSP code attached, or message us on WhatsApp for guided issuance.</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <CategoryCard key={c.slug} c={c} />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ c }: { c: Category }) {
  const Icon = c.icon;
  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/40" style={{ boxShadow: "var(--shadow-soft)" }}>
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-display text-lg font-bold">{c.title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{c.tagline}</p>
      <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        {c.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> {b}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col gap-2 pt-4 border-t border-border">
        <a
          href={c.portal}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Buy online <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <a
          href={waLink(c.title)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted"
        >
          <MessageCircle className="h-4 w-4 text-emerald-600" /> WhatsApp for quote
        </a>
      </div>
    </div>
  );
}

function RebatingNotice() {
  return (
    <section className="border-y border-border bg-secondary">
      <div className="mx-auto max-w-4xl px-6 py-10 text-sm leading-relaxed text-muted-foreground">
        <h3 className="font-display text-lg font-bold text-foreground">Important regulatory notice</h3>
        <p className="mt-3">
          As per <strong>Section 41 of the Insurance Act, 1938</strong>, no person shall offer or accept any rebate of the
          premium or commission as an inducement to buy or renew an insurance policy. Claim For Sure / Sidheswar Enterprises
          does <strong>not</strong> offer any cash discount, cashback, or premium rebate on policies sold under POSP code{" "}
          <span className="font-mono text-foreground">{POSP_CODE}</span> (Principal: {PRINCIPAL}). Premiums shown are those
          filed by the insurer with IRDAI.
        </p>
        <p className="mt-3">
          Our value is in <strong>advice, paperwork, and claim assistance</strong> — services included free for every policy
          purchased through us.
        </p>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center text-primary-foreground">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Not sure which policy you need?</h2>
        <p className="mt-4 text-white/80">Talk to a licensed advisor. No obligation, no spam.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="tel:+919439572073" className="inline-flex items-center gap-2 rounded-md bg-[oklch(0.78_0.14_78)] px-6 py-3 text-sm font-semibold text-[oklch(0.2_0.05_265)] shadow-lg hover:scale-[1.02]">
            <Phone className="h-4 w-4" /> Call +91 94395 72073
          </a>
          <a href={waLink("a policy recommendation")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/25 px-6 py-3 text-sm font-medium text-white hover:bg-white/10">
            <MessageCircle className="h-4 w-4" /> WhatsApp us
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-10 text-xs text-muted-foreground">
        <p>
          Claim For Sure is a brand of Sidheswar Enterprises. Insurance is solicited as a POSP (Point of Sale Person) under
          principal <strong className="text-foreground">{PRINCIPAL}</strong>, POSP code{" "}
          <span className="font-mono text-foreground">{POSP_CODE}</span>. Insurance is the subject matter of solicitation.
          Visit IRDAI website <a className="underline" href="https://www.irdai.gov.in" target="_blank" rel="noopener noreferrer">irdai.gov.in</a> for grievance redressal.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/disclaimer" className="hover:text-foreground">Disclaimer</Link>
          <Link to="/refund" className="hover:text-foreground">Refund</Link>
        </div>
      </div>
    </footer>
  );
}
