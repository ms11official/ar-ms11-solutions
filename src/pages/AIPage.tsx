import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, ExternalLink } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AITool {
  id: string;
  name: string;
  description: string | null;
  category: string;
  image_url: string | null;
  link: string | null;
}

const AIPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [aiTools, setAITools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAITools();
  }, []);

  const fetchAITools = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("status", "active")
      .ilike("category", "%AI%")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching AI tools:", error);
      toast({
        title: "Error",
        description: "Failed to fetch AI tools",
        variant: "destructive",
      });
    } else {
      setAITools(data || []);
    }
    setLoading(false);
  };

  const categories = Array.from(new Set(aiTools.map((tool) => tool.category)));

  const filteredTools = aiTools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVisit = (tool: AITool) => {
    if (tool.link) {
      window.open(tool.link, "_blank");
    } else {
      toast({
        title: "Coming Soon",
        description: `${tool.name} will be available soon!`,
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full p-10">
          <div className="text-lg">Loading AI tools...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-black">AI Tools</h1>
              <p className="text-muted-foreground">
                Explore powerful AI-powered tools
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{aiTools.length}</p>
                <p className="text-sm text-muted-foreground">Total AI Tools</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{aiTools.filter(t => t.link).length}</p>
                <p className="text-sm text-muted-foreground">Available Now</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search AI tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All AI Tools
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Card 
              key={tool.id} 
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
              onClick={() => navigate(`/ai/${tool.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  {tool.image_url ? (
                    <img
                      src={tool.image_url}
                      alt={tool.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {tool.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {tool.name}
                </CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVisit(tool);
                  }}
                  variant={tool.link ? "default" : "secondary"}
                >
                  {tool.link ? (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Tool
                    </>
                  ) : (
                    "View Details"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No AI tools found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AIPage;
