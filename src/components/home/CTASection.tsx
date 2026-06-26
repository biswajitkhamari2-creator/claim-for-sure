import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";

const CTASection = () => {

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative hero-gradient rounded-3xl p-8 lg:p-16 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 indian-pattern opacity-20" />
          
          {/* Decorative Blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-success/20 rounded-full blur-3xl" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Don't Let Your Claim Die.{" "}
              <span className="text-accent">Fight Back Today!</span>
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Every day you wait, your chances of recovery decrease. 
              Submit your claim now and let our experts take over.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button variant="hero" size="xl" asChild className="group">
                <a href="https://wa.me/919439572073" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Us
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="tel:+919439572073">
                  <Phone className="w-5 h-5" />
                  Call: +91 94395 72073 / 94384 63174
                </a>
              </Button>
            </div>

            {/* No Bot Message */}
            <div className="flex items-center justify-center gap-2 text-white font-medium mb-4">
              <span className="text-xl">🎯</span>
              <span>Connect directly to our Claim Fighter — No Bot! 🤝</span>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center justify-center gap-2 text-white/80">
              <MessageCircle className="w-5 h-5" />
              <span>Or WhatsApp us at</span>
              <a 
                href="https://wa.me/919439572073" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent font-semibold hover:underline"
              >
                +91 94395 72073
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;