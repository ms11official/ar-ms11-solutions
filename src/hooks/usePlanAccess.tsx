import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PlanAccess {
  currentPlan: string;
  isLoading: boolean;
  canAccess: (requiredPlan: string) => boolean;
  planHierarchy: Record<string, number>;
}

const PLAN_HIERARCHY: Record<string, number> = {
  "Free": 0,
  "Basic": 1,
  "Pro": 2,
  "Premium": 3,
  "Enterprise": 4,
};

export const usePlanAccess = (): PlanAccess => {
  const [currentPlan, setCurrentPlan] = useState<string>("Free");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setCurrentPlan("Free");
          setIsLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("plan")
          .eq("user_id", session.user.id)
          .single();

        if (profile?.plan) {
          setCurrentPlan(profile.plan);
        }
      } catch (error) {
        console.error("Error fetching user plan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPlan();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserPlan();
    });

    return () => subscription.unsubscribe();
  }, []);

  const canAccess = (requiredPlan: string): boolean => {
    const currentLevel = PLAN_HIERARCHY[currentPlan] ?? 0;
    const requiredLevel = PLAN_HIERARCHY[requiredPlan] ?? 0;
    return currentLevel >= requiredLevel;
  };

  return {
    currentPlan,
    isLoading,
    canAccess,
    planHierarchy: PLAN_HIERARCHY,
  };
};
