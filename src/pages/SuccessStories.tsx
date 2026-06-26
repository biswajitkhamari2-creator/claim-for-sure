import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Star, 
  Quote, 
  IndianRupee, 
  Calendar, 
  Heart, 
  Car, 
  Users, 
  Plane,
  Building2,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Award
} from "lucide-react";

const SuccessStories = () => {
  const caseStudies = [
    {
      id: 1,
      name: "Rajesh Kumar",
      location: "Bhubaneswar, Odisha",
      claimType: "Health Insurance",
      icon: Heart,
      company: "Star Health Insurance",
      claimAmount: "₹4,85,000",
      timeline: "45 days",
      issue: "Claim rejected citing pre-existing condition for cardiac surgery despite policy covering it after waiting period",
      solution: "We proved the waiting period was completed and the condition was disclosed during policy purchase. Filed complaint with Insurance Ombudsman.",
      outcome: "Full claim amount recovered plus interest for delayed settlement",
      testimonial: "I had lost all hope after Star Health rejected my father's cardiac surgery claim. Claim For Sure not only got our full amount but also interest for the delay. Forever grateful!",
      rating: 5,
      color: "from-red-500 to-pink-500"
    },
    {
      id: 2,
      name: "Priya Mohanty",
      location: "Cuttack, Odisha",
      claimType: "Motor Insurance",
      icon: Car,
      company: "ICICI Lombard",
      claimAmount: "₹2,75,000",
      timeline: "30 days",
      issue: "Total loss claim denied stating the accident was due to drunk driving without any evidence",
      solution: "Obtained FIR, medical reports proving no alcohol involvement, and witness statements. Escalated to IRDAI.",
      outcome: "Complete settlement of total loss claim",
      testimonial: "The insurance company made false allegations about drunk driving. Claim For Sure fought for me and proved them wrong. Got my entire claim settled!",
      rating: 5,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      name: "Sunita Patel",
      location: "Sambalpur, Odisha",
      claimType: "Life Insurance",
      icon: Users,
      company: "LIC of India",
      claimAmount: "₹15,00,000",
      timeline: "90 days",
      issue: "Death claim rejected alleging non-disclosure of medical history by deceased husband",
      solution: "Gathered medical records proving the condition developed after policy purchase. Filed case in Consumer Court through Odisha Judiciary.",
      outcome: "Full sum assured plus compensation for mental harassment",
      testimonial: "After my husband's death, LIC rejected our claim saying he hid his illness. But he was healthy when he bought the policy. Claim For Sure proved this in court and we got ₹15 lakhs plus extra compensation.",
      rating: 5,
      color: "from-purple-500 to-violet-500"
    },
    {
      id: 4,
      name: "Amit Behera",
      location: "Rourkela, Odisha",
      claimType: "Health Insurance",
      icon: Heart,
      company: "New India Assurance",
      claimAmount: "₹3,20,000",
      timeline: "60 days",
      issue: "Cashless claim denied and reimbursement rejected for kidney stone surgery claiming it was cosmetic",
      solution: "Obtained detailed medical reports and expert opinion proving medical necessity. Filed Ombudsman complaint.",
      outcome: "Full reimbursement with 9% interest",
      testimonial: "They called my kidney surgery cosmetic! Can you believe it? Claim For Sure showed them the medical necessity and I got every rupee back with interest.",
      rating: 5,
      color: "from-emerald-500 to-teal-500"
    },
    {
      id: 5,
      name: "Deepak Mishra",
      location: "Berhampur, Odisha",
      claimType: "Travel Insurance",
      icon: Plane,
      company: "Bajaj Allianz",
      claimAmount: "₹1,85,000",
      timeline: "40 days",
      issue: "Medical emergency claim during Thailand trip rejected citing late intimation",
      solution: "Proved medical emergency prevented timely intimation and that hospital notified the insurance company's TPA.",
      outcome: "Complete claim settlement",
      testimonial: "I had a medical emergency in Thailand and was in ICU. How could I intimate on time? Claim For Sure understood this and got my claim approved.",
      rating: 5,
      color: "from-teal-500 to-cyan-500"
    },
    {
      id: 6,
      name: "Sanjay Industries Pvt Ltd",
      location: "Angul, Odisha",
      claimType: "Corporate Insurance",
      icon: Building2,
      company: "United India Insurance",
      claimAmount: "₹45,00,000",
      timeline: "120 days",
      issue: "Fire insurance claim for factory damage significantly undervalued by surveyor",
      solution: "Appointed independent surveyor, gathered inventory records, and challenged the assessment. Filed case in State Consumer Commission.",
      outcome: "Claim amount increased from ₹18 lakhs to ₹45 lakhs",
      testimonial: "The surveyor valued our factory damage at just ₹18 lakhs when actual loss was ₹50+ lakhs. Claim For Sure fought in court and we got ₹45 lakhs. They saved our business!",
      rating: 5,
      color: "from-orange-500 to-amber-500"
    }
  ];

  const stats = [
    { value: "₹12+ Cr", label: "Total Claims Recovered" },
    { value: "2,500+", label: "Successful Cases" },
    { value: "89%", label: "Success Rate" },
    { value: "45 Days", label: "Average Resolution" }
  ];

  const additionalTestimonials = [
    {
      name: "Meera Sahoo",
      location: "Puri, Odisha",
      text: "My health claim was stuck for 8 months. Within 30 days of approaching Claim For Sure, I got my ₹2.5 lakh claim settled!",
      rating: 5
    },
    {
      name: "Ramesh Nayak",
      location: "Balasore, Odisha",
      text: "Professional team, transparent process. They kept me updated at every step. Highly recommend for any insurance claim issues.",
      rating: 5
    },
    {
      name: "Kavita Jena",
      location: "Jharsuguda, Odisha",
      text: "After my husband's accidental death, the insurance company was making excuses. Claim For Sure helped us get justice and the full claim amount.",
      rating: 5
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
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Real Cases, Real Results</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Success Stories
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Read how we have helped thousands of policyholders recover their rightful insurance claims 
              through the Odisha Judiciary and regulatory bodies.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Detailed Case Studies
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Real cases from Odisha where we successfully recovered rejected insurance claims
              </p>
            </div>

            <div className="space-y-8">
              {caseStudies.map((caseStudy, index) => (
                <div 
                  key={caseStudy.id}
                  className="floating-card rounded-2xl overflow-hidden"
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${caseStudy.color} p-6 text-white`}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <caseStudy.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-display text-xl font-bold">{caseStudy.name}</h3>
                          <p className="text-sm opacity-90">{caseStudy.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm opacity-80">Claim Amount</div>
                          <div className="text-2xl font-bold">{caseStudy.claimAmount}</div>
                        </div>
                        <div className="text-right hidden sm:block">
                          <div className="text-sm opacity-80">Resolution Time</div>
                          <div className="text-lg font-semibold">{caseStudy.timeline}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-muted-foreground">Claim Type:</span>
                        <span className="font-medium text-foreground">{caseStudy.claimType}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-muted-foreground">Insurance Company:</span>
                        <span className="font-medium text-foreground">{caseStudy.company}</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center text-xs text-destructive">✕</span>
                          The Problem
                        </h4>
                        <p className="text-muted-foreground text-sm pl-8">{caseStudy.issue}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">⚡</span>
                          Our Solution
                        </h4>
                        <p className="text-muted-foreground text-sm pl-8">{caseStudy.solution}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                          <CheckCircle className="w-6 h-6 text-success" />
                          The Outcome
                        </h4>
                        <p className="text-success font-medium text-sm pl-8">{caseStudy.outcome}</p>
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-muted/50 rounded-xl p-4 relative">
                      <Quote className="w-8 h-8 text-primary/20 absolute top-4 left-4" />
                      <p className="text-foreground italic pl-8 pr-4">"{caseStudy.testimonial}"</p>
                      <div className="flex items-center gap-1 mt-3 pl-8">
                        {[...Array(caseStudy.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              What Our Clients Say
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {additionalTestimonials.map((testimonial, index) => (
                <div key={index} className="floating-card p-6 rounded-2xl">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  </div>
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
            <TrendingUp className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Your Success Story is Next
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join thousands of satisfied customers who got their rightful claims. 
              Submit your case today for a free evaluation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <Link to="/contact">Contact Us <ArrowRight className="w-4 h-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent border-white text-white hover:bg-white/10">
                <Link to="/contact">Talk to an Expert</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SuccessStories;