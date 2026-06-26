import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  FileText, 
  Search, 
  Scale, 
  CheckCircle2, 
  FileCheck, 
  MessageSquare,
  ArrowRight,
  Clock,
  Shield,
  Users,
  Phone
} from "lucide-react";

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Submit Your Claim",
    description: "Users submit their details, insurance information, and upload all supporting documents through the website.",
    details: [
      "Fill out our simple online form with your personal details",
      "Upload your policy documents and rejection letter",
      "Provide claim-related documents and evidence",
      "Takes just 5-10 minutes to complete"
    ],
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary",
  },
  {
    icon: Search,
    step: "02",
    title: "Expert Review",
    description: "Our internal claim team reviews the policy, documents, and the reason for claim rejection, delay, or dispute.",
    details: [
      "Dedicated claim expert assigned to your case",
      "Thorough analysis of policy terms and conditions",
      "Review of rejection reasons and insurer's stance",
      "Identification of grounds for appeal"
    ],
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent",
  },
  {
    icon: Scale,
    step: "03",
    title: "Case Evaluation",
    description: "We evaluate the claim honestly and inform the user about the strength of the case and possible next steps.",
    details: [
      "Honest assessment of your claim's merit",
      "Clear explanation of success probability",
      "Discussion of available legal options",
      "Transparent communication about timelines"
    ],
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success",
  },
  {
    icon: FileCheck,
    step: "04",
    title: "Documentation Support",
    description: "We organize documents and prepare proper representations and claim structure.",
    details: [
      "Professional drafting of appeal letters",
      "Organization of supporting evidence",
      "Preparation of legal representations",
      "Compliance with regulatory requirements"
    ],
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary",
  },
  {
    icon: MessageSquare,
    step: "05",
    title: "Resolution Guidance",
    description: "We assist users with insurer communication, escalation, and professional handling wherever required.",
    details: [
      "Direct communication with insurance companies",
      "Escalation to IRDAI or Ombudsman if needed",
      "Consumer court representation guidance",
      "Professional negotiation on your behalf"
    ],
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent",
  },
  {
    icon: CheckCircle2,
    step: "06",
    title: "Claim Closure",
    description: "Users are regularly updated until the claim is resolved or officially closed.",
    details: [
      "Regular status updates via email and SMS",
      "Complete transparency throughout the process",
      "Final settlement assistance",
      "Post-resolution support if needed"
    ],
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success",
  },
];

const faqs = [
  {
    question: "How long does the claim resolution process take?",
    answer: "The timeline varies depending on the complexity of the case and the insurance company involved. Simple cases may be resolved in 2-4 weeks, while complex cases involving legal proceedings may take 3-6 months. We keep you updated at every step."
  },
  {
    question: "What documents do I need to submit?",
    answer: "You'll need your insurance policy document, claim rejection letter, all correspondence with the insurer, medical/repair bills (as applicable), and any other supporting documents. Our team will guide you if additional documents are required."
  },
  {
    question: "Is there any upfront fee to submit my claim?",
    answer: "We operate on a 'No Win, No Fee' model for most cases. You only pay when your claim is successfully resolved. Specific terms will be discussed during case evaluation."
  },
  {
    question: "What if my claim has already been rejected multiple times?",
    answer: "Multiple rejections don't necessarily mean your case is hopeless. We've successfully resolved many cases that were rejected 2-3 times. Our experts can find new angles and grounds for appeal."
  },
  {
    question: "Do you handle all types of insurance claims?",
    answer: "Yes, we handle Health Insurance, Motor Insurance, Life Insurance, Travel Insurance, Corporate Insurance, and other general insurance claims. Each type has specialized experts on our team."
  },
  {
    question: "Will I need to visit your office?",
    answer: "No physical visit is required. Our entire process is online. You can submit documents digitally, and our team communicates via phone, email, and video calls as needed."
  },
  {
    question: "What happens if my case goes to consumer court?",
    answer: "We provide complete guidance for consumer court proceedings, including documentation, representation advice, and connecting you with legal experts if needed. Most cases are resolved before reaching this stage."
  },
  {
    question: "How do I track my claim status?",
    answer: "You'll receive regular updates via email and SMS. You can also contact our support team anytime for status updates. We believe in complete transparency throughout the process."
  },
];

const stats = [
  { icon: Users, value: "15,000+", label: "Happy Clients" },
  { icon: CheckCircle2, value: "₹50 Cr+", label: "Claims Recovered" },
  { icon: Clock, value: "24 Hours", label: "Response Time" },
  { icon: Shield, value: "95%", label: "Success Rate" },
];

const HowItWorks = () => {

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 lg:pt-32">
        {/* Hero Section */}
        <section className="py-12 lg:py-20 hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 indian-pattern opacity-20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <span className="inline-block text-white/80 font-semibold text-sm uppercase tracking-wider mb-4">
                Our Process
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                How Claim For Sure Works
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                A simple 6-step process to fight for your rightful insurance claim. 
                Let our experts handle the complexity while you focus on what matters.
              </p>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/contact">
                  Contact Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
              <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">
                Step by Step
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Our 6-Step Process
              </h2>
              <p className="text-lg text-muted-foreground">
                From submission to resolution, we guide you through every step of reclaiming what's rightfully yours.
              </p>
            </div>

            {/* Visual Timeline */}
            <div className="max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="relative flex gap-6 pb-12 last:pb-0">
                  {/* Timeline Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-7 top-16 w-0.5 h-[calc(100%-4rem)] bg-gradient-to-b from-border to-transparent" />
                  )}

                  {/* Step Number Circle */}
                  <div className={`relative z-10 flex-shrink-0 w-14 h-14 rounded-full ${step.bgColor} border-2 ${step.borderColor} flex items-center justify-center`}>
                    <step.icon className={`w-6 h-6 ${step.color}`} />
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-sm font-bold ${step.color}`}>Step {step.step}</span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">
                Got Questions?
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about our claim resolution process.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:text-primary py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to Fight for Your Claim?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Don't let insurance companies deny what's rightfully yours. 
                Submit your claim today and let our experts take over.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/contact">
                    Contact Us
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link to="/contact">
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;