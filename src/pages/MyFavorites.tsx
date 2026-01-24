import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Wrench, Layers, Sparkles, ExternalLink, Star } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FavoriteItem {
  id: string;
  item_id: string;
  item_type: string;
  created_at: string;
  item?: {
    id: string;
    name: string;
    description: string | null;
    category?: string;
    price?: string;
    image_url?: string | null;
    link?: string | null;
    averageRating?: number;
    reviewCount?: number;
  };
}

const MyFavorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const { toast } = useToast();
  const { toggleFavorite } = useFavorites(user?.id);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id });
        fetchFavorites(session.user.id);
      }
    });
  }, []);

  const fetchFavorites = async (userId: string) => {
    setLoading(true);
    
    // Fetch favorites
    const { data: favoritesData, error: favError } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (favError) {
      console.error("Error fetching favorites:", favError);
      setLoading(false);
      return;
    }

    // Fetch item details and ratings for each favorite
    const favoritesWithDetails = await Promise.all(
      (favoritesData || []).map(async (fav) => {
        let item = null;
        
        if (fav.item_type === "tool" || fav.item_type === "ai") {
          const { data } = await supabase
            .from("tools")
            .select("*")
            .eq("id", fav.item_id)
            .single();
          item = data;
        } else if (fav.item_type === "service") {
          const { data } = await supabase
            .from("services")
            .select("*")
            .eq("id", fav.item_id)
            .single();
          item = data;
        }

        // Fetch average rating
        if (item) {
          const { data: reviews } = await supabase
            .from("reviews")
            .select("rating")
            .eq("item_id", fav.item_id)
            .eq("item_type", fav.item_type);

          const ratings = reviews?.map(r => r.rating) || [];
          const averageRating = ratings.length > 0 
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
            : 0;

          item = {
            ...item,
            averageRating,
            reviewCount: ratings.length,
          };
        }

        return { ...fav, item };
      })
    );

    setFavorites(favoritesWithDetails.filter(f => f.item !== null));
    setLoading(false);
  };

  const handleRemoveFavorite = async (itemId: string, itemType: string) => {
    await toggleFavorite(itemId, itemType as 'tool' | 'service' | 'ai');
    setFavorites(favorites.filter(f => !(f.item_id === itemId && f.item_type === itemType)));
    toast({
      title: "Removed from favorites",
      description: "Item has been removed from your favorites.",
    });
  };

  const getItemRoute = (itemType: string, itemId: string) => {
    switch (itemType) {
      case "tool": return `/tools/${itemId}`;
      case "service": return `/services/${itemId}`;
      case "ai": return `/ai/${itemId}`;
      default: return "#";
    }
  };

  const getIcon = (itemType: string) => {
    switch (itemType) {
      case "tool": return Wrench;
      case "service": return Layers;
      case "ai": return Sparkles;
      default: return Wrench;
    }
  };

  const toolFavorites = favorites.filter(f => f.item_type === "tool");
  const serviceFavorites = favorites.filter(f => f.item_type === "service");
  const aiFavorites = favorites.filter(f => f.item_type === "ai");

  const renderFavoriteCard = (fav: FavoriteItem) => {
    const Icon = getIcon(fav.item_type);
    
    return (
      <Card key={fav.id} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
              {fav.item?.image_url ? (
                <img src={fav.item.image_url} alt={fav.item.name} className="w-8 h-8 object-cover rounded" />
              ) : (
                <Icon className="w-6 h-6 text-accent" />
              )}
            </div>
            <div className="flex items-center gap-2">
              {fav.item?.category && (
                <Badge variant="secondary">{fav.item.category}</Badge>
              )}
              <FavoriteButton
                size="sm"
                isFavorite={true}
                onToggle={() => handleRemoveFavorite(fav.item_id, fav.item_type)}
              />
            </div>
          </div>
          <CardTitle className="text-xl">{fav.item?.name}</CardTitle>
          <CardDescription className="line-clamp-2">{fav.item?.description}</CardDescription>
          
          {/* Rating Display */}
          {fav.item?.averageRating !== undefined && fav.item.averageRating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-sm">{fav.item.averageRating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground text-sm">({fav.item.reviewCount} reviews)</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {fav.item?.price && (
              <span className="text-lg font-bold">{fav.item.price}</span>
            )}
            <Button
              onClick={() => navigate(getItemRoute(fav.item_type, fav.item_id))}
              className="ml-auto"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full p-10">
          <div className="text-lg">Loading favorites...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold">My Favorites</h1>
              <p className="text-muted-foreground">
                All your saved tools, services, and AI items in one place
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{favorites.length}</p>
                <p className="text-sm text-muted-foreground">Total Favorites</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{toolFavorites.length}</p>
                <p className="text-sm text-muted-foreground">Tools</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{serviceFavorites.length}</p>
                <p className="text-sm text-muted-foreground">Services</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{aiFavorites.length}</p>
                <p className="text-sm text-muted-foreground">AI Tools</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-4">You haven't saved any favorites yet</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate("/tools")}>Browse Tools</Button>
              <Button variant="outline" onClick={() => navigate("/services")}>Explore Services</Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({favorites.length})</TabsTrigger>
              <TabsTrigger value="tools">Tools ({toolFavorites.length})</TabsTrigger>
              <TabsTrigger value="services">Services ({serviceFavorites.length})</TabsTrigger>
              <TabsTrigger value="ai">AI Tools ({aiFavorites.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map(renderFavoriteCard)}
              </div>
            </TabsContent>

            <TabsContent value="tools">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {toolFavorites.map(renderFavoriteCard)}
              </div>
              {toolFavorites.length === 0 && (
                <div className="text-center py-12">
                  <Wrench className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No favorite tools yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="services">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceFavorites.map(renderFavoriteCard)}
              </div>
              {serviceFavorites.length === 0 && (
                <div className="text-center py-12">
                  <Layers className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No favorite services yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="ai">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiFavorites.map(renderFavoriteCard)}
              </div>
              {aiFavorites.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No favorite AI tools yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyFavorites;
