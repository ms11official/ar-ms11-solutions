import { useState, useEffect, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FavoriteButtonProps {
  isFavorite?: boolean;
  onToggle?: () => void;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  // Auto-fetch mode props
  itemId?: string;
  itemType?: string;
}

export const FavoriteButton = ({ 
  isFavorite: externalIsFavorite, 
  onToggle: externalOnToggle, 
  className,
  size = 'default',
  itemId,
  itemType
}: FavoriteButtonProps) => {
  const [internalIsFavorite, setInternalIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Use auto-fetch mode if itemId and itemType are provided
  const isAutoMode = itemId && itemType;
  const isFavorite = isAutoMode ? internalIsFavorite : externalIsFavorite;

  useEffect(() => {
    if (isAutoMode) {
      checkFavoriteStatus();
    }
  }, [itemId, itemType]);

  const checkFavoriteStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !itemId) return;

    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('item_id', itemId)
      .eq('item_type', itemType)
      .single();

    setInternalIsFavorite(!!data);
  };

  const handleAutoToggle = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: "Please login", description: "You need to login to save favorites", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      if (internalIsFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', session.user.id)
          .eq('item_id', itemId)
          .eq('item_type', itemType);
        setInternalIsFavorite(false);
        toast({ title: "Removed from favorites" });
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: session.user.id,
            item_id: itemId,
            item_type: itemType
          });
        setInternalIsFavorite(true);
        toast({ title: "Added to favorites" });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const onToggle = isAutoMode ? handleAutoToggle : externalOnToggle;

  return (
    <Button
      variant="outline"
      size={size === 'sm' ? 'icon' : size}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!loading) onToggle?.();
      }}
      disabled={loading}
      className={cn(
        "transition-all duration-200",
        isFavorite && "text-red-500 border-red-200 bg-red-50 hover:bg-red-100",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-4 w-4",
          isFavorite && "fill-current"
        )} 
      />
      {size !== 'sm' && (
        <span className="ml-2">{isFavorite ? 'Saved' : 'Save'}</span>
      )}
    </Button>
  );
};