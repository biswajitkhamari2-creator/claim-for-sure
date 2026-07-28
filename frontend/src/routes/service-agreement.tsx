import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Download, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/service-agreement")({
  component: ServiceAgreementPage,
  head: () => ({
    meta: [
      { title: "Service Agreement — ClaimForSure" },
      { name: "description", content: "Legally binding Service Agreement between ClaimForSure and the customer for insurance claim assistance, including 20% + GST success fee, Odisha jurisdiction." },
      { name: "keywords", content: "ClaimForSure service agreement, claim resolution agreement terms, legal contract insurance claim" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:title", content: "Service Agreement — ClaimForSure" },
      { property: "og:description", content: "Official Service Agreement governing insurance claim resolution support by ClaimForSure." },
      { property: "og:url", content: "https://www.claimforsure.in/service-agreement" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.claimforsure.in/favicon.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.claimforsure.in/favicon.png" },
    ],
    links: [{ rel: "canonical", href: "https://www.claimforsure.in/service-agreement" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.claimforsure.in/" },
            { "@type": "ListItem", position: 2, name: "Service Agreement", item: "https://www.claimforsure.in/service-agreement" },
          ],
        }),
      },
    ],
  }),
});

function ServiceAgreementPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <header className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-[oklch(0.78_0.14_78)]/20 p-3">
              <FileText className="h-6 w-6 text-[oklch(0.85_0.14_80)]" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">ClaimForSure — Service Agreement</h1>
              <p className="mt-1 text-sm text-white/70">Version 1.0 · Governing law: India · Jurisdiction: Bhubaneswar, Odisha</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href="/legal/ClaimForSure-Service-Agreement.pdf" download="ClaimForSure-Service-Agreement.pdf" target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-lg bg-[oklch(0.78_0.14_78)] px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-90">
                  <Download className="h-4 w-4" /> Download PDF
                </a>
                <a href="/legal/ClaimForSure-Service-Agreement.docx" download="ClaimForSure-Service-Agreement.docx" className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
                  <Download className="h-4 w-4" /> Download editable DOCX
                </a>
              </div>
            </div>
          </div>
        </header>

        <article className="prose prose-invert mt-6 max-w-none rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-relaxed text-white/85 backdrop-blur">
          <p>This Service Agreement (&ldquo;Agreement&rdquo;) is made and executed on the date of acceptance by the Client through the ClaimForSure platform, between <strong>CLAIMFORSURE</strong> (&ldquo;Service Provider&rdquo;), an insurance claim assistance firm based in the State of Odisha, India, and the <strong>user/customer</strong> who registers on the platform and clicks &ldquo;I Accept&rdquo;.</p>

          <h2 className="mt-6 text-lg font-bold text-[oklch(0.85_0.14_80)]">1. Scope of Services</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Review of policy documents, claim circumstances and supporting evidence.</li>
            <li>Drafting, filing and submission of the claim with the insurer.</li>
            <li>Follow-up with insurer, surveyor, hospital, TPA or ombudsman on behalf of the Client.</li>
            <li>Expert review, additional documentation and escalation up to resolution.</li>
          </ul>

          <h2 className="mt-6 text-lg font-bold text-[oklch(0.85_0.14_80)]">2. Processing Fee</h2>
          <p>Upon approval of the claim for active processing, the Client shall pay a non-refundable processing fee of <strong>INR 1,770/-</strong> (inclusive of GST) through the in-app Razorpay gateway.</p>

          <h2 className="mt-6 text-lg font-bold text-[oklch(0.85_0.14_80)]">3. Success Fee — 20% + GST</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Service Provider is entitled to <strong>20% of the gross amount</strong> sanctioned, approved, settled or paid by the insurer to the Client, <strong>plus GST</strong> at the prevailing rate (currently 18%) on the Success Fee.</li>
            <li>Becomes due immediately upon insurer&rsquo;s approval/sanction/settlement, or credit into the Client&rsquo;s bank account, whichever is earlier.</li>
            <li>Client must declare the payout (with documentary proof) through the in-app &ldquo;Declare Payout&rdquo; form <strong>within 48 hours</strong> of receipt.</li>
            <li>Invoice issued by Company is payable <strong>within 7 days</strong>; failure flags the Client as a Defaulter.</li>
          </ul>

          <h2 className="mt-6 text-lg font-bold text-[oklch(0.85_0.14_80)]">4. Anti-Evasion</h2>
          <p>The Client undertakes not to conceal, under-declare or misrepresent any claim proceeds, not to submit fabricated proof, not to re-route insurer payment to third parties, and not to accept the claim outside the platform to avoid the Success Fee. Any such act constitutes <strong>fraud, criminal breach of trust and cheating</strong> under Sections 318 &amp; 316 of the Bharatiya Nyaya Sanhita, 2023 (formerly IPC 420 / 406), entitling the Company to civil and criminal remedies.</p>

          <h2 className="mt-6 text-lg font-bold text-[oklch(0.85_0.14_80)]">5. Interest &amp; Recovery Costs</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Late payment carries interest at <strong>18% p.a.</strong> calculated daily from the date of insurer payout.</li>
            <li>Client shall reimburse all advocate, court, arbitration and incidental costs incurred in recovery.</li>
            <li>Overdue accounts may be reported to credit bureaus and the Company&rsquo;s Defaulter Registry.</li>
          </ul>

          <h2 className="mt-6 text-lg font-bold text-[oklch(0.85_0.14_80)]">6. Data &amp; Electronic Acceptance</h2>
          <p>Acceptance is recorded along with user ID, email, mobile, IP address, device, timestamp and agreement version. Under <strong>Section 10A of the Information Technology Act, 2000</strong> this electronic acceptance has the same legal effect as a signed paper copy and is admissible in any court of law in India.</p>

          <h2 className="mt-6 text-lg font-bold text-[oklch(0.85_0.14_80)]">7. Termination Survival</h2>
          <p>If the claim was already submitted or substantially worked upon by the Company and is later approved/paid within <strong>24 months</strong>, the Success Fee obligation survives termination.</p>

          <h2 className="mt-6 text-lg font-bold text-[oklch(0.85_0.14_80)]">8. Governing Law &amp; Jurisdiction</h2>
          <p>Governed by the laws of India. Courts at <strong>Bhubaneswar, Odisha</strong> have exclusive jurisdiction. Disputes shall first be referred to arbitration under the Arbitration and Conciliation Act, 1996, with seat and venue at Bhubaneswar, Odisha.</p>

          <p className="mt-6 text-xs text-white/60">For the complete legally-binding text (including signature blocks), download the PDF above. By signing up on ClaimForSure you electronically execute this Agreement.</p>
        </article>
      </div>
    </main>
  );
}