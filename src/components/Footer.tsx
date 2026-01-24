import { Twitter, Linkedin, Github } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="WavexFlow Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-extrabold">WavexFlow</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              A curated marketplace connecting ambitious builders with high-performance digital assets.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6">Marketplace</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/tools" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  Browse Tools
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/ai" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  AI Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/privacy" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 text-center">
          <p className="text-sm text-primary-foreground/60">
            © 2025 WavexFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
