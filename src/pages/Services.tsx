import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Search, TrendingUp, Target, Mail, BarChart3, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const servicesData = [
  {
    id: 1,
    title: "SEO Booster",
    description: "Optimize your website's search engine ranking with advanced SEO strategies.",
    icon: TrendingUp,
    status: "active",
    price: "$49/mo",
  },
  {
    id: 2,
    title: "Social Media Manager",
    description: "Manage all your social media accounts from one powerful dashboard.",
    icon: Globe,
    status: "active",
    price: "$39/mo",
  },
  {
    id: 3,
    title: "Email Marketing Pro",
    description: "Create, send, and track email campaigns with advanced automation.",
    icon: Mail,
    status: "active",
    price: "$29/mo",
  },
  {
    id: 4,
    title: "Ad Campaign Optimizer",
    description: "Maximize your ad spend with AI-powered campaign optimization.",
    icon: Target,
    status: "inactive",
    price: "$59/mo",
  },
  {
    id: 5,
    title: "Analytics Dashboard",
    description: "Get comprehensive insights into your marketing performance.",
    icon: BarChart3,
    status: "inactive",
    price: "$44/mo",
  },
  {
    id: 6,
    title: "Content Marketing Suite",
    description: "Plan, create, and distribute content across all your channels.",
    icon: Search,
    status: "inactive",
    price: "$54/mo",
  },
];

const ServicesPage = () => {
  const [services, setServices] = useState(servicesData);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const toggleService = (id: number) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? {
              ...service,
              status: service.status === "active" ? "inactive" : "active",
            }
          : service
      )
    );
    
    toast({
      title: "Service Updated",
      description: "Service status changed successfully",
    });
  };

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = services.filter((s) => s.status === "active").length;

  return (
    <DashboardLayout>
      <div className="p-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Services</h1>
          <p className="text-base text-muted-foreground">
            Manage your marketing services and subscriptions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Services</p>
                  <p className="text-3xl font-bold">{activeCount}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Services</p>
                  <p className="text-3xl font-bold">{services.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Cost</p>
                  <p className="text-3xl font-bold">$117</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
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
            <Card key={service.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge
                    variant={service.status === "active" ? "default" : "secondary"}
                    className={
                      service.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : ""
                    }
                  >
                    {service.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{service.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {service.status === "active" ? "Enabled" : "Disabled"}
                    </span>
                    <Switch
                      checked={service.status === "active"}
                      onCheckedChange={() => toggleService(service.id)}
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() =>
                    toast({
                      title: "Service Details",
                      description: `Viewing details for ${service.title}`,
                    })
                  }
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServicesPage;
