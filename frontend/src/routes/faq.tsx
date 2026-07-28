import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandLockup } from "@/components/BrandLockup";

const FAQS = [
  {
    q: "What does ClaimForSure do?",
    a: "We help policyholders in India file new insurance claims and recover delayed or rejected claims across health, motor, life, property, and travel insurance — with expert review, document preparation, insurer follow-ups, and (where needed) ombudsman or legal escalation.",
  },
  {
    q: "My health insurance claim was rejected. Can you still help?",
    a: "Yes. Most rejections can be appealed if filed within the insurer's grievance window. Send us the rejection letter and policy copy — we'll audit the reason, draft a representation, and pursue the insurer's grievance cell, IRDAI Bima Bharosa, or the Insurance Ombudsman as appropriate.",
  },
  {
    q: "How much do you charge?",
    a: "We charge a transparent service fee disclosed upfront before you sign. There are no hidden percentages on your claim amount and no charge to evaluate your case.",
  },
  {
    q: "How long does claim recovery take?",
    a: "Insurer-level escalations typically resolve in 15–45 days. Ombudsman cases take 3–6 months. Court-stage matters take longer. We share realistic timelines after the initial review.",
  },
  {
    q: "Which insurers do you work with?",
    a: "All IRDAI-licensed insurers in India, including Star Health, HDFC ERGO, ICICI Lombard, Bajaj Allianz, Niva Bupa, Care, Tata AIG, New India Assurance, LIC, Max Life, and more.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. All documents are stored privately, shared only with claim handlers assigned to your case, and never sold. See our Privacy Policy for full details.",
  },
  {
    q: "Do you have a physical office?",
    a: "We operate primarily over phone, email, and WhatsApp so you don't have to travel. For in-person consultation in Odisha, contact us to schedule.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Insurance Claim FAQs — ClaimForSure" },
      { name: "description", content: "Answers to the most common questions about insurance claim help, rejected claims, fees, timelines, and the insurers we work with." },
      { name: "keywords", content: "insurance claim FAQ, rejected claim questions, insurance ombudsman process FAQ, ClaimForSure FAQs" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:title", content: "Insurance Claim FAQs — ClaimForSure" },
      { property: "og:description", content: "Common questions about insurance claim assistance, rejected claims, fees, and timelines." },
      { property: "og:url", content: "https://www.claimforsure.in/faq" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.claimforsure.in/favicon.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.claimforsure.in/favicon.png" },
    ],
    links: [{ rel: "canonical", href: "https://www.claimforsure.in/faq" }],
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
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.claimforsure.in/" },
            { "@type": "ListItem", position: 2, name: "FAQ", item: "https://www.claimforsure.in/faq" },
          ],
        }),
      },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Insurance Claim FAQs</h1>
        <p className="mt-3 text-muted-foreground">Answers to the questions we hear most often.</p>
        <div className="mt-10 space-y-6">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-lg border border-border bg-card p-5">
              <summary className="cursor-pointer list-none text-base font-semibold text-foreground">
                {f.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
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
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/faq" className="hover:text-foreground">FAQ</Link>
        </nav>
      </div>
    </header>
  );
}