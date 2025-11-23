import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, FileText } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: TrendingUp,
    title: "SEO Optimization",
    description: "Boost your visibility on search engines and attract high-quality organic traffic.",
  },
  {
    icon: Target,
    title: "PPC Campaign Management",
    description: "Maximize your ROI with targeted, data-driven advertising campaigns that convert.",
  },
  {
    icon: FileText,
    title: "Content Strategy",
    description: "Engage your audience with compelling, relatable content that builds trust and drives action.",
  },
];

const Services = () => {
  return (
    <section id="services" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">What We Offer</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide a comprehensive suite of services to meet your marketing needs, from strategy to execution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
