import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Crown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PlanAccessGateProps {
  requiredPlan: string;
  children: ReactNode;
  showUpgradePrompt?: boolean;
}

const PlanAccessGate = ({
  requiredPlan,
  children,
  showUpgradePrompt = true,
}: PlanAccessGateProps) => {
  const { canAccess, currentPlan, isLoading } = usePlanAccess();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="animate-pulse bg-muted rounded-lg h-32 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (canAccess(requiredPlan)) {
    return <>{children}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <Card className="border-dashed border-2 border-muted-foreground/30">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-500" />
          {requiredPlan} Plan Required
        </h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          {t("plan.accessRestricted")}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <span>Current: {currentPlan}</span>
          <span>→</span>
          <span className="font-semibold text-accent">{requiredPlan}</span>
        </div>
        <Link to="/upgrade">
          <Button className="gap-2">
            <Crown className="w-4 h-4" />
            {t("plan.upgrade")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PlanAccessGate;
