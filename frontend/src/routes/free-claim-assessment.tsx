import { createFileRoute } from '@tanstack/react-router';
import { LeadForm } from '@/components/leads/LeadForm';
import { ShieldAlert, PhoneCall, FileText } from 'lucide-react';

export const Route = createFileRoute('/free-claim-assessment')({
  head: () => ({
    meta: [
      { title: "Free Insurance Claim Assessment | ClaimForSure" },
      { name: "description", content: "Request a free 15-minute case review with ClaimForSure. We evaluate rejected, underpaid, or delayed health, motor, and life insurance claims across India." },
      { name: "keywords", content: "free claim assessment, insurance claim evaluation, free claim consultation, rejected claim review" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:title", content: "Free Insurance Claim Assessment | ClaimForSure" },
      { property: "og:description", content: "Get a free 15-minute consultation with an insurance claim specialist." },
      { property: "og:url", content: "https://www.claimforsure.in/free-claim-assessment" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.claimforsure.in/favicon.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.claimforsure.in/favicon.png" },
    ],
    links: [{ rel: "canonical", href: "https://www.claimforsure.in/free-claim-assessment" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.claimforsure.in/" },
            { "@type": "ListItem", position: 2, name: "Free Claim Assessment", item: "https://www.claimforsure.in/free-claim-assessment" },
          ],
        }),
      },
    ],
  }),
  component: FreeClaimAssessment,
});

function FreeClaimAssessment() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-12 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Left Column - Copy */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                Insurance Claim Rejected? <span className="text-primary">Get Expert Help.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Submit your details and our claim experts will call you shortly to assess your case for free. 
                We specialize in reversing unfairly rejected health, life, and motor insurance claims.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <ShieldAlert className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">No Win, No Fee</h3>
                  <p className="text-muted-foreground">You only pay us a success fee if we successfully get your claim approved.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Expert Document Review</h3>
                  <p className="text-muted-foreground">Our team of experts carefully reviews your policy and rejection letter to find the best way forward.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <PhoneCall className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Free Consultation</h3>
                  <p className="text-muted-foreground">Submit the form and get a free 15-minute consultation with a claim specialist.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6">Request Your Callback</h2>
            <LeadForm />
          </div>
          
        </div>
      </div>
    </div>
  );
}
