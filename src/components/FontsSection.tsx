import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Type, ChevronRight, IndianRupee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Font {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  preview_url: string | null;
}

const FontsSection = () => {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchFonts = async () => {
      const { data } = await supabase
        .from("fonts")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(4);
      if (data) setFonts(data);
      setLoading(false);
    };
    fetchFonts();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (fonts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Type className="w-6 h-6 text-accent" />
            <h2 className="text-3xl font-extrabold text-foreground">{t("section.fonts")}</h2>
          </div>
          <p className="text-muted-foreground">{t("section.fontsDesc")}</p>
        </div>
        <Link to="/fonts" className="flex items-center gap-2 text-accent font-bold text-sm hover:underline">
          {t("common.viewAll")} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {fonts.map((font) => (
          <Link key={font.id} to={`/fonts/${font.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <div className="aspect-video relative bg-muted flex items-center justify-center">
                {font.preview_url ? (
                  <img src={font.preview_url} alt={font.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl font-bold text-foreground">Aa</div>
                )}
                {font.category && (
                  <Badge className="absolute top-2 left-2">{font.category}</Badge>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-foreground mb-2 line-clamp-1">{font.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{font.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-lg font-bold text-primary">
                    <IndianRupee className="w-4 h-4" />
                    <span>{font.price > 0 ? font.price : t("common.free")}</span>
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

export default FontsSection;
