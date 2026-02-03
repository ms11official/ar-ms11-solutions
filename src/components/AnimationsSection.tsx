import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ChevronRight, IndianRupee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Animation {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  preview_url: string | null;
}

const AnimationsSection = () => {
  const [animations, setAnimations] = useState<Animation[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchAnimations = async () => {
      const { data } = await supabase
        .from("loading_animations")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(4);
      if (data) setAnimations(data);
      setLoading(false);
    };
    fetchAnimations();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (animations.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
            <h2 className="text-3xl font-extrabold text-foreground">{t("section.animations")}</h2>
          </div>
          <p className="text-muted-foreground">{t("section.animationsDesc")}</p>
        </div>
        <Link to="/animations" className="flex items-center gap-2 text-accent font-bold text-sm hover:underline">
          {t("common.viewAll")} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {animations.map((animation) => (
          <Link key={animation.id} to={`/animations/${animation.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <div className="aspect-square relative bg-muted flex items-center justify-center">
                {animation.preview_url ? (
                  <img src={animation.preview_url} alt={animation.name} className="w-full h-full object-cover" />
                ) : (
                  <Loader2 className="w-16 h-16 text-accent animate-spin" />
                )}
                {animation.category && (
                  <Badge className="absolute top-2 left-2">{animation.category}</Badge>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-foreground mb-2 line-clamp-1">{animation.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{animation.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-lg font-bold text-primary">
                    <IndianRupee className="w-4 h-4" />
                    <span>{animation.price > 0 ? animation.price : t("common.free")}</span>
                  </div>
                  <span className="text-accent text-sm font-bold">{t("common.viewDetails")}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AnimationsSection;
