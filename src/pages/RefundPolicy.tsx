import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const RefundPolicy = () => {
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
                Refund Policy
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
                    Service Charges
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Service charges, if applicable, are collected for professional assistance, 
                    documentation support, and claim handling services.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Non-Refundable Services
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Once a case review or service process has started, fees are generally non-refundable.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Discretionary Refunds
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Refunds, if any, are purely at the discretion of Claim For Sure management 
                    based on case circumstances.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Claim Rejection
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Claim outcome or rejection by the insurance company does not make the service 
                    eligible for a refund.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Contact
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    For questions about this Refund Policy, contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-foreground font-medium">Claim For Sure</p>
                    <p className="text-muted-foreground">Email: support@claimforsure.in</p>
                    <p className="text-muted-foreground">Phone: +91 94395 72073 / +91 94384 63174</p>
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

export default RefundPolicy;
