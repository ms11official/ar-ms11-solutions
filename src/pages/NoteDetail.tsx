import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, IndianRupee, Download, ArrowLeft, Check, ShoppingCart } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import ShareButtons from "@/components/ShareButtons";
import RelatedItems from "@/components/RelatedItems";
import ReviewSection from "@/components/ReviewSection";
import { initiateRazorpayPayment } from "@/lib/razorpay";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  image_url: string | null;
  file_url: string | null;
  status: string;
  created_at: string;
}

const NoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchNote();
      checkPurchaseStatus();
    }
  }, [id]);

  const fetchNote = async () => {
    const { data } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .single();

    if (data) setNote(data);
    setLoading(false);
  };

  const checkPurchaseStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("item_id", id)
      .eq("item_type", "notes")
      .eq("status", "completed")
      .single();

    setIsPurchased(!!data);
  };

  const handlePurchase = async () => {
    if (!note) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: "Please login", description: "You need to login to make a purchase", variant: "destructive" });
      return;
    }

    if (note.price === 0) {
      setIsPurchased(true);
      toast({ title: "Success", description: "This item is free! You can download it now." });
      return;
    }

    setPurchasing(true);
    await initiateRazorpayPayment({
      itemId: note.id,
      itemType: "notes",
      amount: note.price,
      itemName: note.name,
      onSuccess: () => {
        setIsPurchased(true);
        setPurchasing(false);
      },
      onFailure: () => setPurchasing(false),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-4">
          <Skeleton className="h-96 rounded-xl mb-6" />
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-24 rounded-xl" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-4 text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Note not found</h1>
          <Link to="/notes">
            <Button>Back to Notes</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link to="/notes" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <Card className="overflow-hidden">
                <div className="aspect-video relative bg-muted">
                  {note.image_url ? (
                    <img src={note.image_url} alt={note.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-24 h-24 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </Card>

              {/* Details */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {note.category && (
                      <Badge className="mb-2">{note.category}</Badge>
                    )}
                    <h1 className="text-2xl md:text-3xl font-bold">{note.name}</h1>
                  </div>
                  <FavoriteButton itemId={note.id} itemType="notes" />
                </div>
                
                {note.description && (
                  <p className="text-muted-foreground leading-relaxed">{note.description}</p>
                )}

                <div className="mt-6">
                  <ShareButtons title={note.name} />
                </div>
              </Card>

              {/* Reviews */}
              <ReviewSection itemId={note.id} itemType="notes" />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 sticky top-24">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center text-3xl font-bold text-primary">
                    <IndianRupee className="w-8 h-8" />
                    <span>{note.price > 0 ? note.price : "Free"}</span>
                  </div>
                </div>

                {isPurchased ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center text-green-600 mb-2">
                      <Check className="w-5 h-5 mr-2" />
                      <span className="font-medium">Purchased</span>
                    </div>
                    {note.file_url && (
                      <Button asChild className="w-full">
                        <a href={note.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          Download File
                        </a>
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handlePurchase}
                    disabled={purchasing}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {purchasing ? "Processing..." : note.price > 0 ? "Buy Now" : "Get Free"}
                  </Button>
                )}

                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Instant download after purchase
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Lifetime access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Money-back guarantee
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Related Items */}
          {note.category && (
            <div className="mt-12">
              <RelatedItems 
                itemType="notes" 
                category={note.category} 
                currentItemId={note.id} 
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NoteDetail;
