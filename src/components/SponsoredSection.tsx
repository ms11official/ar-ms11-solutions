import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ExternalLink, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Sponsored {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  image_url: string | null;
  link: string | null;
  badge: string | null;
  display_order: number | null;
}

const SponsoredSection = () => {
  const [sponsored, setSponsored] = useState<Sponsored[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchSponsored = async () => {
      const { data } = await supabase
        .from("sponsored")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .limit(6);
      if (data) setSponsored(data);
      setLoading(false);
    };
    fetchSponsored();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (sponsored.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            <h2 className="text-3xl font-extrabold text-foreground">{t("section.sponsored")}</h2>
          </div>
          <p className="text-muted-foreground">{t("section.sponsoredDesc")}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsored.map((item) => (
          <Card 
            key={item.id} 
            className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-background dark:from-amber-950/20 dark:to-background group"
          >
            <div className="aspect-video relative bg-muted">
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800">
                  <Star className="w-16 h-16 text-amber-500" />
                </div>
              )}
              <div className="absolute top-2 left-2 flex items-center gap-2">
                <Badge className="bg-amber-500 text-white border-none">
                  <Star className="w-3 h-3 mr-1 fill-white" />
                  Sponsored
                </Badge>
                {item.badge && (
                  <Badge variant="secondary">{item.badge}</Badge>
                )}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1">{item.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>
              <div className="flex items-center justify-between">
                {item.price && (
                  <span className="text-lg font-bold text-foreground">{item.price}</span>
                )}
                {item.link ? (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-accent font-bold text-sm hover:underline"
                  >
                    Visit <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="flex items-center gap-1 text-accent font-bold text-sm">
                    {t("common.viewDetails")} <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SponsoredSection;
