import { createFileRoute } from '@tanstack/react-router';
import { LeadForm } from '@/components/leads/LeadForm';
import { ShieldAlert, PhoneCall, FileText } from 'lucide-react';

export const Route = createFileRoute('/free-claim-assessment')({
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
