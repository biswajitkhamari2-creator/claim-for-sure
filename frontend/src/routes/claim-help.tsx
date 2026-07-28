import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Car, Shield, Home, Plane, UserCheck } from "lucide-react";
import { BrandLockup } from "@/components/BrandLockup";

const CATS = [
  { icon: Heart, title: "Health Insurance Claims", desc: "Cashless denials, post-discharge reimbursement disputes, pre-existing-disease rejections, sub-limit cuts." },
  { icon: Car, title: "Motor Insurance Claims", desc: "Accident claims, theft total-loss, IDV disputes, surveyor undervaluation, third-party recovery." },
  { icon: UserCheck, title: "Life & Term Insurance Claims", desc: "Death claim repudiation, suicide-clause disputes, lapsed policy revival, nominee documentation." },
  { icon: Home, title: "Home & Property Claims", desc: "Fire, flood, burglary, natural-calamity claims. We coordinate surveyor visits and quantum negotiation." },
  { icon: Plane, title: "Travel Insurance Claims", desc: "Trip cancellation, baggage loss, medical-evacuation, COVID-related claim denials." },
  { icon: Shield, title: "Personal Accident & Critical Illness", desc: "Disability percentage disputes, definition-of-illness rejections, waiting-period challenges." },
];

export const Route = createFileRoute("/claim-help")({
  head: () => ({
    meta: [
      { title: "Insurance Claim Help — Every Category | ClaimForSure" },
      { name: "description", content: "Expert help for health, motor, life, home, travel & accident insurance claims in India. Rejected, delayed or underpaid — we appeal and recover it." },
      { name: "keywords", content: "insurance claim help, health insurance claim, motor claim recovery, life insurance claim help, IRDAI ombudsman claim assistance" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:title", content: "Insurance Claim Help — Every Category | ClaimForSure" },
      { property: "og:description", content: "Help with rejected, delayed, and underpaid insurance claims across every category." },
      { property: "og:url", content: "https://www.claimforsure.in/claim-help" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.claimforsure.in/favicon.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.claimforsure.in/favicon.png" },
    ],
    links: [{ rel: "canonical", href: "https://www.claimforsure.in/claim-help" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Insurance Claim Assistance",
          provider: { "@id": "https://www.claimforsure.in/#organization" },
          areaServed: { "@type": "Country", name: "India" },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Claim categories",
            itemListElement: CATS.map((c) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: c.title, description: c.desc },
            })),
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.claimforsure.in/" },
            { "@type": "ListItem", position: 2, name: "Claim Help", item: "https://www.claimforsure.in/claim-help" },
          ],
        }),
      },
    ],
  }),
  component: ClaimHelp,
});

function ClaimHelp() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Insurance Claim Help</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Whether your claim was rejected, delayed, or paid less than it should have been — we file the appeal,
          assemble the evidence, and pursue the insurer until it's resolved.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6">
              <Icon className="h-7 w-7 text-primary" />
              <h2 className="mt-4 font-display text-base font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-xl bg-primary p-8 text-primary-foreground">
          <h2 className="font-display text-xl font-bold">Not sure if you have a case?</h2>
          <p className="mt-2 text-sm opacity-90">Send us your rejection letter — first review is free.</p>
          <a href="https://wa.me/919439151934" className="mt-5 inline-flex rounded-md bg-background px-4 py-2 text-sm font-semibold text-foreground">
            WhatsApp us
          </a>
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
          <Link to="/how-it-works" className="hover:text-foreground">How It Works</Link>
          <Link to="/faq" className="hover:text-foreground">FAQ</Link>
          <Link to="/about" className="hover:text-foreground">About</Link>
        </nav>
      </div>
    </header>
  );
}