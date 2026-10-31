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
    q: "What to do if an insurance claim is rejected?",
    a: "Get the written rejection letter, check the clause cited against your policy, file a written grievance with the insurer, and if it is not resolved within 30 days, complain to the Insurance Ombudsman for free. Larger or unresolved disputes can go to the Consumer Commission.",
  },
  {
    q: "What to do if the insurance company rejects my claim unfairly?",
    a: "Do not accept a verbal or SMS rejection. Insist on a written repudiation letter, then contest it with evidence — medical records, bills, FIR or surveyor reports — through the grievance cell and the Insurance Ombudsman. Rejections based on wrong clauses or weak proof are frequently reversed.",
  },
  {
    q: "What is claim repudiation in insurance?",
    a: "Claim repudiation is the insurer's formal refusal to pay a claim, fully or partly, citing a policy ground such as non-disclosure, an exclusion or a waiting period. It must be given in writing with reasons, and it can be appealed.",
  },
  {
    q: "Why do insurance companies deny claims?",
    a: "The most common reasons are alleged non-disclosure of pre-existing illness, policy exclusions, waiting periods or sub-limits, late intimation, missing documents, and in life or motor claims, suicide, intoxication or fraud clauses. Many of these are contestable.",
  },
  {
    q: "What to do when a life insurance claim is rejected?",
    a: "The nominee should get the written repudiation, check whether the policy had run for 3 years (after which Section 45 of the Insurance Act bars the insurer from questioning it), file a grievance, and then approach the Insurance Ombudsman or Consumer Commission.",
  },
  {
    q: "How do I dispute an insurance claim decision?",
    a: "Write to the insurer's Grievance Redressal Officer (or use IRDAI's Bima Bharosa portal) with the claim number, rejection letter and supporting documents. If unresolved in 30 days, file with the Insurance Ombudsman; after that, the Consumer Commission.",
  },
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
      { title: "What To Do If Your Insurance Claim Is Rejected (India Guide) | ClaimForSure" },
      { name: "description", content: "Insurance claim rejected? Here's exactly what to do in India: get the repudiation letter, file a grievance, then go to the Insurance Ombudsman (free). Covers health, life and motor claim rejections." },
      { name: "keywords", content: "what to do if insurance claim is rejected, insurance claim rejected what to do, life insurance claim rejected, insurance company rejects claim, claim repudiation in insurance, how to dispute insurance claim, insurance ombudsman india, IRDAI complaint" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:title", content: "What To Do If Your Insurance Claim Is Rejected | ClaimForSure" },
      { property: "og:description", content: "Step-by-step guide to reopen a rejected health, life or motor insurance claim in India — grievance cell, Ombudsman, Consumer Forum. Free first review." },
      { property: "og:url", content: "https://www.claimforsure.in/insurance-claim-rejected" },
      { property: "og:type", content: "article" },
      { property: "og:image", content: "https://www.claimforsure.in/favicon.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.claimforsure.in/favicon.png" },
    ],
    links: [{ rel: "canonical", href: "https://www.claimforsure.in/insurance-claim-rejected" }],
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
          headline: "What To Do If Your Insurance Claim Is Rejected in India",
          about: "Insurance claim rejection appeal process in India",
          inLanguage: "en-IN",
          datePublished: "2026-07-28",
          dateModified: "2026-10-31",
          author: { "@id": "https://www.claimforsure.in/#organization" },
          publisher: { "@id": "https://www.claimforsure.in/#organization" },
          mainEntityOfPage: "https://www.claimforsure.in/insurance-claim-rejected",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.claimforsure.in/" },
            { "@type": "ListItem", position: 2, name: "Rejected Claims Guide", item: "https://www.claimforsure.in/insurance-claim-rejected" },
          ],
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
          What To Do If Your Insurance Claim Is Rejected
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          A written rejection is not the final word. Under IRDAI rules, every policyholder has a structured
          right to appeal — through the insurer's grievance cell, the Insurance Ombudsman, and Consumer
          Commissions. This guide walks through the real reasons claims get denied and the exact steps to
          reopen one.
        </p>

        <section className="mt-8 rounded-xl border border-primary/40 bg-card p-6">
          <h2 className="font-display text-lg font-bold">Quick answer: insurance claim rejected — what to do?</h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Ask the insurer for the <strong className="text-foreground">written rejection (repudiation) letter</strong> quoting the exact clause.</li>
            <li>Check that clause against your policy wording and the documents you submitted.</li>
            <li>File a written complaint with the insurer's <strong className="text-foreground">Grievance Redressal Officer</strong> or on IRDAI's Bima Bharosa portal.</li>
            <li>If there is no fair reply within 30 days, complain to the <strong className="text-foreground">Insurance Ombudsman</strong> — it is free.</li>
            <li>For larger amounts or if the ombudsman route fails, approach the <strong className="text-foreground">Consumer Commission</strong>.</li>
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">What is claim repudiation in insurance?</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Claim repudiation</strong> means the insurer has formally refused to pay
            a claim, wholly or partly, citing a reason under the policy — for example non-disclosure, an exclusion,
            or a waiting period. It is different from a claim being <em>pending</em> or <em>queried</em>. A
            repudiation must be communicated in writing with reasons, and that letter is what you challenge in
            your grievance, ombudsman complaint or consumer case.
          </p>
        </section>

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

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">What to do when a life insurance claim is rejected</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Death claims are most often rejected for alleged non-disclosure of health history, a lapsed policy,
            or the suicide clause. Nominees have strong protections:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>Under <strong className="text-foreground">Section 45 of the Insurance Act, 1938</strong>, a life policy cannot be questioned on any ground once it has run for 3 years from issue or revival.</span></li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>Within 3 years, the insurer must show the non-disclosure was material and give written reasons — a vague "suppression of facts" letter can be challenged.</span></li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>The nominee or legal heir can file the grievance and the ombudsman complaint in their own name.</span></li>
          </ul>
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