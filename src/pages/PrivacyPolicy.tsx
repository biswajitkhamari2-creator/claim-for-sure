import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => {
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
                Privacy Policy
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
            <div className="max-w-3xl mx-auto prose prose-lg">
              <div className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-8">
                
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    Claim For Sure respects your privacy and is committed to protecting your personal data.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Information We Collect
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We collect personal details, insurance information, uploaded documents, and communication 
                    records only for claim processing and support.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    How We Use Your Information
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not sell or misuse personal data. Information may only be shared with internal teams, 
                    claim professionals, or government authorities if legally required.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Data Security
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    All uploaded documents are stored securely and accessed only by authorized personnel.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Your Rights
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Users may request access, correction, or deletion of their personal data at any time.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Cookies
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may use cookies to improve website functionality and user experience.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Acceptance
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Continued use of the website implies acceptance of this policy.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Contact Us
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;
