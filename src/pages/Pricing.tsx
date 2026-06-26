import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  IndianRupee, 
  Shield, 
  Scale, 
  CheckCircle, 
  FileCheck, 
  Heart, 
  Car, 
  Users, 
  Plane, 
  Building2, 
  HelpCircle,
  Gavel,
  BadgeCheck,
  ArrowRight
} from "lucide-react";

const Pricing = () => {
  const pricingTiers = [
    {
      type: "Health Insurance",
      icon: Heart,
      processingFee: "₹3,000 - ₹4,000",
      successFee: "8% - 12%",
      effort: "Hospital coordination, TPA dealings, Medical documentation",
      color: "from-red-500 to-pink-500"
    },
    {
      type: "Motor Insurance",
      icon: Car,
      processingFee: "₹3,500 - ₹4,500",
      successFee: "10% - 15%",
      effort: "Surveyor liaison, FIR/accident reports, Garage coordination",
      color: "from-blue-500 to-cyan-500"
    },
    {
      type: "Life Insurance",
      icon: Users,
      processingFee: "₹4,000 - ₹5,000",
      successFee: "10% - 15%",
      effort: "Nominee disputes, Legal documentation, Death certificate verification",
      color: "from-purple-500 to-violet-500"
    },
    {
      type: "Travel Insurance",
      icon: Plane,
      processingFee: "₹3,000 - ₹3,500",
      successFee: "8% - 12%",
      effort: "International documentation, Embassy coordination",
      color: "from-teal-500 to-emerald-500"
    },
    {
      type: "Corporate Claims",
      icon: Building2,
      processingFee: "₹4,500 - ₹5,000",
      successFee: "12% - 18%",
      effort: "Complex commercial proceedings, Multiple stakeholders",
      color: "from-orange-500 to-amber-500"
    },
    {
      type: "Other Claims",
      icon: HelpCircle,
      processingFee: "₹3,000 - ₹5,000",
      successFee: "10% - 15%",
      effort: "Case-specific assessment and tailored approach",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const includedInProcessing = [
    "Complete case evaluation and strategy",
    "All documentation review and preparation",
    "Claim filing with insurance company",
    "Unlimited follow-ups and negotiations",
    "Escalation to IRDAI/Ombudsman if needed"
  ];

  const includedInSuccess = [
    "Legal representation in courts",
    "All court filings and appearances",
    "Advocate fees and legal advocacy",
    "Post-settlement support"
  ];

  const legalCapabilities = [
    { title: "IRDAI Grievance", desc: "Filing and representation before Insurance Regulatory Authority" },
    { title: "Insurance Ombudsman", desc: "Complete representation in Ombudsman proceedings" },
    { title: "Consumer Courts", desc: "District, State & National Consumer Forum cases" },
    { title: "High Court Appeals", desc: "Legal appeals when necessary through Odisha Judiciary" }
  ];

  const faqs = [
    {
      q: "What does the processing fee cover?",
      a: "The processing fee covers complete case evaluation, documentation preparation, claim filing, unlimited follow-ups with the insurance company, and escalation to regulatory bodies if needed."
    },
    {
      q: "Why do fees vary between ₹3,000 and ₹5,000?",
      a: "Fees vary based on case complexity, documentation requirements, number of parties involved, and the legal complexity of your specific claim type."
    },
    {
      q: "What if my case requires legal action?",
      a: "All legal costs including court filings, advocate fees, and appearances are included in the success fee. You pay nothing extra for legal proceedings."
    },
    {
      q: "What happens if my claim is rejected?",
      a: "If we're unable to get your claim approved, you only pay the processing fee. No success fee is charged for unsuccessful claims."
    },
    {
      q: "Can I get an exact fee quote before proceeding?",
      a: "Yes! Submit your claim for a free evaluation and we'll provide an exact quote based on your specific case details."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 pb-16 hero-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <BadgeCheck className="w-5 h-5" />
              <span className="text-sm font-medium">Pay Success Fee Only After Settlement</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Fair & Transparent Pricing
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              We believe in earning our fee. Pay a nominal processing fee upfront, 
              and success fee only after your claim is successfully settled.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
              <Scale className="w-5 h-5" />
              <span className="font-medium">Complete Legal Support Through Odisha Judiciary</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Processing Fee: ₹3,000 - ₹5,000
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                One-time fee based on your claim type and complexity. Success fee charged only after settlement.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pricingTiers.map((tier, index) => (
                <div 
                  key={index}
                  className="floating-card p-6 rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                    <tier.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">
                    {tier.type}
                  </h3>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground text-sm">Processing Fee</span>
                      <span className="font-semibold text-foreground">{tier.processingFee}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground text-sm">Success Fee</span>
                      <span className="font-semibold text-primary">{tier.successFee}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Effort:</span> {tier.effort}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              How Our Pricing Works
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Free Consultation", desc: "Submit your claim, we evaluate at zero cost", icon: FileCheck },
                { step: "2", title: "Processing Fee", desc: "₹3,000 - ₹5,000 based on case type", icon: IndianRupee },
                { step: "3", title: "We Fight For You", desc: "No additional charges during the process", icon: Shield },
                { step: "4", title: "Success Fee", desc: "Percentage only after settlement reaches your bank", icon: CheckCircle }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl hero-gradient flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm text-primary font-semibold mb-2">Step {item.step}</div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              What's Included
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="floating-card p-8 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">In Processing Fee</h3>
                </div>
                <ul className="space-y-3">
                  {includedInProcessing.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="floating-card p-8 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-success" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">In Success Fee</h3>
                </div>
                <ul className="space-y-3">
                  {includedInSuccess.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Capabilities */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                <Gavel className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Odisha Judiciary</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Complete Legal Support
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                All legal proceedings handled through Odisha Judiciary - included in your success fee
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {legalCapabilities.map((item, index) => (
                <div key={index} className="text-center p-6 rounded-2xl border border-border hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Gavel className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* No Hidden Charges */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-success/10 px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">100% Transparent</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
              No Hidden Charges Guarantee
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "No consultation fees",
                "No retainer fees",
                "No monthly charges",
                "No fees if unsuccessful"
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-center gap-2 p-4 rounded-xl bg-background border border-border">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="floating-card p-6 rounded-2xl">
                  <h3 className="font-display font-bold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 hero-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Get Your Free Case Evaluation
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Submit your claim today and receive an exact fee quote based on your specific case.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <Link to="/contact">Contact Us <ArrowRight className="w-4 h-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent border-white text-white hover:bg-white/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;