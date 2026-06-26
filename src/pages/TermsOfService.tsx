import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 lg:pt-32">
        {/* Hero Section */}
        <section className="py-12 lg:py-16 hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 indian-pattern opacity-20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Terms & Conditions
              </h1>
              <p className="text-white/80">
                Last updated: January 2026
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-8">
                
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    1. About Claim For Sure
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Claim For Sure is an <strong>independent insurance claim assistance platform</strong>. We are a helping body that assists policyholders in navigating the insurance claim process.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    <strong>We are NOT:</strong>
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>An insurance company</li>
                    <li>An insurance broker or agent</li>
                    <li>A Third Party Administrator (TPA)</li>
                    <li>A law firm (though we work with legal professionals)</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    All our services are advisory, documentation support, and representation-based in nature. We assist you in presenting your case effectively to insurance companies and regulatory authorities.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    2. No Guarantee of Claim Approval
                  </h2>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                    <p className="text-foreground font-medium">
                      Important: Claim For Sure does NOT guarantee approval or success of any insurance claim.
                    </p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    The outcome of any insurance claim depends entirely on:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>The terms and conditions of your insurance policy</li>
                    <li>The rules and guidelines of the insurance company</li>
                    <li>The completeness and accuracy of documentation provided</li>
                    <li>Applicable insurance laws and regulations (IRDAI guidelines)</li>
                    <li>Decisions of regulatory bodies, Ombudsman, or courts</li>
                    <li>Facts and circumstances specific to your case</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    We provide our best efforts to assist you, but the final decision on claim approval rests solely with the insurance company or the relevant judicial/regulatory authority.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    3. Nature of Our Services
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Our services include but are not limited to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Case evaluation and eligibility assessment</li>
                    <li>Documentation review and preparation</li>
                    <li>Filing claims and follow-ups with insurance companies</li>
                    <li>Escalation to IRDAI, Insurance Ombudsman</li>
                    <li>Representation in Consumer Courts (through legal partners)</li>
                    <li>Negotiation and settlement assistance</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    4. User Responsibilities
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    By using our services, you agree to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Provide accurate, complete, and truthful information</li>
                    <li>Submit genuine and unaltered documents</li>
                    <li>Cooperate with our team during the claim process</li>
                    <li>Pay applicable fees as per our pricing structure</li>
                    <li>Not engage in any fraudulent or illegal activities</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    5. Fees and Payments
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Our fee structure includes:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li><strong>Processing Fee (₹3,000 - ₹5,000):</strong> Non-refundable fee for case handling</li>
                    <li><strong>Success Fee (8% - 18%):</strong> Payable only after successful claim settlement</li>
                  </ul>
                  
                  {/* Non-refundable notice */}
                  <div className="mt-4 bg-red-50 border-2 border-red-400 rounded-lg p-4">
                    <p className="text-red-800 font-bold flex items-center gap-2">
                      ⚠️ IMPORTANT: Processing Fees are NON-REFUNDABLE
                    </p>
                    <p className="text-red-700 mt-2 text-sm">
                      Once paid, processing fees cannot be refunded under any circumstances, regardless of the outcome of your claim. 
                      This fee covers the administrative costs of case evaluation, documentation review, and initial processing of your claim.
                    </p>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    Detailed pricing is available on our Pricing page. Fee variations depend on claim type and complexity.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    6. Right to Accept or Reject Cases
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Claim For Sure reserves the absolute right to accept or reject any case at our sole discretion. We may decline cases that we assess as having very low chances of success or cases involving fraudulent claims.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    7. Termination of Service
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    We may immediately terminate our services if:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>False or misleading information is provided</li>
                    <li>Forged or tampered documents are submitted</li>
                    <li>Any illegal or fraudulent activity is detected</li>
                    <li>Non-payment of agreed fees</li>
                    <li>Non-cooperation with our team</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    8. Limitation of Liability
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Claim For Sure shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our services or the outcome of any claim. Our maximum liability is limited to the fees paid by you for our services.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    9. Governing Law & Jurisdiction
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Odisha, India.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    10. Contact Us
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    For questions about these Terms & Conditions, contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-foreground font-medium">Claim For Sure</p>
                    <p className="text-muted-foreground">Email: support@claimforsure.in</p>
                    <p className="text-muted-foreground">Phone: +91 94384 63174 / +91 94395 72073</p>
                    <p className="text-sm text-primary mt-2">🎯 Connect directly to our Claim Fighter — No Bot! 🤝</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
