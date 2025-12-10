import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Wrench, ExternalLink } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
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
  const { toast } = useToast();

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
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Marketing Tools</h1>
          <p className="text-base text-muted-foreground">
            Access powerful tools to enhance your marketing efforts
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{tools.length}</p>
                <p className="text-sm text-muted-foreground">Total Tools</p>
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
                <p className="text-3xl font-bold">{filteredTools.length}</p>
                <p className="text-sm text-muted-foreground">Showing</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{tools.filter(t => t.link).length}</p>
                <p className="text-sm text-muted-foreground">With Links</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
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
              All Tools
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

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Card 
              key={tool.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/tools/${tool.id}`)}
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
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <Badge variant="secondary">{tool.category}</Badge>
                </div>
                <CardTitle className="text-xl">{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunch(tool);
                    }}
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
                </div>
              </CardContent>
            </Card>
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