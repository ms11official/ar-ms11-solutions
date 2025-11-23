import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Gauge, Users, Search, Eye, Megaphone } from "lucide-react";
import { motion } from "framer-motion";

const toolCategories = [
  {
    category: "Analytics & Data",
    tools: [
      {
        icon: BarChart3,
        name: "Data Studio",
        description: "For comprehensive data visualization and reporting that drives strategic decisions.",
      },
      {
        icon: Gauge,
        name: "CRM Platform",
        description: "To manage customer relationships and streamline sales, marketing, and support efforts.",
      },
      {
        icon: Users,
        name: "Customer 360",
        description: "Unifying all your data sources around a single source of truth for ultimate personalization.",
      },
    ],
  },
  {
    category: "SEO & Advertising",
    tools: [
      {
        icon: Search,
        name: "SEO Toolkit",
        description: "Our go-to for competitive analysis, keyword research, backlink auditing, and rank tracking.",
      },
      {
        icon: Eye,
        name: "Online Visibility Platform",
        description: "Provides deep insights into our clients' online presence and identifies growth opportunities.",
      },
      {
        icon: Megaphone,
        name: "Ad Platforms",
        description: "We offer advertising on targeting on social media, search engines, and highly specific audiences.",
      },
    ],
  },
];

const Tools = () => {
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
          {toolCategories.map((category, categoryIndex) => (
            <div key={category.category}>
              <h3 className="text-2xl font-bold mb-6">{category.category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.tools.map((tool, index) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                          <tool.icon className="w-6 h-6 text-primary" />
                        </div>
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
