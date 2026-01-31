import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight, Sparkles, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Prompt {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
}

const PromptsSection = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      const { data } = await supabase
        .from("prompts")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(4);
      
      if (data) setPrompts(data);
      setLoading(false);
    };
    fetchPrompts();
  }, []);

  if (loading || prompts.length === 0) return null;

  return (
    <section id="prompts" className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-foreground">AI Prompts</h2>
          </div>
          <p className="text-muted-foreground">Professional prompts for ChatGPT, Midjourney & more</p>
        </div>
        <Link to="/prompts" className="flex items-center gap-2 text-accent font-bold text-sm hover:underline">
          View All Prompts <span className="material-symbols-outlined text-[18px]">open_in_new</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {prompts.map((prompt, index) => (
          <div key={prompt.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="aspect-[4/3] bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative overflow-hidden">
              {prompt.image_url ? (
                <img src={prompt.image_url} alt={prompt.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-purple-500/50" />
                </div>
              )}
              {prompt.category && (
                <span className="absolute top-3 left-3 px-3 py-1 bg-background/90 backdrop-blur-sm text-muted-foreground text-[10px] font-bold rounded-full uppercase tracking-tighter">
                  {prompt.category}
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">{prompt.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{prompt.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-foreground">
                  {prompt.price > 0 ? `₹${prompt.price}` : 'Free'}
                </span>
                <Link to={`/prompts/${prompt.id}`}>
                  <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    {prompt.price > 0 ? 'Buy Now' : 'Get Free'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromptsSection;
