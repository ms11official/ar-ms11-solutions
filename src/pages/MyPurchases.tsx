import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Download, FileText, MessageSquare, Network, ExternalLink, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface Purchase {
  id: string;
  item_id: string;
  item_type: string;
  amount: number;
  status: string;
  created_at: string;
  item?: {
    name: string;
    description: string | null;
    image_url?: string | null;
    file_url?: string | null;
  };
}

const MyPurchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }

    const { data } = await supabase
      .from("purchases")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false });

    if (data) {
      // Fetch item details for each purchase
      const purchasesWithItems: Purchase[] = await Promise.all(
        data.map(async (purchase) => {
          let itemData: any = null;
          
          if (purchase.item_type === "notes") {
            const { data: item } = await supabase
              .from("notes")
              .select("name, description, image_url, file_url")
              .eq("id", purchase.item_id)
              .single();
            itemData = item;
          } else if (purchase.item_type === "prompts") {
            const { data: item } = await supabase
              .from("prompts")
              .select("name, description, image_url")
              .eq("id", purchase.item_id)
              .single();
            itemData = item;
          } else if (purchase.item_type === "mindmaps") {
            const { data: item } = await supabase
              .from("mindmaps")
              .select("name, description, image_url, file_url")
              .eq("id", purchase.item_id)
              .single();
            itemData = item;
          }
          
          return { 
            id: purchase.id,
            item_id: purchase.item_id,
            item_type: purchase.item_type,
            amount: purchase.amount,
            status: purchase.status,
            created_at: purchase.created_at,
            item: itemData || undefined 
          };
        })
      );
      setPurchases(purchasesWithItems);
    }
    setLoading(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "notes": return FileText;
      case "prompts": return MessageSquare;
      case "mindmaps": return Network;
      default: return ShoppingBag;
    }
  };

  const filterByType = (type: string) => 
    type === "all" ? purchases : purchases.filter(p => p.item_type === type);

  const PurchaseCard = ({ purchase }: { purchase: Purchase }) => {
    const Icon = getIcon(purchase.item_type);
    
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="sm:w-40 h-32 sm:h-auto bg-muted flex-shrink-0">
            {purchase.item?.image_url ? (
              <img
                src={purchase.item.image_url}
                alt={purchase.item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="capitalize">
                    {purchase.item_type}
                  </Badge>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Completed
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg">
                  {purchase.item?.name || "Unknown Item"}
                </h3>
                {purchase.item?.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {purchase.item.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(purchase.created_at), "MMM d, yyyy")}
                  </span>
                  <span className="font-medium text-foreground">
                    ₹{purchase.amount}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {purchase.item?.file_url && (
                  <Button asChild size="sm">
                    <a href={purchase.item.file_url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </a>
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/${purchase.item_type}/${purchase.item_id}`)}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-black">My Purchases</h1>
          </div>
          <p className="text-muted-foreground">
            Access and download your purchased items
          </p>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All ({purchases.length})</TabsTrigger>
            <TabsTrigger value="notes">
              Notes ({filterByType("notes").length})
            </TabsTrigger>
            <TabsTrigger value="prompts">
              Prompts ({filterByType("prompts").length})
            </TabsTrigger>
            <TabsTrigger value="mindmaps">
              Mindmaps ({filterByType("mindmaps").length})
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : purchases.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
              <p className="text-muted-foreground mb-4">
                Start exploring our premium content
              </p>
              <Button onClick={() => navigate("/")}>Browse Content</Button>
            </Card>
          ) : (
            <>
              <TabsContent value="all" className="space-y-4">
                {filterByType("all").map(purchase => (
                  <PurchaseCard key={purchase.id} purchase={purchase} />
                ))}
              </TabsContent>
              <TabsContent value="notes" className="space-y-4">
                {filterByType("notes").map(purchase => (
                  <PurchaseCard key={purchase.id} purchase={purchase} />
                ))}
              </TabsContent>
              <TabsContent value="prompts" className="space-y-4">
                {filterByType("prompts").map(purchase => (
                  <PurchaseCard key={purchase.id} purchase={purchase} />
                ))}
              </TabsContent>
              <TabsContent value="mindmaps" className="space-y-4">
                {filterByType("mindmaps").map(purchase => (
                  <PurchaseCard key={purchase.id} purchase={purchase} />
                ))}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MyPurchases;