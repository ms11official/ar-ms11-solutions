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
      "5 marketing tools",
      "1,000 email sends/month",
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
      "15 marketing tools",
      "10,000 email sends/month",
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
      "All marketing tools",
      "Unlimited email sends",
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
    name: "Extra Email Credits",
    description: "Add 5,000 additional email sends per month",
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
    description: "Remove AR-MS11 branding from all communications",
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
          <h1 className="text-4xl font-black mb-2">Upgrade Your Plan</h1>
          <p className="text-base text-muted-foreground mb-6">
            Choose the perfect plan for your marketing needs
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 p-1 rounded-lg bg-muted">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === "yearly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.highlighted
                  ? "border-primary shadow-lg scale-105"
                  : "border-border"
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
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <plan.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
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
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
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
          <h2 className="text-2xl font-bold mb-4">Available Add-ons</h2>
          <p className="text-muted-foreground mb-6">
            Enhance your plan with these optional add-ons
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addons.map((addon) => (
              <Card key={addon.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{addon.name}</CardTitle>
                      <CardDescription>{addon.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2">
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

        {/* FAQ or Trust Badges */}
        <Card className="mt-12 bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Need Help Choosing?</h3>
              <p className="text-muted-foreground mb-4">
                Our team is here to help you find the perfect plan for your needs
              </p>
              <Button variant="outline">Contact Sales</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UpgradePlan;
