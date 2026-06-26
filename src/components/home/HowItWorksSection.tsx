import { FileText, Search, Scale, CheckCircle2, FileCheck, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Submit Your Claim",
    description: "Users submit their details, insurance information, and upload all supporting documents through the website.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Search,
    step: "02",
    title: "Expert Review",
    description: "Our internal claim team reviews the policy, documents, and the reason for claim rejection, delay, or dispute.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Scale,
    step: "03",
    title: "Case Evaluation",
    description: "We evaluate the claim honestly and inform the user about the strength of the case and possible next steps.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: FileCheck,
    step: "04",
    title: "Documentation Support",
    description: "We organize documents and prepare proper representations and claim structure.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: MessageSquare,
    step: "05",
    title: "Resolution Guidance",
    description: "We assist users with insurer communication, escalation, and professional handling wherever required.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: CheckCircle2,
    step: "06",
    title: "Claim Closure",
    description: "Users are regularly updated until the claim is resolved or officially closed.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">
            Simple Process
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Getting your rejected claim resolved is easy. Follow these 4 simple steps 
            and let our experts handle the rest.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="relative bg-card border border-border rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 ${step.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <step.icon className={`w-7 h-7 ${step.color}`} />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
