import { 
  Shield, 
  Clock, 
  Award, 
  Users, 
  Banknote, 
  HeadphonesIcon,
  BadgeCheck,
  Scale
} from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "95% Success Rate",
    description: "Our track record speaks for itself. 9 out of 10 cases we take up get resolved in favor of our clients.",
  },
  {
    icon: Banknote,
    title: "No Win, No Fee",
    description: "You only pay when we win your case. Zero upfront costs, zero risk for you.",
  },
  {
    icon: Scale,
    title: "Legal Expertise",
    description: "Team of ex-insurance professionals and lawyers who know the system inside out.",
  },
  {
    icon: Clock,
    title: "Fast Resolution",
    description: "Average case resolution in 60-90 days. No more waiting months for your rightful money.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Dedicated case manager and round-the-clock support via WhatsApp, call, or email.",
  },
  {
    icon: Shield,
    title: "100% Confidential",
    description: "Your documents and personal information are encrypted and completely secure with us.",
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary/50 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">
              Why Claim For Sure
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              India's Most Trusted{" "}
              <span className="text-primary">Claim Support</span> Platform
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We understand the frustration of a rejected claim. That's why we've 
              built a team of experts who fight relentlessly to get you what you deserve.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">10,000+ Happy Clients</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
                <Shield className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">ISO Certified</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
