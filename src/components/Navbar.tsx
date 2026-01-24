import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="WavexFlow Logo" className="w-10 h-10 object-contain group-hover:rotate-6 transition-transform" />
            <span className="text-primary text-xl font-extrabold tracking-tight">WavexFlow</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('services')} 
              className="text-sm font-semibold text-muted-foreground hover:text-accent transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('tools')} 
              className="text-sm font-semibold text-muted-foreground hover:text-accent transition-colors"
            >
              Tools
            </button>
            <button 
              onClick={() => scrollToSection('ai-section')} 
              className="text-sm font-semibold text-muted-foreground hover:text-accent transition-colors"
            >
              AI Tools
            </button>
          </nav>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-sm mx-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            className="w-full pl-10 pr-4 py-2 bg-secondary border-transparent rounded-lg focus:bg-card focus:ring-2 focus:ring-accent transition-all text-sm" 
            placeholder="Search for tools or services..."
          />
        </div>
        
        <div className="flex items-center gap-4 lg:gap-6">
          <Link to="/dashboard">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-xl shadow-md flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              Dashboard
            </Button>
          </Link>
          <div className="h-6 w-px bg-border"></div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" className="rounded-lg font-semibold">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="rounded-lg font-semibold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
