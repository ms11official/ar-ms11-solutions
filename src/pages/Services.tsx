import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Layers, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useFavorites } from "@/hooks/useFavorites";
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
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Services</h1>
          <p className="text-base text-muted-foreground">
            Explore our marketing services
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{services.length}</p>
                <p className="text-sm text-muted-foreground">Total Services</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{filteredServices.length}</p>
                <p className="text-sm text-muted-foreground">Showing</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{services.filter(s => s.link).length}</p>
                <p className="text-sm text-muted-foreground">With Links</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card 
              key={service.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/services/${service.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Layers className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{service.price}</Badge>
                    <FavoriteButton
                      size="sm"
                      isFavorite={isFavorite(service.id, 'service')}
                      onToggle={() => toggleFavorite(service.id, 'service')}
                    />
                  </div>
                </div>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {service.features && service.features.length > 0 && (
                  <ul className="text-sm text-muted-foreground mb-4 space-y-1">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx}>• {feature}</li>
                    ))}
                  </ul>
                )}
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVisit(service);
                  }}
                >
                  {service.link ? (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Service
                    </>
                  ) : (
                    "View Details"
                  )}
                </Button>
              </CardContent>
            </Card>
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
