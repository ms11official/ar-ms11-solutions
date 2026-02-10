import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, ChevronRight, IndianRupee, MapPin, Clock, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Freelancer {
  id: string;
  name: string;
  title: string;
  description: string | null;
  category: string;
  skills: string[];
  hourly_rate: number;
  pricing_type: string;
  experience_years: number;
  image_url: string | null;
  rating: number;
  total_projects: number;
  availability: string;
  location: string | null;
}

const FreelancersSection = () => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchFreelancers = async () => {
      const { data } = await supabase
        .from("freelancers")
        .select("*")
        .eq("status", "active")
        .order("rating", { ascending: false })
        .limit(4);
      if (data) setFreelancers(data);
      setLoading(false);
    };
    fetchFreelancers();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (freelancers.length === 0) return null;

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300";
      case "busy": return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
      case "unavailable": return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-accent" />
            <h2 className="text-3xl font-extrabold text-foreground">{t("section.freelancers")}</h2>
          </div>
          <p className="text-muted-foreground">{t("section.freelancersDesc")}</p>
        </div>
        <Link to="/freelancers" className="flex items-center gap-2 text-accent font-bold text-sm hover:underline">
          {t("common.viewAll")} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {freelancers.map((freelancer) => (
          <Link key={freelancer.id} to={`/freelancers/${freelancer.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {freelancer.image_url ? (
                      <img src={freelancer.image_url} alt={freelancer.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-7 h-7 text-accent" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground truncate">{freelancer.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{freelancer.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">{freelancer.category}</Badge>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getAvailabilityColor(freelancer.availability)}`}>
                    {freelancer.availability}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{freelancer.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {freelancer.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="text-xs bg-secondary px-2 py-1 rounded-md font-medium">{skill}</span>
                  ))}
                  {freelancer.skills.length > 3 && (
                    <span className="text-xs text-muted-foreground px-2 py-1">+{freelancer.skills.length - 3}</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {freelancer.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {freelancer.rating}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {freelancer.experience_years}yr
                    </span>
                  </div>
                  <div className="flex items-center text-primary font-bold text-sm">
                    {freelancer.pricing_type === "hourly" ? (
                      <>
                        <IndianRupee className="w-3.5 h-3.5" />
                        {freelancer.hourly_rate}/hr
                      </>
                    ) : freelancer.pricing_type === "contact" ? (
                      "Contact"
                    ) : (
                      <>
                        <IndianRupee className="w-3.5 h-3.5" />
                        {freelancer.hourly_rate}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FreelancersSection;
