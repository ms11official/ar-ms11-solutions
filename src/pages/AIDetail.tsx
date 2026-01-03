import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, ExternalLink, Calendar } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import ShareButtons from "@/components/ShareButtons";
import RelatedItems from "@/components/RelatedItems";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AITool {
  id: string;
  name: string;
  description: string | null;
  category: string;
  image_url: string | null;
  link: string | null;
  status: string;
  created_at: string;
}

const AIDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tool, setTool] = useState<AITool | null>(null);
  const [relatedTools, setRelatedTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchTool();
    }
  }, [id]);

  const fetchTool = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching AI tool:", error);
      toast({
        title: "Error",
        description: "Failed to fetch AI tool details",
        variant: "destructive",
      });
    } else if (!data) {
      toast({
        title: "Not Found",
        description: "AI tool not found",
        variant: "destructive",
      });
      navigate("/ai");
    } else {
      setTool(data);
      // Fetch related AI tools by category
      const { data: related } = await supabase
        .from("tools")
        .select("*")
        .eq("category", data.category)
        .eq("status", "active")
        .limit(5);
      if (related) {
        setRelatedTools(related);
      }
    }
    setLoading(false);
  };

  const handleVisit = () => {
    if (tool?.link) {
      window.open(tool.link, "_blank");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full p-10">
          <div className="text-lg">Loading AI tool details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!tool) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full p-10">
          <div className="text-lg text-muted-foreground">AI tool not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-10 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/ai")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to AI Tools
        </Button>

        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6">
            <div className="flex items-start gap-6">
              {tool.image_url ? (
                <img
                  src={tool.image_url}
                  alt={tool.name}
                  className="w-24 h-24 rounded-xl object-cover border-2 border-background"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-primary-foreground" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {tool.category}
                  </Badge>
                  <Badge variant={tool.status === "active" ? "default" : "outline"}>
                    {tool.status}
                  </Badge>
                </div>
                <CardTitle className="text-3xl mb-2">{tool.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Added on {new Date(tool.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          <CardContent className="space-y-6 pt-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <CardDescription className="text-base">
                {tool.description || "No description available"}
              </CardDescription>
            </div>

            <div className="flex gap-4">
              {tool.link ? (
                <Button onClick={handleVisit} className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit AI Tool
                </Button>
              ) : (
                <Button variant="secondary" disabled className="flex-1">
                  Coming Soon
                </Button>
              )}
            </div>

            <ShareButtons title={tool.name} />
          </CardContent>
        </Card>

        <RelatedItems 
          items={relatedTools} 
          type="ai" 
          currentItemId={tool.id} 
        />
      </div>
    </DashboardLayout>
  );
};

export default AIDetail;
