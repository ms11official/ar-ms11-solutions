import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Layers, ExternalLink, Calendar, CheckCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
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
  created_at: string;
}

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching service:", error);
      toast({
        title: "Error",
        description: "Failed to fetch service details",
        variant: "destructive",
      });
    } else if (!data) {
      toast({
        title: "Not Found",
        description: "Service not found",
        variant: "destructive",
      });
      navigate("/services");
    } else {
      setService(data);
    }
    setLoading(false);
  };

  const handleVisit = () => {
    if (service?.link) {
      window.open(service.link, "_blank");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full p-10">
          <div className="text-lg">Loading service details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!service) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full p-10">
          <div className="text-lg text-muted-foreground">Service not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-10 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/services")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-6">
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Layers className="w-12 h-12 text-primary" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {service.price}
                  </Badge>
                  <Badge variant={service.status === "active" ? "default" : "outline"}>
                    {service.status}
                  </Badge>
                </div>
                <CardTitle className="text-3xl mb-2">{service.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Added on {new Date(service.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <CardDescription className="text-base">
                {service.description || "No description available"}
              </CardDescription>
            </div>

            {service.features && service.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4">
              {service.link ? (
                <Button onClick={handleVisit} className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Service
                </Button>
              ) : (
                <Button variant="secondary" disabled className="flex-1">
                  Contact for Details
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ServiceDetail;
