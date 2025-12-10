import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Wrench, ExternalLink, Calendar } from "lucide-react";
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

const ToolDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tool, setTool] = useState<Tool | null>(null);
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
      console.error("Error fetching tool:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tool details",
        variant: "destructive",
      });
    } else if (!data) {
      toast({
        title: "Not Found",
        description: "Tool not found",
        variant: "destructive",
      });
      navigate("/tools");
    } else {
      setTool(data);
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
          <div className="text-lg">Loading tool details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!tool) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full p-10">
          <div className="text-lg text-muted-foreground">Tool not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-10 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/tools")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tools
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-6">
              {tool.image_url ? (
                <img
                  src={tool.image_url}
                  alt={tool.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wrench className="w-12 h-12 text-primary" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary">{tool.category}</Badge>
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
          </CardHeader>
          <CardContent className="space-y-6">
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
                  Visit Tool
                </Button>
              ) : (
                <Button variant="secondary" disabled className="flex-1">
                  Coming Soon
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ToolDetail;
