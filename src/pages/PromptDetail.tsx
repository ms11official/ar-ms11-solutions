import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, IndianRupee, Copy, ArrowLeft, Check, ShoppingCart } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import ShareButtons from "@/components/ShareButtons";
import RelatedItems from "@/components/RelatedItems";
import ReviewSection from "@/components/ReviewSection";
import { initiateRazorpayPayment } from "@/lib/razorpay";
import { useToast } from "@/hooks/use-toast";

interface Prompt {
  id: string;
  name: string;
  description: string | null;
  content: string | null;
  category: string | null;
  price: number;
  image_url: string | null;
  status: string;
  created_at: string;
}

const PromptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchPrompt();
      checkPurchaseStatus();
    }
  }, [id]);

  const fetchPrompt = async () => {
    const { data } = await supabase
      .from("prompts")
      .select("*")
      .eq("id", id)
      .single();

    if (data) setPrompt(data);
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
      .eq("item_type", "prompts")
      .eq("status", "completed")
      .single();

    setIsPurchased(!!data);
  };

  const handlePurchase = async () => {
    if (!prompt) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: "Please login", description: "You need to login to make a purchase", variant: "destructive" });
      return;
    }

    if (prompt.price === 0) {
      setIsPurchased(true);
      toast({ title: "Success", description: "This item is free! You can access it now." });
      return;
    }

    setPurchasing(true);
    await initiateRazorpayPayment({
      itemId: prompt.id,
      itemType: "prompts",
      amount: prompt.price,
      itemName: prompt.name,
      onSuccess: () => {
        setIsPurchased(true);
        setPurchasing(false);
      },
      onFailure: () => setPurchasing(false),
    });
  };

  const copyPrompt = () => {
    if (prompt?.content) {
      navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Copied!", description: "Prompt copied to clipboard" });
    }
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

  if (!prompt) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-4 text-center">
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Prompt not found</h1>
          <Link to="/prompts">
            <Button>Back to Prompts</Button>
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
          <Link to="/prompts" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Prompts
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <Card className="overflow-hidden">
                <div className="aspect-video relative bg-gradient-to-br from-primary/20 to-primary/5">
                  {prompt.image_url ? (
                    <img src={prompt.image_url} alt={prompt.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MessageSquare className="w-24 h-24 text-primary" />
                    </div>
                  )}
                </div>
              </Card>

              {/* Details */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {prompt.category && (
                      <Badge className="mb-2">{prompt.category}</Badge>
                    )}
                    <h1 className="text-2xl md:text-3xl font-bold">{prompt.name}</h1>
                  </div>
                  <FavoriteButton itemId={prompt.id} itemType="prompts" />
                </div>
                
                {prompt.description && (
                  <p className="text-muted-foreground leading-relaxed">{prompt.description}</p>
                )}

                {/* Prompt Content */}
                {isPurchased && prompt.content && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Prompt Content</h3>
                      <Button variant="outline" size="sm" onClick={copyPrompt}>
                        {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm font-mono">{prompt.content}</pre>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <ShareButtons title={prompt.name} />
                </div>
              </Card>

              {/* Reviews */}
              <ReviewSection itemId={prompt.id} itemType="prompts" />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 sticky top-24">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center text-3xl font-bold text-primary">
                    <IndianRupee className="w-8 h-8" />
                    <span>{prompt.price > 0 ? prompt.price : "Free"}</span>
                  </div>
                </div>

                {isPurchased ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center text-green-600 mb-2">
                      <Check className="w-5 h-5 mr-2" />
                      <span className="font-medium">Purchased</span>
                    </div>
                    <Button className="w-full" onClick={copyPrompt}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Prompt
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handlePurchase}
                    disabled={purchasing}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {purchasing ? "Processing..." : prompt.price > 0 ? "Buy Now" : "Get Free"}
                  </Button>
                )}

                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Instant access after purchase
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Easy copy to clipboard
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Works with ChatGPT, Claude, etc.
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Related Items */}
          {prompt.category && (
            <div className="mt-12">
              <RelatedItems 
                itemType="prompts" 
                category={prompt.category} 
                currentItemId={prompt.id} 
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PromptDetail;
