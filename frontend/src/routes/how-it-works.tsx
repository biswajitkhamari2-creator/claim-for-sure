import { createFileRoute, Link } from "@tanstack/react-router";
import { FileSearch, FileCheck, Phone, Award } from "lucide-react";
import { BrandLockup } from "@/components/BrandLockup";

const STEPS = [
  { icon: FileSearch, title: "1. Free case review", desc: "Send us your rejection letter and policy. We assess merit and tell you honestly whether to proceed." },
  { icon: FileCheck, title: "2. Document & strategy", desc: "We assemble medical records, surveyor reports, and prior correspondence — then draft a representation aimed at the strongest grounds." },
  { icon: Phone, title: "3. Insurer & escalation", desc: "We push the insurer's grievance cell first, then IRDAI Bima Bharosa or the Insurance Ombudsman if needed." },
  { icon: Award, title: "4. Resolution & payout", desc: "Settlement is paid directly to you by the insurer. We share every update along the way." },
];

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How ClaimForSure Works — From Rejection to Recovery" },
      { name: "description", content: "Our 4-step process for handling rejected and delayed insurance claims: free review, document preparation, insurer escalation, and final resolution." },
      { name: "keywords", content: "how insurance claim help works, claim recovery process, IRDAI ombudsman appeal process" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:title", content: "How ClaimForSure Works — From Rejection to Recovery" },
      { property: "og:description", content: "From free case review to insurer escalation and final claim recovery — see our 4-step process." },
      { property: "og:url", content: "https://www.claimforsure.in/how-it-works" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.claimforsure.in/favicon.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.claimforsure.in/favicon.png" },
    ],
    links: [{ rel: "canonical", href: "https://www.claimforsure.in/how-it-works" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to recover a rejected insurance claim with ClaimForSure",
          step: STEPS.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title,
            text: s.desc,
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
            { "@type": "ListItem", position: 2, name: "How It Works", item: "https://www.claimforsure.in/how-it-works" },
          ],
        }),
      },
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">How ClaimForSure Works</h1>
        <p className="mt-3 text-muted-foreground">A simple, transparent 4-step process from first contact to claim recovery.</p>
        <ol className="mt-10 space-y-6">
          {STEPS.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex gap-4 rounded-xl border border-border bg-card p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-semibold">{title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
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
          <Link to="/faq" className="hover:text-foreground">FAQ</Link>
          <Link to="/about" className="hover:text-foreground">About</Link>
        </nav>
      </div>
    </header>
  );
}