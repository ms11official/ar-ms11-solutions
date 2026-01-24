import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RatingData {
  averageRating: number;
  reviewCount: number;
}

export const useItemRatings = (itemIds: string[], itemType: string) => {
  const [ratings, setRatings] = useState<Record<string, RatingData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (itemIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchRatings = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("item_id, rating")
        .eq("item_type", itemType)
        .in("item_id", itemIds);

      if (error) {
        console.error("Error fetching ratings:", error);
        setLoading(false);
        return;
      }

      // Calculate average ratings for each item
      const ratingsMap: Record<string, RatingData> = {};
      
      itemIds.forEach(id => {
        const itemReviews = data?.filter(r => r.item_id === id) || [];
        const ratings = itemReviews.map(r => r.rating);
        const averageRating = ratings.length > 0 
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
          : 0;
        
        ratingsMap[id] = {
          averageRating,
          reviewCount: ratings.length,
        };
      });

      setRatings(ratingsMap);
      setLoading(false);
    };

    fetchRatings();
  }, [itemIds.join(","), itemType]);

  return { ratings, loading };
};
