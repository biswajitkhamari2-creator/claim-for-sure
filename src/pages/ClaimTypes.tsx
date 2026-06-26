import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Heart, 
  Car, 
  HeartPulse, 
  Plane, 
  Building2,
  ArrowRight,
  Shield,
  CheckCircle2,
  FileText,
  Clock,
  Users,
  IndianRupee,
  Briefcase,
  Home,
  Factory,
  Ship,
  Flame,
  Scale,
  Baby,
  Stethoscope,
  Ambulance,
  CreditCard,
  Umbrella,
  Luggage,
  PlaneTakeoff,
  AlertTriangle,
  HardHat,
  Building,
  FileCheck
} from "lucide-react";

const claimCategories = [
  {
    id: "health",
    icon: Heart,
    title: "Health Insurance Claims",
    gradient: "from-red-500 to-pink-500",
    bgGradient: "from-red-50 to-pink-50",
    description: "We specialize in resolving complex health insurance disputes including hospitalization rejections, cashless denials, and reimbursement delays. Our team understands IRDAI guidelines and hospital network protocols.",
    stats: { resolved: "4,500+", successRate: "89%", avgRecovery: "₹2.8L" },
    subTypes: [
      { icon: Ambulance, title: "Hospitalization Claim Rejection", desc: "Policy exclusions misapplied, documentation gaps, or procedural errors leading to claim denial" },
      { icon: CreditCard, title: "Cashless Claim Denial", desc: "Network hospital disputes, pre-authorization failures, or TPA coordination issues" },
      { icon: FileText, title: "Partial Settlement Disputes", desc: "Insurer paying less than actual expenses citing room rent limits, co-pay clauses, or treatment protocols" },
      { icon: Clock, title: "Reimbursement Delays", desc: "Excessive processing time beyond IRDAI mandated turnaround periods" },
      { icon: Stethoscope, title: "Pre-existing Disease Disputes", desc: "Claims rejected citing undisclosed or pre-existing conditions requiring medical evidence review" },
      { icon: Baby, title: "Maternity & Critical Illness", desc: "Specialized claims for childbirth expenses and critical illness coverage disputes" },
    ],
    companies: ["Star Health", "ICICI Lombard", "Bajaj Allianz", "HDFC Ergo", "New India Assurance", "Max Bupa", "Care Health", "Niva Bupa"]
  },
  {
    id: "motor",
    icon: Car,
    title: "Motor Insurance Claims",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    description: "From minor accidents to total loss claims, we handle all motor insurance disputes for cars, two-wheelers, and commercial vehicles. Expert assessment of surveyor reports and IDV calculations.",
    stats: { resolved: "3,200+", successRate: "92%", avgRecovery: "₹1.5L" },
    subTypes: [
      { icon: Car, title: "Accident & Collision Claims", desc: "Own damage claims for accidents, collisions, and road mishaps for all vehicle types" },
      { icon: IndianRupee, title: "Repair Cost Disputes", desc: "Disagreements over repair estimates, part replacements, and labor charges" },
      { icon: FileCheck, title: "Zero Depreciation Issues", desc: "Full part replacement claims under zero-dep add-on policies" },
      { icon: AlertTriangle, title: "Total Loss & Constructive Loss", desc: "Vehicle write-off claims where repair cost exceeds IDV threshold" },
      { icon: Shield, title: "Theft Claims", desc: "Complete vehicle theft or part theft claims requiring police verification" },
      { icon: Scale, title: "Third-Party Liability", desc: "Compulsory third-party claims for injury or damage to others" },
    ],
    companies: ["ICICI Lombard", "Bajaj Allianz", "HDFC Ergo", "New India Assurance", "Oriental Insurance", "United India", "National Insurance", "Reliance General"]
  },
  {
    id: "life",
    icon: HeartPulse,
    title: "Life Insurance Claims",
    gradient: "from-emerald-500 to-green-500",
    bgGradient: "from-emerald-50 to-green-50",
    description: "Life insurance claims are often rejected during the most difficult times for families. We help navigate complex policy terms, investigation procedures, and nominee disputes with sensitivity and expertise.",
    stats: { resolved: "2,100+", successRate: "85%", avgRecovery: "₹12.5L" },
    subTypes: [
      { icon: HeartPulse, title: "Death Claim Rejection", desc: "Claims denied due to policy lapses, exclusion clauses, or alleged non-disclosure" },
      { icon: Users, title: "Nominee Disputes", desc: "Multiple claimants, legal heir verification, and beneficiary conflicts" },
      { icon: Clock, title: "Investigation Delays", desc: "Extended claim investigations beyond reasonable timeframes" },
      { icon: IndianRupee, title: "Maturity Claim Issues", desc: "Endowment and money-back policy maturity benefit disputes" },
      { icon: FileText, title: "Surrender Value Disputes", desc: "Disagreements over policy surrender values and bonus calculations" },
      { icon: Scale, title: "ULIP & Pension Claims", desc: "Unit-linked and pension plan redemption or death benefit claims" },
    ],
    companies: ["LIC of India", "ICICI Prudential", "HDFC Life", "SBI Life", "Max Life", "Bajaj Allianz Life", "Tata AIA", "Kotak Life"]
  },
  {
    id: "travel",
    icon: Plane,
    title: "Travel Insurance Claims",
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-50 to-purple-50",
    description: "Travel mishaps shouldn't leave you stranded financially. We handle international and domestic travel insurance claims for medical emergencies, trip disruptions, and baggage issues.",
    stats: { resolved: "1,800+", successRate: "88%", avgRecovery: "₹85K" },
    subTypes: [
      { icon: Ambulance, title: "Overseas Medical Emergency", desc: "Emergency hospitalization, evacuation, and medical expenses abroad" },
      { icon: PlaneTakeoff, title: "Trip Cancellation", desc: "Non-refundable trip costs due to covered cancellation reasons" },
      { icon: Luggage, title: "Baggage Loss & Delay", desc: "Lost, damaged, or delayed luggage compensation claims" },
      { icon: Clock, title: "Flight Delay Compensation", desc: "Additional expenses due to significant flight delays" },
      { icon: FileText, title: "Passport & Document Loss", desc: "Emergency document replacement and related expenses" },
      { icon: Shield, title: "Personal Liability Claims", desc: "Third-party injury or property damage during travel" },
    ],
    companies: ["ICICI Lombard", "Bajaj Allianz", "HDFC Ergo", "Tata AIG", "Reliance General", "Care Insurance", "Digit Insurance", "Go Digit"]
  },
  {
    id: "corporate",
    icon: Building2,
    title: "Corporate & Commercial Insurance",
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50",
    description: "Business insurance claims require specialized expertise. We assist enterprises with property damage, liability claims, and employee benefit disputes to minimize business interruption.",
    stats: { resolved: "900+", successRate: "91%", avgRecovery: "₹45L" },
    subTypes: [
      { icon: Users, title: "Group Health Insurance", desc: "Employee medical claims, sum insured disputes, and coverage issues" },
      { icon: Flame, title: "Fire Insurance Claims", desc: "Property damage from fire, lightning, explosion, and allied perils" },
      { icon: Ship, title: "Marine Insurance Claims", desc: "Cargo damage, transit losses, and marine hull claims" },
      { icon: Factory, title: "Industrial All-Risk", desc: "Manufacturing unit and machinery breakdown coverage claims" },
      { icon: Briefcase, title: "Professional Indemnity", desc: "Professional liability and errors & omissions claims" },
      { icon: Building, title: "Property & Burglary", desc: "Commercial property damage, theft, and burglary claims" },
    ],
    companies: ["New India Assurance", "Oriental Insurance", "United India", "National Insurance", "ICICI Lombard", "Bajaj Allianz", "HDFC Ergo", "Tata AIG"]
  },
  {
    id: "other",
    icon: Umbrella,
    title: "Other Insurance Claims",
    gradient: "from-slate-500 to-gray-600",
    bgGradient: "from-slate-50 to-gray-50",
    description: "Beyond standard categories, we handle specialized insurance products including home insurance, personal accident, cyber insurance, and agriculture claims with domain expertise.",
    stats: { resolved: "600+", successRate: "86%", avgRecovery: "₹3.2L" },
    subTypes: [
      { icon: Home, title: "Home Insurance Claims", desc: "Structure and contents damage from natural disasters, theft, or accidents" },
      { icon: HardHat, title: "Personal Accident Claims", desc: "Accidental death, disability, and medical expense coverage" },
      { icon: Shield, title: "Cyber Insurance", desc: "Data breach, ransomware, and cyber fraud coverage claims" },
      { icon: Factory, title: "Agriculture Insurance", desc: "Crop insurance and livestock coverage under PMFBY schemes" },
      { icon: Briefcase, title: "Directors & Officers", desc: "D&O liability claims for corporate leadership" },
      { icon: Scale, title: "Legal Expense Insurance", desc: "Legal defense cost coverage claims" },
    ],
    companies: ["All Major Insurers", "Specialized Underwriters", "Reinsurance Companies"]
  },
];

const ClaimTypes = () => {

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 dashboard-bg relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Comprehensive Insurance Claim Support
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              We Handle <span className="text-gradient-hero">All Types</span> of Insurance Claims
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              From health to life, motor to travel, and corporate insurance — our expert team 
              has successfully resolved over 12,500+ claims across all categories.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { value: "12,500+", label: "Claims Resolved" },
                { value: "89%", label: "Success Rate" },
                { value: "₹150Cr+", label: "Amount Recovered" },
                { value: "50+", label: "Insurance Companies" },
              ].map((stat, i) => (
                <div key={i} className="floating-stat p-4">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Claim Categories */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {claimCategories.map((category, index) => (
            <div 
              key={category.id} 
              id={category.id}
              className={`mb-16 lg:mb-24 scroll-mt-24 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Category Header */}
              <div className={`floating-card p-8 lg:p-10 mb-8 bg-gradient-to-br ${category.bgGradient}`}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-xl flex-shrink-0`}>
                    <category.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      {category.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex gap-4 lg:gap-6 flex-wrap">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{category.stats.resolved}</div>
                      <div className="text-xs text-muted-foreground">Resolved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">{category.stats.successRate}</div>
                      <div className="text-xs text-muted-foreground">Success</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{category.stats.avgRecovery}</div>
                      <div className="text-xs text-muted-foreground">Avg. Recovery</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Types Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
                {category.subTypes.map((subType, i) => (
                  <div 
                    key={i} 
                    className="group bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <subType.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {subType.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {subType.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Companies We Deal With */}
              <div className="bg-muted/30 rounded-xl p-4 lg:p-6">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Insurance Companies We Successfully Deal With:
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.companies.map((company, i) => (
                    <span 
                      key={i} 
                      className="bg-white border border-border px-3 py-1.5 rounded-lg text-sm text-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us for Claims */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Trust Us With Your Claim?
            </h2>
            <p className="text-muted-foreground">
              Our specialized approach ensures maximum recovery for every type of insurance claim.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: "Expert Documentation", desc: "We prepare bulletproof claim files that insurers cannot reject on technicalities" },
              { icon: Scale, title: "Legal Expertise", desc: "Our team includes insurance law specialists familiar with IRDAI regulations" },
              { icon: Clock, title: "Fast Resolution", desc: "Average claim resolution time of 45-90 days depending on complexity" },
              { icon: CheckCircle2, title: "No Win, Low Fee", desc: "Transparent pricing with success-based fee structure" },
            ].map((item, i) => (
              <div key={i} className="floating-card p-6 text-center">
                <div className="w-14 h-14 rounded-xl hero-gradient flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 hero-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
            Have a Rejected or Delayed Claim?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
            Don't let insurance companies keep what's rightfully yours. Submit your claim today 
            and let our experts fight for your recovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl" asChild>
              <Link to="/contact">
                Contact Us Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link to="/how-it-works">
                Learn How It Works
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ClaimTypes;