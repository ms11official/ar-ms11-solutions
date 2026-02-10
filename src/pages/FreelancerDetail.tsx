import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, ExternalLink, Calendar, Star, Clock, MapPin, IndianRupee, Briefcase } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import ShareButtons from "@/components/ShareButtons";
import { FavoriteButton } from "@/components/FavoriteButton";
import ReviewSection from "@/components/ReviewSection";
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

const FreelancerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites(user?.id);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
    });
  }, []);

  useEffect(() => {
    if (id) fetchFreelancer();
  }, [id]);

  const fetchFreelancer = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("freelancers")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching freelancer:", error);
      toast({ title: "Error", description: "Failed to fetch freelancer details", variant: "destructive" });
    } else if (!data) {
      toast({ title: "Not Found", description: "Freelancer not found", variant: "destructive" });
      navigate("/freelancers");
    } else {
      setFreelancer(data);
    }
    setLoading(false);
  };

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
          <div className="text-lg">Loading freelancer details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!freelancer) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full p-10">
          <div className="text-lg text-muted-foreground">Freelancer not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-10 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/freelancers")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Freelancers
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {freelancer.image_url ? (
                  <img src={freelancer.image_url} alt={freelancer.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-12 h-12 text-accent" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary">{freelancer.category}</Badge>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getAvailabilityColor(freelancer.availability)}`}>
                    {freelancer.availability}
                  </span>
                </div>
                <CardTitle className="text-3xl mb-1">{freelancer.name}</CardTitle>
                <p className="text-lg text-muted-foreground mb-2">{freelancer.title}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {freelancer.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {freelancer.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(freelancer.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-secondary rounded-xl p-4 text-center">
                <Star className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <p className="text-2xl font-bold">{freelancer.rating || "N/A"}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="bg-secondary rounded-xl p-4 text-center">
                <Briefcase className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-2xl font-bold">{freelancer.total_projects}</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
              <div className="bg-secondary rounded-xl p-4 text-center">
                <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-2xl font-bold">{freelancer.experience_years}</p>
                <p className="text-xs text-muted-foreground">Years Exp</p>
              </div>
              <div className="bg-secondary rounded-xl p-4 text-center">
                <IndianRupee className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-2xl font-bold">
                  {freelancer.pricing_type === "contact" ? "Quote" : freelancer.hourly_rate}
                </p>
                <p className="text-xs text-muted-foreground">
                  {freelancer.pricing_type === "hourly" ? "Per Hour" : freelancer.pricing_type === "fixed" ? "Fixed Price" : "Contact"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <CardDescription className="text-base">
                {freelancer.description || "No description available"}
              </CardDescription>
            </div>

            {/* Skills */}
            {freelancer.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-sm px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              {freelancer.portfolio_url ? (
                <Button onClick={() => window.open(freelancer.portfolio_url!, "_blank")} className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Portfolio
                </Button>
              ) : (
                <Button variant="secondary" disabled className="flex-1">
                  No Portfolio Available
                </Button>
              )}
              <Button variant="outline" className="flex-1">
                Contact Freelancer
              </Button>
              <FavoriteButton
                isFavorite={isFavorite(freelancer.id, "freelancer")}
                onToggle={() => toggleFavorite(freelancer.id, "freelancer")}
              />
            </div>

            <ShareButtons title={freelancer.name} />
          </CardContent>
        </Card>

        <ReviewSection
          itemId={freelancer.id}
          itemType="freelancer"
          userId={user?.id}
          userEmail={user?.email}
        />
      </div>
    </DashboardLayout>
  );
};

export default FreelancerDetail;
