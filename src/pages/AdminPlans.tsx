import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import DashboardLayout from "@/components/DashboardLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Crown, Plus, Trash2, Edit, Check, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[] | null;
  popular: boolean | null;
  is_active: boolean | null;
}

const AdminPlans = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin, loading: roleLoading } = useUserRole(user?.id);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [period, setPeriod] = useState("/month");
  const [features, setFeatures] = useState("");
  const [popular, setPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && !roleLoading && user && isAdmin) {
      fetchPlans();
    }
  }, [loading, roleLoading, user, isAdmin]);

  const fetchPlans = async () => {
    const { data } = await supabase
      .from("plans")
      .select("*")
      .order("price");
    setPlans(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const featuresList = features.split("\n").filter(f => f.trim());

      const data = {
        name,
        price,
        period,
        features: featuresList,
        popular,
        is_active: isActive,
      };

      if (editingId) {
        await supabase.from("plans").update(data).eq("id", editingId);
        toast({ title: "Plan updated successfully" });
      } else {
        await supabase.from("plans").insert(data);
        toast({ title: "Plan created successfully" });
      }

      resetForm();
      fetchPlans();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setPeriod("/month");
    setFeatures("");
    setPopular(false);
    setIsActive(true);
    setEditingId(null);
  };

  const handleEdit = (plan: Plan) => {
    setEditingId(plan.id);
    setName(plan.name);
    setPrice(plan.price);
    setPeriod(plan.period);
    setFeatures(plan.features?.join("\n") || "");
    setPopular(plan.popular || false);
    setIsActive(plan.is_active !== false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    await supabase.from("plans").delete().eq("id", id);
    toast({ title: "Plan deleted" });
    fetchPlans();
  };

  if (loading || roleLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-full">Loading...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-black">Manage Plans</h1>
          </div>
          <p className="text-muted-foreground">Create and manage subscription plans</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {editingId ? "Edit Plan" : "Add New Plan"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Plan Name *</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Pro, Enterprise" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={price} onChange={e => setPrice(e.target.value)} className="pl-9" placeholder="49" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Period</Label>
                  <Input value={period} onChange={e => setPeriod(e.target.value)} placeholder="/month" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Features (one per line)</Label>
                <Textarea 
                  value={features} 
                  onChange={e => setFeatures(e.target.value)} 
                  rows={6} 
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={popular} onCheckedChange={setPopular} />
                  <Label>Popular Plan</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                  <Label>Active</Label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {editingId ? "Update Plan" : "Create Plan"}
                </Button>
                {editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">All Plans ({plans.length})</h2>
            <div className="space-y-4">
              {plans.map(plan => (
                <div key={plan.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{plan.name}</h3>
                        {plan.popular && <Badge>Popular</Badge>}
                        {!plan.is_active && <Badge variant="secondary">Inactive</Badge>}
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        ${plan.price}<span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(plan)}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(plan.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  {plan.features && plan.features.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {plan.features.slice(0, 5).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 5 && (
                        <li className="text-sm text-muted-foreground">+{plan.features.length - 5} more features</li>
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPlans;