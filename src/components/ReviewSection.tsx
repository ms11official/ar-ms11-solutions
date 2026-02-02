import { useState, useEffect } from 'react';
import { Star, Send, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  user_id: string;
  user_email: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface ReviewSectionProps {
  itemId: string;
  itemType: 'tool' | 'service' | 'ai' | 'notes' | 'prompts' | 'mindmaps';
  userId?: string;
  userEmail?: string;
}

export default function ReviewSection({ itemId, itemType, userId, userEmail }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [itemId, itemType]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setReviews(data || []);
      
      if (userId) {
        const existing = data?.find(r => r.user_id === userId);
        if (existing) {
          setUserReview(existing);
          setRating(existing.rating);
          setComment(existing.comment || '');
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      toast({
        title: "Login Required",
        description: "Please login to submit a review",
        variant: "destructive"
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({ rating, comment, user_email: userEmail })
          .eq('id', userReview.id);

        if (error) throw error;

        toast({
          title: "Review Updated",
          description: "Your review has been updated"
        });
      } else {
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert({
            user_id: userId,
            user_email: userEmail,
            item_id: itemId,
            item_type: itemType,
            rating,
            comment
          });

        if (error) throw error;

        toast({
          title: "Review Submitted",
          description: "Thank you for your review!"
        });
      }

      fetchReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userReview) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', userReview.id);

      if (error) throw error;

      setUserReview(null);
      setRating(0);
      setComment('');
      fetchReviews();

      toast({
        title: "Review Deleted",
        description: "Your review has been removed"
      });
    } catch (err) {
      console.error('Error deleting review:', err);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive"
      });
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const StarRating = ({ 
    value, 
    onChange, 
    onHover,
    readonly = false 
  }: { 
    value: number; 
    onChange?: (v: number) => void;
    onHover?: (v: number) => void;
    readonly?: boolean;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-5 w-5 transition-colors",
            (readonly ? value : (hoverRating || value)) >= star
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300",
            !readonly && "cursor-pointer hover:scale-110"
          )}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && onHover?.(star)}
          onMouseLeave={() => !readonly && onHover?.(0)}
        />
      ))}
    </div>
  );

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reviews & Ratings</span>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="text-lg">{averageRating}</span>
            <span className="text-sm text-muted-foreground">
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Submit Review Form */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-4">
          <h4 className="font-medium">
            {userReview ? 'Update Your Review' : 'Write a Review'}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Your Rating:</span>
            <StarRating 
              value={rating} 
              onChange={setRating}
              onHover={setHoverRating}
            />
          </div>
          <Textarea
            placeholder="Share your experience... (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={submitting}>
              <Send className="h-4 w-4 mr-2" />
              {userReview ? 'Update Review' : 'Submit Review'}
            </Button>
            {userReview && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-muted-foreground text-center py-4">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className={cn(
                  "flex gap-4 p-4 rounded-lg border",
                  review.user_id === userId && "bg-primary/5 border-primary/20"
                )}
              >
                <Avatar>
                  <AvatarFallback>
                    {review.user_email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">
                      {review.user_email || 'Anonymous'}
                      {review.user_id === userId && (
                        <span className="ml-2 text-xs text-primary">(You)</span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(review.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <StarRating value={review.rating} readonly />
                  {review.comment && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
