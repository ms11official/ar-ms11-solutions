import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight, Network, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Mindmap {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
}

const MindmapsSection = () => {
  const [mindmaps, setMindmaps] = useState<Mindmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMindmaps = async () => {
      const { data } = await supabase
        .from("mindmaps")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(4);
      
      if (data) setMindmaps(data);
      setLoading(false);
    };
    fetchMindmaps();
  }, []);

  if (loading || mindmaps.length === 0) return null;

  return (
    <section id="mindmaps" className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Network className="w-5 h-5 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-foreground">Mind Maps</h2>
          </div>
          <p className="text-muted-foreground">Visual learning resources and concept maps</p>
        </div>
        <Link to="/mindmaps" className="flex items-center gap-2 text-accent font-bold text-sm hover:underline">
          View All Mindmaps <span className="material-symbols-outlined text-[18px]">open_in_new</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mindmaps.map((mindmap, index) => (
          <div key={mindmap.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="aspect-[4/3] bg-gradient-to-br from-emerald-500/20 to-teal-500/20 relative overflow-hidden">
              {mindmap.image_url ? (
                <img src={mindmap.image_url} alt={mindmap.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Network className="w-16 h-16 text-emerald-500/50" />
                </div>
              )}
              {mindmap.category && (
                <span className="absolute top-3 left-3 px-3 py-1 bg-background/90 backdrop-blur-sm text-muted-foreground text-[10px] font-bold rounded-full uppercase tracking-tighter">
                  {mindmap.category}
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">{mindmap.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{mindmap.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-foreground">
                  {mindmap.price > 0 ? `₹${mindmap.price}` : 'Free'}
                </span>
                <Link to={`/mindmaps/${mindmap.id}`}>
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    {mindmap.price > 0 ? 'Buy Now' : 'Get Free'}
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

export default MindmapsSection;
