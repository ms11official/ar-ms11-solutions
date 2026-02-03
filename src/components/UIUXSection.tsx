import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Palette, ChevronRight, IndianRupee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface UIUXDesign {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  image_url: string | null;
}

const UIUXSection = () => {
  const [designs, setDesigns] = useState<UIUXDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchDesigns = async () => {
      const { data } = await supabase
        .from("ui_ux_designs")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(4);
      if (data) setDesigns(data);
      setLoading(false);
    };
    fetchDesigns();
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

  if (designs.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-accent" />
            <h2 className="text-3xl font-extrabold text-foreground">{t("section.uiux")}</h2>
          </div>
          <p className="text-muted-foreground">{t("section.uiuxDesc")}</p>
        </div>
        <Link to="/ui-ux" className="flex items-center gap-2 text-accent font-bold text-sm hover:underline">
          {t("common.viewAll")} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {designs.map((design) => (
          <Link key={design.id} to={`/ui-ux/${design.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <div className="aspect-video relative bg-muted">
                {design.image_url ? (
                  <img src={design.image_url} alt={design.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Palette className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                {design.category && (
                  <Badge className="absolute top-2 left-2">{design.category}</Badge>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-foreground mb-2 line-clamp-1">{design.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{design.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-lg font-bold text-primary">
                    <IndianRupee className="w-4 h-4" />
                    <span>{design.price > 0 ? design.price : t("common.free")}</span>
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

export default UIUXSection;
