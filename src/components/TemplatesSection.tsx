import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Layout, ChevronRight, IndianRupee, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  image_url: string | null;
  preview_url: string | null;
}

const TemplatesSection = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data } = await supabase
        .from("website_templates")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(4);
      if (data) setTemplates(data);
      setLoading(false);
    };
    fetchTemplates();
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

  if (templates.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Layout className="w-6 h-6 text-accent" />
            <h2 className="text-3xl font-extrabold text-foreground">{t("section.templates")}</h2>
          </div>
          <p className="text-muted-foreground">{t("section.templatesDesc")}</p>
        </div>
        <Link to="/templates" className="flex items-center gap-2 text-accent font-bold text-sm hover:underline">
          {t("common.viewAll")} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <Link key={template.id} to={`/templates/${template.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
              <div className="aspect-video relative bg-muted">
                {template.image_url ? (
                  <img src={template.image_url} alt={template.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layout className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                {template.preview_url && (
                  <a 
                    href={template.preview_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-2 right-2 p-2 bg-background/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {template.category && (
                  <Badge className="absolute top-2 left-2">{template.category}</Badge>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-foreground mb-2 line-clamp-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{template.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-lg font-bold text-primary">
                    <IndianRupee className="w-4 h-4" />
                    <span>{template.price > 0 ? template.price : t("common.free")}</span>
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

export default TemplatesSection;
