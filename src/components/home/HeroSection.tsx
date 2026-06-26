import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, MessageCircle, Shield, CheckCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {

  return (
    <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 indian-pattern opacity-30" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-success/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 pt-24 lg:pt-32 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm text-white/90 font-medium">
                Trusted by 10,000+ Indians
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Insurance Claim{" "}
              <span className="text-accent">Rejected?</span>
              <br />
              We'll Fight For You.
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
              Don't give up on your rightful claim. Our experts have helped recover 
              <span className="text-accent font-semibold"> ₹50+ Crore </span> 
              in rejected insurance claims across India.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Button variant="hero" size="xl" asChild className="group">
                <a href="https://wa.me/919438463174" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Us
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="tel:+919438463174">
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              </Button>
            </div>

            {/* No Bot Message */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <span className="text-white font-semibold text-lg">🎯 Connect directly to our Claim Fighter — No Bot! 🤝</span>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm">Free Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm">No Win, No Fee*</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm">95% Success Rate</span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="relative lg:flex lg:flex-col lg:items-end gap-6">
            <div className="glass-card rounded-2xl p-8 lg:p-10 max-w-md mx-auto lg:mx-0 animate-fade-in">
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                Our Impact So Far
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-secondary/50 rounded-xl">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">₹50Cr+</div>
                  <div className="text-sm text-muted-foreground">Claims Recovered</div>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-xl">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">10K+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-xl">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">95%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-xl">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">50+</div>
                  <div className="text-sm text-muted-foreground">Expert Team</div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">🎯 Connect directly to our Claim Fighter — No Bot! 🤝</p>
                <a 
                  href="tel:+919438463174" 
                  className="flex items-center gap-3 p-3 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 hero-gradient rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">+91 94384 63174 / +91 94395 72073</div>
                    <div className="text-xs text-muted-foreground">Available 24/7</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Register New Claim Button */}
            <Button 
              asChild 
              size="lg" 
              className="w-full max-w-md mx-auto lg:mx-0 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <Link to="/auth?mode=signup">
                <FileText className="w-5 h-5 mr-2" />
                Register New Claim
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="hsl(var(--background))"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;