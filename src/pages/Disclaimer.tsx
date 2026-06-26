import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Disclaimer = () => {
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
                Disclaimer
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
                
                {/* Important Communication Notice */}
                <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-6">
                  <h2 className="font-display text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                    ⚠️ Important Communication Notice
                  </h2>
                  <div className="space-y-3 text-amber-900">
                    <p className="font-semibold">
                      Claim For Sure currently operates ONLY through the following official channels:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li><strong>Email:</strong> support@claimforsure.in</li>
                      <li><strong>Phone:</strong> +91 94384 63174 / +91 94395 72073</li>
                      <li><strong>WhatsApp:</strong> +91 94384 63174</li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-amber-300">
                      <p className="font-bold text-amber-800">
                        🚫 NO SOCIAL MEDIA PRESENCE
                      </p>
                      <p className="mt-2">
                        We are <strong>NOT</strong> associated with any social media platforms including but not limited to 
                        Facebook, Instagram, Twitter/X, LinkedIn, YouTube, or Telegram. Any account claiming to represent 
                        Claim For Sure on these platforms is <strong>FRAUDULENT</strong> and not affiliated with us.
                      </p>
                      <p className="mt-2 font-medium">
                        Please do not share any personal or financial information with anyone claiming to be from 
                        Claim For Sure on social media. Report such accounts immediately.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Service Limitations
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Claim For Sure does not provide insurance, underwriting, or policy issuance services.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    No Guarantee
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not guarantee claim approval or settlement amounts.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Basis of Assistance
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    All assistance is based on information provided by users and standard industry practices.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Final Decisions
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Final decisions always rest with insurance companies, regulators, or legal authorities.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Limitation of Liability
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By using this platform, users agree that Claim For Sure shall not be held liable for 
                    claim outcomes, delays, or insurer decisions.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Official Contact Channels
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    For any queries or assistance, contact us ONLY through these verified channels:
                  </p>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-foreground font-medium">Claim For Sure</p>
                    <p className="text-muted-foreground">Email: support@claimforsure.in</p>
                    <p className="text-muted-foreground">Phone: +91 94384 63174 / +91 94395 72073</p>
                    <p className="text-muted-foreground">WhatsApp: +91 94384 63174</p>
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

export default Disclaimer;
