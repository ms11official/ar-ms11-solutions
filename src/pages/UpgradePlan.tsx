import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Rocket, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { loadRazorpayScript } from "@/lib/razorpay";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[] | null;
  popular: boolean | null;
  is_active: boolean | null;
}

const UpgradePlan = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
    fetchUserPlan();
  }, []);

  const fetchPlans = async () => {
    const { data } = await supabase
      .from("plans")
      .select("*")
      .eq("is_active", true)
      .order("price");
    setPlans(data || []);
    setLoading(false);
  };

  const fetchUserPlan = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from("profiles")
      .select("plan")
      .eq("user_id", session.user.id)
      .single();

    if (data) setCurrentPlan(data.plan);
  };

  const getIcon = (index: number) => {
    const icons = [Zap, Crown, Rocket];
    return icons[index % icons.length];
  };

  const handleUpgrade = async (plan: Plan) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: "Please login", description: "You need to login to upgrade", variant: "destructive" });
      return;
    }

    const priceNum = parseFloat(plan.price.replace(/[^0-9.]/g, ""));
    if (isNaN(priceNum) || priceNum === 0) {
      // Free plan - just update profile
      await supabase.from("profiles").update({ plan: plan.name }).eq("user_id", session.user.id);
      setCurrentPlan(plan.name);
      toast({ title: "Plan updated!", description: `You are now on the ${plan.name} plan` });
      return;
    }

    setPurchasing(plan.id);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load payment gateway");

      // Create order
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: { 
          planId: plan.id, 
          amount: billingCycle === "yearly" ? priceNum * 12 * 0.8 : priceNum,
          itemType: "plan"
        },
      });

      if (error) throw error;

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "WavexFlow",
        description: `${plan.name} Plan - ${billingCycle === "yearly" ? "Yearly" : "Monthly"}`,
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            const { error: verifyError } = await supabase.functions.invoke("verify-razorpay-payment", {
              body: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
            });

            if (verifyError) throw verifyError;

            // Update user's plan
            await supabase.from("profiles").update({ plan: plan.name }).eq("user_id", session.user.id);
            setCurrentPlan(plan.name);
            toast({ title: "Upgrade successful!", description: `You are now on the ${plan.name} plan` });
          } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
          }
          setPurchasing(null);
        },
        prefill: { email: session.user.email },
        theme: { color: "#6366f1" },
        modal: {
          ondismiss: () => {
            setPurchasing(null);
            toast({ title: "Payment cancelled" });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setPurchasing(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Upgrade Your Plan</h1>
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
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No plans available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {plans.map((plan, index) => {
              const Icon = getIcon(index);
              const isCurrentPlan = currentPlan === plan.name;
              const priceNum = parseFloat(plan.price.replace(/[^0-9.]/g, "")) || 0;
              
              return (
                <Card
                  key={plan.id}
                  className={`relative transition-all ${
                    plan.popular
                      ? "border-primary shadow-lg scale-105 bg-card"
                      : "border-border/50 bg-card hover:border-primary/30"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <Badge variant="secondary">Current Plan</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {plan.features?.[0] || "Get started with this plan"}
                    </CardDescription>
                    <div className="pt-4">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-foreground">
                          ${billingCycle === "yearly" ? Math.round(priceNum * 0.8) : priceNum}
                        </span>
                        <span className="text-muted-foreground ml-1">{plan.period}</span>
                      </div>
                      {billingCycle === "yearly" && priceNum > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                          ${Math.round(priceNum * 12 * 0.8)}/year (Save ${Math.round(priceNum * 12 * 0.2)})
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features?.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleUpgrade(plan)}
                      disabled={isCurrentPlan || purchasing === plan.id}
                    >
                      {purchasing === plan.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : isCurrentPlan ? (
                        "Current Plan"
                      ) : (
                        "Upgrade Now"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        <Card className="bg-primary text-white border-0">
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