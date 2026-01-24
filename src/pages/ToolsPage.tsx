import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Wrench, ExternalLink, Star, ChevronRight } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useFavorites } from "@/hooks/useFavorites";
import { useItemRatings } from "@/hooks/useItemRatings";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Tool {
  id: string;
  name: string;
  description: string | null;
  category: string;
  icon: string | null;
  image_url: string | null;
  link: string | null;
  status: string;
  created_at: string;
}

const ToolsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites(user?.id);
  const { ratings } = useItemRatings(tools.map(t => t.id), "tool");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { id: session.user.id } : null);
    });
  }, []);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tools:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tools",
        variant: "destructive",
      });
    } else {
      setTools(data || []);
    }
    setLoading(false);
  };

  const categories = Array.from(new Set(tools.map((tool) => tool.category)));

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLaunch = (tool: Tool) => {
    if (tool.link) {
      window.open(tool.link, "_blank");
    } else {
      toast({
        title: "Tool Launched",
        description: `Opening ${tool.name}...`,
      });
    }
  };

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full p-10">
          <div className="text-lg">Loading tools...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-10">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold">Featured Digital Tools</h1>
            <p className="text-muted-foreground">Verified assets for high-growth projects</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                selectedCategory === null 
                  ? 'bg-accent text-accent-foreground' 
                  : 'bg-card border border-border hover:border-accent hover:text-accent'
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All Tools
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  selectedCategory === category 
                    ? 'bg-accent text-accent-foreground' 
                    : 'bg-card border border-border hover:border-accent hover:text-accent'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((tool, index) => (
            <div
              key={tool.id}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/tools/${tool.id}`)}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-xl ${getIconBgColor(index)} flex items-center justify-center`}>
                  {tool.image_url ? (
                    <img src={tool.image_url} alt={tool.name} className="w-8 h-8 object-cover rounded" />
                  ) : (
                    <span className="material-symbols-outlined text-3xl">{getIconName(index)}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-secondary text-muted-foreground text-[10px] font-bold rounded-full uppercase tracking-tighter">
                    {tool.category}
                  </span>
                  <FavoriteButton
                    size="sm"
                    isFavorite={isFavorite(tool.id, 'tool')}
                    onToggle={() => toggleFavorite(tool.id, 'tool')}
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{tool.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow line-clamp-2">{tool.description}</p>
              
              {/* Rating Display */}
              {ratings[tool.id]?.averageRating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-sm">{ratings[tool.id].averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">({ratings[tool.id].reviewCount})</span>
                </div>
              )}
              
              <div className="pt-6 border-t border-border flex items-center justify-between">
                <span className="text-lg font-black text-foreground">Free<span className="text-sm font-normal text-muted-foreground"> Start</span></span>
                <span className="text-accent text-sm font-bold flex items-center gap-1 group">
                  View Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No tools found matching your criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ToolsPage;
