import { createFileRoute } from "@tanstack/react-router";
import { Shield, CheckCircle2, Lock, Scale, Phone, FileCheck, Clock, Award, ArrowRight, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClaimForSure — Trusted Insurance Claim Assistance" },
      { name: "description", content: "Expert-led insurance claim assistance. We help policyholders file, track, and win health, motor, life, and property claims — transparent fees, end-to-end support, and proven results." },
      { property: "og:title", content: "ClaimForSure — Trusted Insurance Claim Assistance" },
      { property: "og:description", content: "Expert claim help with transparent fees and end-to-end support." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <Process />
        <WhyTrust />
        <Testimonials />
        <FAQ />
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
        <a href="#" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" strokeWidth={2.2} />
          <span className="font-display text-lg font-bold tracking-tight text-primary">ClaimForSure</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#services" className="hover:text-foreground">Services</a>
          <a href="#process" className="hover:text-foreground">How it works</a>
          <a href="#trust" className="hover:text-foreground">Why us</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <a href="tel:+919438463174" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">
          <Phone className="h-4 w-4" /> Call +91 94384 63174
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1.15fr_1fr] md:py-32">
        <div className="text-primary-foreground">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur">
            <Lock className="h-3.5 w-3.5" /> Licensed claims advisors
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] md:text-6xl">
            Your insurance claim, <em className="text-[oklch(0.85_0.13_80)]">handled with certainty.</em>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            ClaimForSure stands between you and the paperwork. Our advisors prepare, file, and follow up on your claim — so you get a fair settlement without the runaround.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="tel:+919438463174" className="inline-flex items-center gap-2 rounded-md bg-[oklch(0.78_0.14_78)] px-6 py-3 text-sm font-semibold text-[oklch(0.2_0.05_265)] shadow-lg transition hover:scale-[1.02]">
              <Phone className="h-4 w-4" /> Call +91 94384 63174
            </a>
            <a href="#process" className="inline-flex items-center gap-2 rounded-md border border-white/25 px-6 py-3 text-sm font-medium text-white hover:bg-white/10">
              See how it works
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/75">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[oklch(0.82_0.14_80)]" /> No win, no fee</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[oklch(0.82_0.14_80)]" /> 256-bit encrypted intake</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[oklch(0.82_0.14_80)]" /> IRDAI-aligned process</span>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-2xl ring-1 ring-white/10">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Free claim review</p>
              <p className="font-display text-lg font-bold text-foreground">Tell us about your claim</p>
            </div>
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <form className="mt-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Field label="Full name" placeholder="Jane Doe" />
            <Field label="Phone number" placeholder="+91 98xxxxxxxx" type="tel" />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Type of claim</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30">
                <option>Health insurance</option>
                <option>Motor insurance</option>
                <option>Life insurance</option>
                <option>Property / home</option>
                <option>Travel</option>
              </select>
            </div>
            <button className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              Request a callback
            </button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" /> Your data is encrypted and never sold.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <input type={type} placeholder={placeholder} className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30" />
    </div>
  );
}

function TrustBar() {
  const stats = [
    { value: "12,400+", label: "Claims resolved" },
    { value: "₹84 Cr", label: "Recovered for clients" },
    { value: "96%", label: "Success rate" },
    { value: "4.9/5", label: "Client rating" },
  ];
  return (
    <section className="border-y border-border bg-secondary">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-2xl font-bold text-primary md:text-3xl">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const items = [
    { icon: Shield, title: "Health Insurance Claims", body: "Cashless or reimbursement — we navigate TPAs, documentation, and rejections." },
    { icon: Scale, title: "Motor & Accident Claims", body: "Own-damage, third-party, and total-loss claims handled end-to-end." },
    { icon: FileCheck, title: "Life & Mediclaim Settlements", body: "Death, disability, and critical illness claims pursued with diligence." },
    { icon: Award, title: "Property & Fire Claims", body: "Surveyor coordination and loss assessment for home and business policies." },
    { icon: Clock, title: "Delayed & Rejected Claims", body: "Specialist team revives stuck claims and escalates through proper channels." },
    { icon: Phone, title: "Ombudsman Representation", body: "Formal grievance filing and representation before insurance ombudsman." },
  ];
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-glow">What we do</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Every claim, every category — handled.</h2>
        <p className="mt-4 text-muted-foreground">From the first form to the final settlement, our advisors act as your single point of accountability.</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="group rounded-xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/40" style={{ boxShadow: "var(--shadow-soft)" }}>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: "01", title: "Share your case", body: "Tell us about the claim in a 15-minute call. Free, no commitment." },
    { n: "02", title: "We build the file", body: "Documentation, medical records, surveyor reports — we assemble everything." },
    { n: "03", title: "Filing & follow-up", body: "We file with the insurer and pursue your claim daily until resolution." },
    { n: "04", title: "Settlement in hand", body: "You receive the settlement directly into your account. We're paid only on success." },
  ];
  return (
    <section id="process" className="border-y border-border" style={{ background: "var(--gradient-trust)" }}>
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-glow">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Four steps. Total clarity.</h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-xl border border-border bg-card p-6">
              <div className="font-display text-3xl font-bold text-accent">{s.n}</div>
              <h3 className="mt-3 font-display text-lg font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyTrust() {
  const points = [
    { icon: Lock, title: "Bank-grade security", body: "Your documents are encrypted in transit and at rest. We never sell or share your data." },
    { icon: Scale, title: "Regulated process", body: "Our workflow aligns with IRDAI guidelines and insurance ombudsman procedures." },
    { icon: Award, title: "No win, no fee", body: "You pay only when we recover your claim. Transparent, percentage-based pricing." },
    { icon: CheckCircle2, title: "Real human advisors", body: "Every case is assigned to a named claims advisor — not a chatbot, not a queue." },
  ];
  return (
    <section id="trust" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-glow">Why ClaimForSure</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Built on trust, proven by outcomes.</h2>
          <p className="mt-4 text-muted-foreground">Insurers process thousands of claims a day. You deserve an advocate who knows the playbook — and uses it for you.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {points.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-5">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-display text-base font-bold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    { name: "Ritu S.", role: "Mediclaim recovered", body: "My hospital claim was rejected twice. ClaimForSure got it sanctioned in 6 weeks. Calm, professional, relentless." },
    { name: "Anand M.", role: "Motor total-loss", body: "After my accident I had no idea where to start. They handled the surveyor, the paperwork, everything. Settled in full." },
    { name: "Pooja & Vinay", role: "Life claim", body: "We were grieving. They took every call, every form. We will recommend them to anyone who'll listen." },
  ];
  return (
    <section className="border-y border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-glow">Client stories</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">People who got their claim — for sure.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.name} className="flex flex-col rounded-xl border border-border bg-card p-6">
              <div className="flex gap-0.5 text-accent">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="mt-4 flex-1 font-display text-base italic leading-relaxed text-foreground">“{q.body}”</blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <div className="text-sm font-semibold text-foreground">{q.name}</div>
                <div className="text-xs text-muted-foreground">{q.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "How much does ClaimForSure charge?", a: "We work on a no-win, no-fee model. Our fee is a transparent percentage of the recovered amount, agreed upfront in writing." },
    { q: "Will you take cases that were already rejected?", a: "Yes. Rejected and delayed claims are our specialty. We review the rejection reason and build a fresh case where merit exists." },
    { q: "How long does a claim take to settle?", a: "Most health claims resolve in 4–8 weeks. Complex motor, property, and life claims may take longer, but we share weekly updates throughout." },
    { q: "Is my data safe with you?", a: "All documents are stored encrypted, accessible only to your assigned advisor. We never share data with third parties without your written consent." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-glow">Questions</p>
      <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Answers, straight up.</h2>
      <div className="mt-10 divide-y divide-border border-y border-border">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer items-center justify-between font-display text-base font-semibold text-foreground">
              {f.q}
              <span className="ml-4 text-primary transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="mx-auto max-w-5xl px-6 py-20 text-center text-primary-foreground">
        <Shield className="mx-auto h-10 w-10 text-[oklch(0.82_0.14_80)]" />
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight md:text-5xl">
          Stop chasing your insurer. <br className="hidden md:block" />Let us do it.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-white/80">Free 15-minute claim review. No paperwork to start, no obligation to continue.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="tel:+919438463174" className="inline-flex items-center gap-2 rounded-md bg-[oklch(0.82_0.14_80)] px-6 py-3 text-sm font-semibold text-[oklch(0.2_0.05_265)] shadow-lg">
            <Phone className="h-4 w-4" /> Call +91 94384 63174
          </a>
          <a href="mailto:support@claimforsure.in" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10">
            support@claimforsure.in
          </a>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 text-left text-sm text-white/85 md:grid-cols-3">
          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <p className="font-semibold text-white">Phone</p>
            <a href="tel:+919438463174" className="mt-1 block hover:text-white">+91 94384 63174</a>
            <a href="tel:+919439572073" className="block hover:text-white">+91 94395 72073</a>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <p className="font-semibold text-white">Email</p>
            <a href="mailto:support@claimforsure.in" className="mt-1 block hover:text-white">support@claimforsure.in</a>
            <p className="mt-1 text-white/70">We reply within 24 hours</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <p className="font-semibold text-white">Office</p>
            <p className="mt-1">123 Business Park, Sector 15,<br />Gurugram, Haryana 122001</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-primary">ClaimForSure</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Your claim, handled with certainty.</p>
          <p className="mt-3 text-xs text-muted-foreground">123 Business Park, Sector 15,<br />Gurugram, Haryana 122001</p>
          <p className="mt-2 text-xs text-muted-foreground">
            <a href="tel:+919438463174" className="hover:text-primary">+91 94384 63174</a> · <a href="tel:+919439572073" className="hover:text-primary">+91 94395 72073</a>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            <a href="mailto:support@claimforsure.in" className="hover:text-primary">support@claimforsure.in</a>
          </p>
        </div>
        <FooterCol title="Services" links={["Health claims", "Motor claims", "Life claims", "Property claims"]} />
        <FooterCol title="Company" links={["About", "Process", "Contact", "Careers"]} />
        <FooterCol title="Legal" links={["Privacy policy", "Terms of service", "Grievance redressal"]} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} ClaimForSure. All rights reserved.</p>
          <p>ClaimForSure is a claims-assistance service and is not an insurer.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => <li key={l}><a href="#" className="hover:text-foreground">{l}</a></li>)}
      </ul>
    </div>
  );
}
