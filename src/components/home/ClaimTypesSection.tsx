import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Car, 
  HeartPulse, 
  Plane, 
  Building2,
  ArrowRight,
  MessageCircle
} from "lucide-react";

const claimTypes = [
  {
    icon: Heart,
    title: "Health Insurance Claims",
    description: "Hospitalization rejection, Cashless denial, Partial settlement, Delay in reimbursement, Pre-existing disease disputes.",
    claims: "4,500+ claims resolved",
    href: "/claims/health",
    gradient: "from-red-500 to-pink-500",
  },
  {
    icon: Car,
    title: "Motor Insurance Claims",
    description: "Car and bike accident claims, Repair cost disputes, Zero depreciation issues, Total loss and theft claims.",
    claims: "3,200+ claims resolved",
    href: "/claims/motor",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: HeartPulse,
    title: "Life Insurance Claims",
    description: "Death claim rejection, Nominee disputes, Policy investigation delays, Maturity claim issues.",
    claims: "2,100+ claims resolved",
    href: "/claims/life",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: Plane,
    title: "Travel Insurance Claims",
    description: "Medical emergencies, Trip cancellation, Baggage loss, Flight delay disputes.",
    claims: "1,800+ claims resolved",
    href: "/claims/travel",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Building2,
    title: "Corporate & Commercial Claims",
    description: "Group health insurance, Fire and marine insurance, Shop and factory insurance, Professional indemnity claims.",
    claims: "900+ claims resolved",
    href: "/claims/corporate",
    gradient: "from-amber-500 to-orange-500",
  },
];

const ClaimTypesSection = () => {

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">
            We Handle All Types
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Types of Claims We Fight
          </h2>
          <p className="text-lg text-muted-foreground">
            No matter what type of insurance claim was rejected, our expert team 
            knows how to get your money back.
          </p>
        </div>

        {/* Claim Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {claimTypes.map((claim, index) => (
            <Link
              key={index}
              to={claim.href}
              className="group bg-card border border-border rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${claim.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <claim.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {claim.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {claim.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-success bg-success/10 px-3 py-1 rounded-full">
                  {claim.claims}
                </span>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="hero" size="lg" asChild>
            <a href="https://wa.me/919439572073" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Us on WhatsApp
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ClaimTypesSection;