import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight">
                  Claim For Sure
                </span>
                <span className="text-[10px] opacity-80 leading-tight">
                  We fight for your rights
                </span>
              </div>
            </Link>
            <p className="text-sm opacity-80 mb-4">
              India's trusted platform for rejected insurance claim resolution. 
              We help you get what's rightfully yours.
            </p>
            <div className="p-3 bg-white/10 rounded-lg text-sm">
              <p className="font-medium text-amber-300">⚠️ Important Notice</p>
              <p className="opacity-80 mt-1">We operate ONLY via Email & Phone. No social media accounts.</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/claims" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Claim Types
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Claim Types */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Claim Types</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/claims/health" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Health Insurance
                </Link>
              </li>
              <li>
                <Link to="/claims/motor" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Motor Insurance
                </Link>
              </li>
              <li>
                <Link to="/claims/life" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Life Insurance
                </Link>
              </li>
              <li>
                <Link to="/claims/travel" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Travel Insurance
                </Link>
              </li>
              <li>
                <Link to="/claims/corporate" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Corporate Insurance
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 opacity-80" />
                <span className="text-sm opacity-80">
                  123 Business Park, Sector 15,<br />
                  Gurugram, Haryana 122001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 opacity-80" />
                <div className="flex flex-col">
                  <a href="tel:+919438463174" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                    +91 94384 63174
                  </a>
                  <a href="tel:+919439572073" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                    +91 94395 72073
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 opacity-80" />
                <a href="mailto:support@claimforsure.in" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  support@claimforsure.in
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-80">
            <p>© 2024 Claim For Sure. All rights reserved.</p>
            <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
              <Link to="/privacy" className="hover:opacity-100 transition-opacity">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:opacity-100 transition-opacity">
                Terms & Conditions
              </Link>
              <Link to="/disclaimer" className="hover:opacity-100 transition-opacity">
                Disclaimer
              </Link>
              <Link to="/refund" className="hover:opacity-100 transition-opacity">
                Refund Policy
              </Link>
              <Link to="/admin-login" className="hover:opacity-100 transition-opacity">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;