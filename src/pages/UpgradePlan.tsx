import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Rocket } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for individuals and small projects",
    icon: Zap,
    features: [
      "Up to 3 active services",
      "5 tools access",
      "1,000 API calls/month",
      "Basic analytics",
      "Email support",
      "1 team member",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "Best for growing businesses",
    icon: Crown,
    features: [
      "Up to 10 active services",
      "15 tools access",
      "10,000 API calls/month",
      "Advanced analytics",
      "Priority support",
      "5 team members",
      "Custom integrations",
      "API access",
    ],
    highlighted: true,
    badge: "Current Plan",
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For large-scale operations",
    icon: Rocket,
    features: [
      "Unlimited services",
      "All tools access",
      "Unlimited API calls",
      "Enterprise analytics",
      "24/7 phone support",
      "Unlimited team members",
      "Advanced integrations",
      "Dedicated account manager",
      "Custom training",
      "SLA guarantee",
    ],
    highlighted: false,
  },
];

const addons = [
  {
    id: 1,
    name: "Extra API Credits",
    description: "Add 5,000 additional API calls per month",
    price: "$15/mo",
  },
  {
    id: 2,
    name: "Priority Support",
    description: "Get 24/7 priority support via phone and email",
    price: "$20/mo",
  },
  {
    id: 3,
    name: "Advanced Analytics",
    description: "Unlock advanced reporting and custom dashboards",
    price: "$25/mo",
  },
  {
    id: 4,
    name: "White Label",
    description: "Remove WavexFlow branding from all communications",
    price: "$30/mo",
  },
];

const UpgradePlan = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { toast } = useToast();

  const handleUpgrade = (planName: string) => {
    toast({
      title: "Upgrade Initiated",
      description: `Upgrading to ${planName} plan...`,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Upgrade Your Plan</h1>
          <p className="text-muted-foreground mb-6">
            Choose the perfect plan for your needs
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-muted">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <Badge className="bg-green-100 text-green-800 border-0">Save 20%</Badge>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative transition-all ${
                plan.highlighted
                  ? "border-primary shadow-lg scale-105 bg-card"
                  : "border-border/50 bg-card hover:border-primary/30"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <plan.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                <div className="pt-4">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">
                      {plan.period}
                    </span>
                  </div>
                  {billingCycle === "yearly" && (
                    <p className="text-sm text-green-600 mt-1">
                      ${(parseInt(plan.price.slice(1)) * 12 * 0.8).toFixed(0)}/year
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${plan.highlighted ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={plan.badge === "Current Plan"}
                >
                  {plan.badge === "Current Plan" ? "Current Plan" : "Upgrade Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add-ons Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Available Add-ons</h2>
          <p className="text-muted-foreground mb-6">
            Enhance your plan with these optional add-ons
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addons.map((addon) => (
              <Card key={addon.id} className="border-border/50 bg-card hover:border-primary/30 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">{addon.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">{addon.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                      {addon.price}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      toast({
                        title: "Add-on Added",
                        description: `${addon.name} has been added to your plan`,
                      })
                    }
                  >
                    Add to Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <Card className="mt-12 bg-primary text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Need Help Choosing?</h3>
            <p className="text-white/80 mb-4">
              Our team is here to help you find the perfect plan for your needs
            </p>
            <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UpgradePlan;
