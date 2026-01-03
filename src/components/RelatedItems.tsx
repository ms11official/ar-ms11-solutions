import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Layers, Sparkles } from "lucide-react";

interface RelatedItem {
  id: string;
  name: string;
  description: string | null;
  category?: string;
  image_url: string | null;
}

interface RelatedItemsProps {
  items: RelatedItem[];
  type: "tool" | "service" | "ai";
  currentItemId: string;
}

const RelatedItems = ({ items, type, currentItemId }: RelatedItemsProps) => {
  const navigate = useNavigate();
  
  const filteredItems = items.filter(item => item.id !== currentItemId).slice(0, 4);

  if (filteredItems.length === 0) return null;

  const getIcon = () => {
    switch (type) {
      case "tool":
        return Wrench;
      case "service":
        return Layers;
      case "ai":
        return Sparkles;
    }
  };

  const getPath = (id: string) => {
    switch (type) {
      case "tool":
        return `/tools/${id}`;
      case "service":
        return `/services/${id}`;
      case "ai":
        return `/ai/${id}`;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "tool":
        return "Related Tools";
      case "service":
        return "Related Services";
      case "ai":
        return "Related AI Tools";
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
