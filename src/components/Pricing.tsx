import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for individuals and small projects",
    features: [
      "Up to 10 projects",
      "5GB storage",
      "Basic support",
      "API access",
      "Standard security",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$149",
    period: "/month",
    description: "Ideal for growing businesses",
    features: [
      "Unlimited projects",
      "50GB storage",
      "Priority support",
      "Advanced API access",
      "Enhanced security",
      "Custom integrations",
      "Analytics dashboard",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large organizations",
    features: [
      "Everything in Professional",
      "Unlimited storage",
      "24/7 dedicated support",
      "Custom development",
      "SLA guarantees",
      "On-premise deployment",
      "White-label options",
    ],
    highlighted: false,
  },
];

const Pricing = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Pricing Plans
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Upgrade or downgrade anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={plan.highlighted ? "md:-mt-4" : ""}
            >
              <Card className={`p-8 h-full flex flex-col ${
                plan.highlighted 
                  ? "border-primary bg-card shadow-[0_0_40px_hsl(var(--primary)/0.2)]" 
                  : "border-border bg-card"
              }`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-secondary rounded-full text-sm font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={plan.highlighted 
                    ? "w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_hsl(var(--primary)/0.3)]" 
                    : "w-full border-primary/30 hover:bg-primary/10 hover:border-primary"
                  }
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
