import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Star, Clock, IndianRupee, ChevronRight, MapPin } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Freelancer {
  id: string;
  name: string;
  title: string;
  description: string | null;
  category: string;
  skills: string[];
  hourly_rate: number;
  fixed_price: string | null;
  pricing_type: string;
  experience_years: number;
  portfolio_url: string | null;
  image_url: string | null;
  rating: number;
  total_projects: number;
  availability: string;
  location: string | null;
  status: string;
  created_at: string;
}

const FreelancersPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites(user?.id);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { id: session.user.id } : null);
    });
  }, []);

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("freelancers")
      .select("*")
      .eq("status", "active")
      .order("rating", { ascending: false });

    if (error) {
      console.error("Error fetching freelancers:", error);
      toast({ title: "Error", description: "Failed to fetch freelancers", variant: "destructive" });
    } else {
      setFreelancers(data || []);
    }
    setLoading(false);
  };

  const categories = Array.from(new Set(freelancers.map((f) => f.category)));

  const filteredFreelancers = freelancers.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      f.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available": return "bg-emerald-100 text-emerald-700";
      case "busy": return "bg-amber-100 text-amber-700";
      case "unavailable": return "bg-red-100 text-red-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full p-10">
          <div className="text-lg">Loading freelancers...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-10">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold">Freelancer Marketplace</h1>
            <p className="text-muted-foreground">Find and hire top freelance professionals</p>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search freelancers, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                selectedCategory === null
                  ? "bg-accent text-accent-foreground"
                  : "bg-card border border-border hover:border-accent hover:text-accent"
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  selectedCategory === category
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border hover:border-accent hover:text-accent"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFreelancers.map((freelancer) => (
            <div
              key={freelancer.id}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/freelancers/${freelancer.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {freelancer.image_url ? (
                      <img src={freelancer.image_url} alt={freelancer.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-7 h-7 text-accent" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{freelancer.name}</h3>
                    <p className="text-sm text-muted-foreground">{freelancer.title}</p>
                  </div>
                </div>
                <FavoriteButton
                  size="sm"
                  isFavorite={isFavorite(freelancer.id, "freelancer")}
                  onToggle={() => toggleFavorite(freelancer.id, "freelancer")}
                />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">{freelancer.category}</Badge>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getAvailabilityColor(freelancer.availability)}`}>
                  {freelancer.availability}
                </span>
              </div>

              {freelancer.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {freelancer.location}
                </div>
              )}

              <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow line-clamp-2">
                {freelancer.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {freelancer.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="text-xs bg-secondary px-2 py-1 rounded-md font-medium">{skill}</span>
                ))}
                {freelancer.skills.length > 4 && (
                  <span className="text-xs text-muted-foreground px-2 py-1">+{freelancer.skills.length - 4}</span>
                )}
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {freelancer.rating > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {freelancer.rating}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {freelancer.experience_years}yr exp
                  </span>
                  <span>{freelancer.total_projects} projects</span>
                </div>
                <div className="flex items-center text-primary font-bold">
                  {freelancer.pricing_type === "hourly" ? (
                    <>
                      <IndianRupee className="w-4 h-4" />
                      {freelancer.hourly_rate}/hr
                    </>
                  ) : freelancer.pricing_type === "contact" ? (
                    "Get Quote"
                  ) : (
                    <>
                      <IndianRupee className="w-4 h-4" />
                      {freelancer.hourly_rate}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFreelancers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No freelancers found matching your criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FreelancersPage;
