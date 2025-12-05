import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Tool {
  id: string;
  name: string;
  description: string | null;
  category: string;
  image_url: string | null;
}

const Tools = () => {
  const [toolsByCategory, setToolsByCategory] = useState<Record<string, Tool[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const grouped = data.reduce((acc, tool) => {
          if (!acc[tool.category]) acc[tool.category] = [];
          acc[tool.category].push(tool);
          return acc;
        }, {} as Record<string, Tool[]>);
        setToolsByCategory(grouped);
      }
      setLoading(false);
    };

    fetchTools();
  }, []);

  const categories = Object.keys(toolsByCategory);

  if (loading) {
    return (
      <section id="tools" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">Loading tools...</p>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section id="tools" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Technology Stack</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We leverage industry-leading technologies to deliver the best results for your business.
            </p>
          </motion.div>
          <div className="text-center py-12">
            <Wrench className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No tools available yet. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tools" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Technology Stack</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We leverage industry-leading technologies to deliver the best results for your business.
          </p>
        </motion.div>

        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-2xl font-bold mb-6">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {toolsByCategory[category].map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        {tool.image_url ? (
                          <img
                            src={tool.image_url}
                            alt={tool.name}
                            className="w-12 h-12 rounded-lg object-cover mb-4"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                            <Wrench className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <CardTitle className="text-xl">{tool.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{tool.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tools;
