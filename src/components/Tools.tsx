import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Database, GitBranch, Terminal, Cloud, Lock, BarChart } from "lucide-react";

const tools = [
  {
    icon: Database,
    name: "Database Management",
    description: "Powerful database tools with real-time sync",
  },
  {
    icon: GitBranch,
    name: "Version Control",
    description: "Integrated Git workflow and collaboration",
  },
  {
    icon: Terminal,
    name: "CLI Tools",
    description: "Command-line interface for automation",
  },
  {
    icon: Cloud,
    name: "Cloud Integration",
    description: "Seamless cloud service connections",
  },
  {
    icon: Lock,
    name: "Security Suite",
    description: "Comprehensive security and compliance tools",
  },
  {
    icon: BarChart,
    name: "Analytics",
    description: "Advanced metrics and insights dashboard",
  },
];

const Tools = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Powerful Tools
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to build, deploy, and scale your applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 group hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <tool.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-foreground">{tool.name}</h3>
                    <p className="text-muted-foreground text-sm">{tool.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tools;
