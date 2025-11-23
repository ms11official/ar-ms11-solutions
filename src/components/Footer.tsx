import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              AR-MS11
            </h3>
            <p className="text-muted-foreground text-sm">
              Next-generation technology platform for modern businesses.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors group">
                <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors group">
                <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors group">
                <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2024 AR-MS11. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
