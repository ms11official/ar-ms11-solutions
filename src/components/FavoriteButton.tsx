import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export const FavoriteButton = ({ 
  isFavorite, 
  onToggle, 
  className,
  size = 'default' 
}: FavoriteButtonProps) => {
  return (
    <Button
      variant="outline"
      size={size === 'sm' ? 'icon' : size}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
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
