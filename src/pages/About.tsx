import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, Users, Target, Award, CheckCircle } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 lg:pt-32">
        {/* Hero Section */}
        <section className="py-16 lg:py-20 hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 indian-pattern opacity-20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
                About Claim For Sure
              </h1>
              <p className="text-lg text-white/80">
                India's most trusted platform fighting for your rightful insurance claims since 2018.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">
                  Our Mission
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Fighting For Your Rights, One Claim at a Time
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  At Claim For Sure, we believe that every policyholder deserves fair treatment. 
                  When insurance companies unfairly reject your claims, we step in to fight for 
                  what's rightfully yours.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our team of ex-insurance professionals, legal experts, and consumer advocates 
                  work tirelessly to ensure that you get the settlement you deserve. We understand 
                  the system inside out, and we use that knowledge to your advantage.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">₹50Cr+</div>
                  <div className="text-sm text-muted-foreground">Claims Recovered</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">6+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">
                Our Values
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                What We Stand For
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Integrity",
                  description: "We operate with complete transparency and honesty in all our dealings."
                },
                {
                  icon: Users,
                  title: "Customer First",
                  description: "Your success is our success. We don't rest until you get your claim."
                },
                {
                  icon: Target,
                  title: "Excellence",
                  description: "We strive for the best possible outcome in every case we handle."
                },
                {
                  icon: Award,
                  title: "Expertise",
                  description: "Our team brings decades of combined insurance industry experience."
                },
              ].map((value, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">
                  Why Choose Us
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  The Claim For Sure Advantage
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  "No upfront fees - You only pay when we win",
                  "Team of ex-insurance company professionals",
                  "Direct access to ombudsman and consumer courts",
                  "24/7 customer support via WhatsApp and call",
                  "Complete confidentiality of your documents",
                  "Regular updates on your claim status",
                  "Average resolution time of 60-90 days",
                  "Pan-India coverage across all states",
                ].map((point, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
