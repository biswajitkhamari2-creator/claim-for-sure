import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, FileText, Scale, Clock, CheckCircle2, HelpCircle } from "lucide-react";
import { BrandLockup } from "@/components/BrandLockup";

const REASONS = [
  { title: "Non-disclosure of pre-existing disease", body: "Insurers often reject health claims citing undisclosed medical history at the time of policy purchase. A rejection on this ground is contestable if the condition was unrelated or the claim falls outside the moratorium period under IRDAI rules." },
  { title: "Delay in intimation", body: "Motor and health policies require the insurer to be informed within a stated window. Delay alone is not always a valid ground for rejection — case law recognises reasonable cause." },
  { title: "Policy exclusion cited", body: "Insurers frequently rely on fine-print exclusions. Many exclusions have been narrowed by IRDAI's standard health-insurance product norms and by consumer forum orders." },
  { title: "Documentation shortfall", body: "Missing discharge summary, FIR, indoor case papers, or original bills. Most of these can be reconstructed and re-submitted with a proper representation." },
  { title: "Waiting period / sub-limit", body: "Rejections invoking waiting periods, room-rent capping, or disease-wise sub-limits should be checked against the exact policy wording — insurers sometimes apply the wrong clause." },
  { title: "Suicide, intoxication or fraud clause (life/motor)", body: "Repudiation on these grounds requires the insurer to prove the exclusion. If proof is thin, the claim can be reopened through the ombudsman or consumer forum." },
];

const STEPS = [
  { n: "01", title: "Get the rejection letter in writing", body: "Ask the insurer for a written repudiation letter that quotes the exact clause used. Verbal or SMS rejections are not sufficient for appeal." },
  { n: "02", title: "File an internal grievance", body: "Every insurer has a Grievance Redressal Officer. IRDAI requires a written response within 14 days. Keep the acknowledgement." },
  { n: "03", title: "Escalate to the Insurance Ombudsman", body: "If the insurer does not resolve within 30 days, you can file a free complaint with the Insurance Ombudsman for claims up to ₹50 lakh (per IRDAI's Insurance Ombudsman Rules, 2017 as amended)." },
  { n: "04", title: "Consumer Forum / Civil Court", body: "For amounts above the ombudsman limit or when the ombudsman order is not acceptable, a District / State Consumer Commission complaint is the next step." },
];

const FAQS = [
  {
    q: "Can a rejected insurance claim be reopened?",
    a: "Yes. A written repudiation is not final. You can file a representation with the insurer's grievance cell, and if unresolved within 30 days, approach the Insurance Ombudsman. Many rejected health and motor claims are settled at the ombudsman stage.",
  },
  {
    q: "How long do I have to challenge a rejection?",
    a: "You have up to 1 year from the insurer's final rejection letter to approach the Insurance Ombudsman (Rule 14 of the Insurance Ombudsman Rules, 2017). Consumer Commission complaints have a 2-year limitation from the date of the cause of action.",
  },
  {
    q: "Is the Insurance Ombudsman free?",
    a: "Yes. Filing with the Insurance Ombudsman is free of cost for the policyholder. No lawyer is required, though many people prefer expert representation while drafting the complaint.",
  },
  {
    q: "What documents do I need to appeal?",
    a: "The written rejection letter, your policy document, the original claim form, all medical / accident / loss documents already submitted, and proof of premium payment. Any correspondence with the insurer's TPA or surveyor is also important.",
  },
  {
    q: "Do you handle claims outside Odisha?",
    a: "Yes. ClaimForSure works pan-India. All communication with insurers and the ombudsman can be done remotely once we have your documents.",
  },
];

export const Route = createFileRoute("/insurance-claim-rejected")({
  head: () => ({
    meta: [
      { title: "Insurance Claim Rejected? Here's What To Do | ClaimForSure" },
      { name: "description", content: "Insurance claim rejected in India? Learn the real reasons insurers repudiate health, motor and life claims, and the step-by-step IRDAI appeal process — grievance cell, Insurance Ombudsman, and Consumer Forum." },
      { name: "keywords", content: "insurance claim rejected, claim rejection help, insurance ombudsman india, health insurance claim denied, motor insurance claim rejected, IRDAI complaint" },
      { property: "og:title", content: "Insurance Claim Rejected? Here's What To Do" },
      { property: "og:description", content: "Step-by-step guide to reopen a rejected insurance claim in India — grievance cell, Ombudsman, Consumer Forum. Free first review." },
      { property: "og:url", content: "https://connect-brite.lovable.app/insurance-claim-rejected" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://connect-brite.lovable.app/insurance-claim-rejected" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Insurance Claim Rejected? Here's What To Do in India",
          about: "Insurance claim rejection appeal process in India",
          inLanguage: "en-IN",
          publisher: { "@id": "https://connect-brite.lovable.app/#organization" },
          mainEntityOfPage: "https://connect-brite.lovable.app/insurance-claim-rejected",
        }),
      },
    ],
  }),
  component: ClaimRejected,
});

function ClaimRejected() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <AlertTriangle className="h-3.5 w-3.5 text-primary" />
          Insurance Claim Guide · India
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Insurance Claim Rejected? Here's What To Do
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          A written rejection is not the final word. Under IRDAI rules, every policyholder has a structured
          right to appeal — through the insurer's grievance cell, the Insurance Ombudsman, and Consumer
          Commissions. This guide walks through the real reasons claims get denied and the exact steps to
          reopen one.
        </p>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">Common reasons insurers reject a claim</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {REASONS.map((r) => (
              <div key={r.title} className="rounded-xl border border-border bg-card p-6">
                <FileText className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-display text-base font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">Step-by-step: how to challenge a rejection</h2>
          <div className="mt-6 space-y-4">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                    {s.n}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <Scale className="mt-1 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h2 className="font-display text-xl font-bold">Insurance Ombudsman — what to know</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Filing is <strong className="text-foreground">free of cost</strong> for the policyholder.</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Covers claims up to <strong className="text-foreground">₹50 lakh</strong> (Insurance Ombudsman Rules, 2017 as amended).</li>
                <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Must be filed within <strong className="text-foreground">1 year</strong> of the insurer's final rejection.</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> The insurer is bound by the ombudsman award if you accept it.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-xl border border-border bg-card p-5">
                <summary className="flex cursor-pointer items-start gap-3 font-display text-sm font-semibold text-foreground">
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{f.q}</span>
                </summary>
                <p className="mt-3 pl-7 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-xl bg-primary p-8 text-primary-foreground">
          <h2 className="font-display text-xl font-bold">Send us your rejection letter</h2>
          <p className="mt-2 text-sm opacity-90">
            First review is free. Our team will read the repudiation, cross-check the clause against your
            policy, and tell you honestly whether an appeal is likely to succeed.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://wa.me/919439151934"
              className="inline-flex rounded-md bg-background px-4 py-2 text-sm font-semibold text-foreground"
            >
              WhatsApp us
            </a>
            <Link
              to="/claim-help"
              className="inline-flex rounded-md border border-primary-foreground/30 px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              See all claim categories
            </Link>
          </div>
        </section>

        <p className="mt-10 text-xs text-muted-foreground">
          This page is general information about the claim appeal process in India and is not legal advice.
          ClaimForSure is operated by Sidheshwar Enterprises and assists policyholders with representation
          before insurers, IRDAI, and the Insurance Ombudsman.
        </p>
      </main>
    </div>
  );
}

function PageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center" aria-label="Claim For Sure — by Sidheshwar Enterprises">
          <BrandLockup size="sm" layout="inline" />
        </Link>
        <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/claim-help" className="hover:text-foreground">Claim Help</Link>
          <Link to="/how-it-works" className="hover:text-foreground">How It Works</Link>
          <Link to="/faq" className="hover:text-foreground">FAQ</Link>
          <Link to="/about" className="hover:text-foreground">About</Link>
        </nav>
      </div>
    </header>
  );
}