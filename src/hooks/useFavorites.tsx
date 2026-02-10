import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type ItemType = 'tool' | 'service' | 'ai' | 'notes' | 'prompts' | 'mindmaps' | 'freelancer';

interface Favorite {
  id: string;
  item_id: string;
  item_type: ItemType;
}

export const useFavorites = (userId: string | undefined) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('id, item_id, item_type')
          .eq('user_id', userId);

        if (error) throw error;
        setFavorites((data || []).map(f => ({
          ...f,
          item_type: f.item_type as ItemType
        })));
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  const isFavorite = (itemId: string, itemType: ItemType) => {
    return favorites.some(f => f.item_id === itemId && f.item_type === itemType);
  };

  const toggleFavorite = async (itemId: string, itemType: ItemType) => {
    if (!userId) {
      toast({
        title: "Login Required",
        description: "Please login to save favorites",
        variant: "destructive"
      });
      return;
    }

    const existing = favorites.find(f => f.item_id === itemId && f.item_type === itemType);

    if (existing) {
      // Remove favorite
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to remove from favorites",
          variant: "destructive"
        });
        return;
      }

      setFavorites(prev => prev.filter(f => f.id !== existing.id));
      toast({
        title: "Removed",
        description: "Removed from favorites"
      });
    } else {
      // Add favorite
      const { data, error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, item_id: itemId, item_type: itemType })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add to favorites",
          variant: "destructive"
        });
        return;
      }

      setFavorites(prev => [...prev, {
        id: data.id,
        item_id: data.item_id,
        item_type: data.item_type as ItemType
      }]);
      toast({
        title: "Added",
        description: "Added to favorites"
      });
    }
  };

  return { favorites, loading, isFavorite, toggleFavorite };
};
