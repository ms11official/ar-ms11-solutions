import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Layers, Sparkles, FileText, MessageSquare, Network } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RelatedItem {
  id: string;
  name: string;
  description: string | null;
  category?: string | null;
  image_url: string | null;
}

interface RelatedItemsProps {
  items?: RelatedItem[];
  type?: "tool" | "service" | "ai" | "notes" | "prompts" | "mindmaps";
  currentItemId: string;
  // Auto-fetch mode props
  itemType?: "tool" | "service" | "ai" | "notes" | "prompts" | "mindmaps";
  category?: string;
}

const RelatedItems = ({ items: externalItems, type, currentItemId, itemType, category }: RelatedItemsProps) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<RelatedItem[]>(externalItems || []);

  const effectiveType = type || itemType || "tool";

  useEffect(() => {
    // Auto-fetch if itemType and category are provided
    if (itemType && category && !externalItems) {
      fetchRelatedItems();
    }
  }, [itemType, category, currentItemId]);

  const fetchRelatedItems = async () => {
    const tableName = getTableName(itemType!);
    
    const { data } = await supabase
      .from(tableName)
      .select("id, name, description, category, image_url")
      .eq("category", category)
      .eq("status", "active")
      .neq("id", currentItemId)
      .limit(4);

    if (data) setItems(data);
  };

  const getTableName = (t: string) => {
    switch (t) {
      case "tool": return "tools";
      case "service": return "services";
      case "notes": return "notes";
      case "prompts": return "prompts";
      case "mindmaps": return "mindmaps";
      default: return "tools";
    }
  };
  
  const filteredItems = items.filter(item => item.id !== currentItemId).slice(0, 4);

  if (filteredItems.length === 0) return null;

  const getIcon = () => {
    switch (effectiveType) {
      case "tool":
        return Wrench;
      case "service":
        return Layers;
      case "ai":
        return Sparkles;
      case "notes":
        return FileText;
      case "prompts":
        return MessageSquare;
      case "mindmaps":
        return Network;
      default:
        return Wrench;
    }
  };

  const getPath = (id: string) => {
    switch (effectiveType) {
      case "tool":
        return `/tools/${id}`;
      case "service":
        return `/services/${id}`;
      case "ai":
        return `/ai/${id}`;
      case "notes":
        return `/notes/${id}`;
      case "prompts":
        return `/prompts/${id}`;
      case "mindmaps":
        return `/mindmaps/${id}`;
      default:
        return `/tools/${id}`;
    }
  };

  const getTitle = () => {
    switch (effectiveType) {
      case "tool":
        return "Related Tools";
      case "service":
        return "Related Services";
      case "ai":
        return "Related AI Tools";
      case "notes":
        return "Related Notes";
      case "prompts":
        return "Related Prompts";
      case "mindmaps":
        return "Related Mindmaps";
      default:
        return "Related Items";
    }
  };

  const Icon = getIcon();

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">{getTitle()}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
            onClick={() => navigate(getPath(item.id))}
          >
            <CardContent className="p-4 flex items-center gap-4">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold truncate">{item.name}</h4>
                  {item.category && (
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description || "No description available"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedItems;