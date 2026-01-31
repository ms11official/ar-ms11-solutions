import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ChevronRight } from "lucide-react";
import NotesSection from "./NotesSection";
import PromptsSection from "./PromptsSection";
import MindmapsSection from "./MindmapsSection";

interface Tool {
  id: string;
  name: string;
  description: string | null;
  category: string;
  image_url: string | null;
  link: string | null;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: string;
  image_url: string | null;
}

const Hero = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [toolsRes, servicesRes] = await Promise.all([
        supabase.from("tools").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(3),
        supabase.from("services").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(4),
      ]);
      
      if (toolsRes.data) {
        setTools(toolsRes.data);
        const uniqueCategories = Array.from(new Set(toolsRes.data.map(t => t.category)));
        setCategories(uniqueCategories.slice(0, 4));
      }
      if (servicesRes.data) setServices(servicesRes.data);
    };
    fetchData();
  }, []);

  const getIconBgColor = (index: number) => {
    const colors = [
      'bg-indigo-50 text-indigo-600',
      'bg-amber-50 text-amber-600',
      'bg-emerald-50 text-emerald-600',
      'bg-blue-50 text-blue-600',
      'bg-pink-50 text-pink-600',
      'bg-purple-50 text-purple-600',
      'bg-cyan-50 text-cyan-600',
      'bg-rose-50 text-rose-600',
    ];
    return colors[index % colors.length];
  };

  const getIconName = (index: number) => {
    const icons = ['monitoring', 'token', 'auto_awesome', 'terminal', 'brush', 'search_check', 'auto_fix_high', 'psychology'];
    return icons[index % icons.length];
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-20">
        <div className="relative bg-primary rounded-[2.5rem] overflow-hidden min-h-[540px] flex items-center shadow-2xl shadow-muted">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-accent rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-accent rounded-full blur-[120px]"></div>
          </div>
          <div className="grid lg:grid-cols-2 items-center w-full h-full">
            <div className="p-10 lg:p-20 space-y-10 relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-md rounded-full border border-primary-foreground/10">
                  <span className="flex w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                  <span className="text-primary-foreground text-[11px] font-bold uppercase tracking-widest">Digital Marketplace</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-extrabold text-primary-foreground leading-tight tracking-tight">
                  Scale your <span className="text-accent">vision</span> with elite digital tools.
                </h1>
                <p className="text-primary-foreground/70 text-lg max-w-lg leading-relaxed">
                  A curated marketplace connecting ambitious builders with high-performance assets and the world's top digital professionals.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/tools">
                  <Button className="px-8 py-6 bg-accent text-accent-foreground font-bold rounded-xl hover:bg-accent/90 shadow-xl shadow-accent/20 flex items-center gap-2">
                    Browse Tools <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" className="px-8 py-6 bg-primary-foreground/5 hover:bg-primary-foreground/10 text-primary-foreground font-bold rounded-xl border border-primary-foreground/10">
                    Explore Services
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block h-full relative">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop")' }}
              >
                <div className="w-full h-full bg-gradient-to-r from-primary via-primary/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Tags */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-20">
          <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-4">Trending</p>
            {categories.map((category) => (
              <Link key={category} to={`/tools?category=${category}`}>
                <button className="px-5 py-2.5 bg-card border border-border rounded-lg text-sm font-semibold hover:border-accent hover:text-accent transition-all whitespace-nowrap">
                  {category}
                </button>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Digital Tools */}
      {tools.length > 0 && (
        <section id="tools" className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-foreground">Featured Digital Tools</h2>
              <p className="text-muted-foreground">Verified assets for high-growth projects</p>
            </div>
            <Link to="/tools" className="flex items-center gap-2 text-accent font-bold text-sm hover:underline">
              Browse Marketplace <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <Link key={tool.id} to={`/tools/${tool.id}`}>
                <div className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-xl ${getIconBgColor(index)} flex items-center justify-center`}>
                      {tool.image_url ? (
                        <img src={tool.image_url} alt={tool.name} className="w-8 h-8 object-cover rounded" />
                      ) : (
                        <span className="material-symbols-outlined text-3xl">{getIconName(index)}</span>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-secondary text-muted-foreground text-[10px] font-bold rounded-full uppercase tracking-tighter">
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{tool.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow line-clamp-2">{tool.description}</p>
                  <div className="pt-6 border-t border-border flex items-center justify-between">
                    <span className="text-lg font-black text-foreground">Free<span className="text-sm font-normal text-muted-foreground"> Start</span></span>
                    <span className="text-accent text-sm font-bold flex items-center gap-1 group">
                      View Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Services */}
      {services.length > 0 && (
        <section id="services" className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-foreground">Featured Services</h2>
              <p className="text-muted-foreground">Direct access to elite professional talent</p>
            </div>
            <Link to="/services" className="flex items-center gap-2 text-accent font-bold text-sm hover:underline">
              Explore Services <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link key={service.id} to={`/services/${service.id}`}>
                <div className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-xl ${getIconBgColor(index + 3)} flex items-center justify-center`}>
                      {service.image_url ? (
                        <img src={service.image_url} alt={service.name} className="w-8 h-8 object-cover rounded" />
                      ) : (
                        <span className="material-symbols-outlined text-3xl">{getIconName(index + 3)}</span>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-secondary text-muted-foreground text-[10px] font-bold rounded-full uppercase tracking-tighter">
                      Verified
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{service.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow line-clamp-2">{service.description}</p>
                  <div className="pt-6 border-t border-border flex items-center justify-between">
                    <span className="text-lg font-black text-foreground">{service.price}</span>
                    <span className="text-accent text-sm font-bold flex items-center gap-1 group">
                      View Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Notes Section */}
      <NotesSection />

      {/* Prompts Section */}
      <PromptsSection />

      {/* Mindmaps Section */}
      <MindmapsSection />

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-20">
        <div className="bg-accent rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center text-accent-foreground">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl lg:text-5xl font-extrabold max-w-3xl mx-auto leading-tight">Build faster with the digital infrastructure of tomorrow.</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16 pt-10 border-t border-accent-foreground/10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">verified_user</span>
                <div className="text-left">
                  <p className="font-bold text-sm">Elite Curation</p>
                  <p className="text-xs text-accent-foreground/70">Top Global Assets</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">security</span>
                <div className="text-left">
                  <p className="font-bold text-sm">Secure Platform</p>
                  <p className="text-xs text-accent-foreground/70">Safe Transactions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">bolt</span>
                <div className="text-left">
                  <p className="font-bold text-sm">Instant Access</p>
                  <p className="text-xs text-accent-foreground/70">Download Immediately</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
