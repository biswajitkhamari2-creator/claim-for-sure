import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Mumbai, Maharashtra",
    claimType: "Health Insurance",
    amount: "₹4,50,000",
    review: "My health claim was rejected for 'pre-existing condition'. Claim For Sure team fought with the insurer and got my full claim approved in just 45 days. Highly recommended!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    location: "Delhi NCR",
    claimType: "Motor Insurance",
    amount: "₹2,80,000",
    review: "After my car accident, the insurance company was giving me only partial settlement. These experts helped me get the complete amount I deserved. Thank you team!",
    rating: 5,
  },
  {
    name: "Mohammed Ismail",
    location: "Bangalore, Karnataka",
    claimType: "Life Insurance",
    amount: "₹15,00,000",
    review: "My father's life insurance claim was stuck for 2 years. Claim For Sure took the case to ombudsman and we finally got justice. God bless this team.",
    rating: 5,
  },
  {
    name: "Sunita Patel",
    location: "Ahmedabad, Gujarat",
    claimType: "Health Insurance",
    amount: "₹6,20,000",
    review: "Hospital bill claim was rejected saying treatment was not necessary. The legal team here proved otherwise and I received my full reimbursement.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">
            Success Stories
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Real People, Real Results
          </h2>
          <p className="text-lg text-muted-foreground">
            Thousands of Indians have trusted us to fight their rejected claims. 
            Here's what some of them have to say.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-6 lg:p-8 relative overflow-hidden group hover:shadow-lg transition-shadow"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Review */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.review}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">
                    {testimonial.claimType}
                  </div>
                  <div className="text-lg font-bold text-success">
                    {testimonial.amount}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="mt-12 lg:mt-16 bg-primary rounded-2xl p-8 lg:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">₹50Cr+</div>
              <div className="text-primary-foreground/80 text-sm">Total Claims Recovered</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-primary-foreground/80 text-sm">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-primary-foreground/80 text-sm">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">60 Days</div>
              <div className="text-primary-foreground/80 text-sm">Avg. Resolution Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
