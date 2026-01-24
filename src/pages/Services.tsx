import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Layers, ExternalLink, Star, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useFavorites } from "@/hooks/useFavorites";
import { useItemRatings } from "@/hooks/useItemRatings";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: string;
  features: string[] | null;
  image_url: string | null;
  link: string | null;
  status: string;
}

const ServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites(user?.id);
  const { ratings } = useItemRatings(services.map(s => s.id), "service");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { id: session.user.id } : null);
    });
  }, []);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const handleVisit = (service: Service) => {
    if (service.link) {
      window.open(service.link, "_blank");
    } else {
      toast({
        title: "Service Details",
        description: `Viewing details for ${service.name}`,
      });
    }
  };

  const getIconBgColor = (index: number) => {
    const colors = [
      'bg-blue-50 text-blue-600',
      'bg-pink-50 text-pink-600',
      'bg-indigo-50 text-indigo-600',
      'bg-amber-50 text-amber-600',
      'bg-emerald-50 text-emerald-600',
      'bg-purple-50 text-purple-600',
    ];
    return colors[index % colors.length];
  };

  const getIconName = (index: number) => {
    const icons = ['terminal', 'brush', 'search_check', 'auto_fix_high', 'campaign', 'palette'];
    return icons[index % icons.length];
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full p-10">
          <div className="text-lg">Loading services...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-10">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold">Featured Services</h1>
            <p className="text-muted-foreground">Direct access to elite professional talent</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((service, index) => (
            <div
              key={service.id}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/services/${service.id}`)}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-xl ${getIconBgColor(index)} flex items-center justify-center`}>
                  {service.image_url ? (
                    <img src={service.image_url} alt={service.name} className="w-8 h-8 object-cover rounded" />
                  ) : (
                    <span className="material-symbols-outlined text-3xl">{getIconName(index)}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-secondary text-muted-foreground text-[10px] font-bold rounded-full uppercase tracking-tighter">
                    Verified
                  </span>
                  <FavoriteButton
                    size="sm"
                    isFavorite={isFavorite(service.id, 'service')}
                    onToggle={() => toggleFavorite(service.id, 'service')}
                  />
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{service.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow line-clamp-2">{service.description}</p>
              
              {/* Rating Display */}
              {ratings[service.id]?.averageRating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-sm">{ratings[service.id].averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">({ratings[service.id].reviewCount})</span>
                </div>
              )}
              
              <div className="pt-6 border-t border-border flex items-center justify-between">
                <span className="text-lg font-black text-foreground">{service.price}</span>
                <span className="text-accent text-sm font-bold flex items-center gap-1 group">
                  View Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Layers className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No services found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ServicesPage;
