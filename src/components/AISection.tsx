import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ExternalLink, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface AITool {
  id: string;
  name: string;
  description: string | null;
  category: string;
  image_url: string | null;
  link: string | null;
}

const AISection = () => {
  // Add id for navbar navigation
  const [aiTools, setAITools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAITools = async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("status", "active")
        .ilike("category", "%AI%")
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error) {
        setAITools(data || []);
      }
      setLoading(false);
    };

    fetchAITools();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading AI tools...</div>
        </div>
      </section>
    );
  }

  if (aiTools.length === 0) {
    return null;
  }

  return (
    <section id="ai-section" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Tools</span>
          </div>
          <h2 className="text-4xl font-black mb-4">
            Supercharge Your Work with AI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover cutting-edge AI tools designed to enhance your productivity and creativity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {aiTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
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
                  <CardDescription className="line-clamp-2">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tool.link ? (
                    <Button
                      className="w-full"
                      onClick={() => window.open(tool.link!, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Try Now
                    </Button>
                  ) : (
                    <Button className="w-full" variant="secondary">
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/ai">
            <Button variant="outline" size="lg" className="group">
              View All AI Tools
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AISection;
