import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src={logo} alt="AR-MS7 Logo" className="w-8 h-8 object-contain" />
            <h2 className="text-lg font-bold">AR-MS7</h2>
          </div>

          <nav className="hidden md:flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <button onClick={() => scrollToSection('services')} className="text-sm font-medium hover:text-primary transition-colors">
                Services
              </button>
              <button onClick={() => scrollToSection('ai-section')} className="text-sm font-medium hover:text-primary transition-colors">
                AI
              </button>
              <button onClick={() => scrollToSection('tools')} className="text-sm font-medium hover:text-primary transition-colors">
                Tools
              </button>
              <Button onClick={() => window.location.href = '/signup'} className="rounded-lg">
                Get Started
              </Button>
              <Button onClick={() => window.location.href = '/login'} variant="outline" className="rounded-lg">
                Login
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
