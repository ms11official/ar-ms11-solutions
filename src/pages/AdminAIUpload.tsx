import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import DashboardLayout from "@/components/DashboardLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Upload, Plus, Trash2, Edit, Image, Link as LinkIcon, DollarSign, Tag, Users, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AIItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  image_url: string | null;
  link: string | null;
  status: string;
  type: "tool" | "service";
  created_at: string;
  features?: string[] | null;
  price?: string | number;
}

interface Category {
  id: string;
  name: string;
}

const AdminAIUpload = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiTools, setAITools] = useState<AIItem[]>([]);
  const [aiServices, setAIServices] = useState<AIItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin, loading: roleLoading } = useUserRole(user?.id);
  const { toast } = useToast();

  // Form fields
  const [itemTitle, setItemTitle] = useState("");
  const [itemShortLine, setItemShortLine] = useState("");
  const [itemKeyFeatures, setItemKeyFeatures] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemOldPrice, setItemOldPrice] = useState("");
  const [itemDiscount, setItemDiscount] = useState("");
  const [itemTestUrl, setItemTestUrl] = useState("");
  const [itemBestFor, setItemBestFor] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemStatus, setItemStatus] = useState("draft");
  const [itemType, setItemType] = useState<"tool" | "service">("tool");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !roleLoading && user && isAdmin) {
      fetchAIItems();
      fetchCategories();
    }
  }, [loading, roleLoading, user, isAdmin]);

  const fetchAIItems = async () => {
    const { data: toolsData } = await supabase
      .from("tools")
      .select("*")
      .ilike("category", "%AI%")
      .order("created_at", { ascending: false });

    const { data: servicesData } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    setAITools((toolsData || []).map(t => ({ ...t, type: "tool" as const })));
    setAIServices((servicesData || []).filter(s => 
      s.name?.toLowerCase().includes("ai") || 
      s.description?.toLowerCase().includes("ai")
    ).map(s => ({ ...s, type: "service" as const, category: "AI Services" })));
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id, name")
      .or("name.ilike.%AI%,type.eq.tool")
      .order("name");

    setCategories(data || []);
  };

  const uploadImage = async (file: File, bucket: string): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const sendNotificationsToAllUsers = async (name: string, type: string) => {
    try {
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("user_id");

      const notifications = userRoles?.map((role) => ({
        user_id: role.user_id,
        title: `New AI ${type} Added!`,
        message: `Check out "${name}" - a new AI ${type.toLowerCase()} is now available!`,
        type: "info",
        link: "/ai",
      })) || [];

      if (notifications.length > 0) {
        await supabase.from("notifications").insert(notifications);
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  };

  const buildDescription = () => {
    const parts = [];
    if (itemShortLine) parts.push(itemShortLine);
    if (itemBestFor) parts.push(`Best For: ${itemBestFor}`);
    if (itemDiscount) parts.push(`${itemDiscount}% OFF`);
    return parts.join(" | ");
  };

  const buildFeatures = () => {
    if (!itemKeyFeatures) return null;
    return itemKeyFeatures.split(",").map(f => f.trim()).filter(f => f);
  };

  const buildPrice = () => {
    let priceStr = itemPrice || "Free";
    if (itemOldPrice) priceStr = `${priceStr} (was ${itemOldPrice})`;
    return priceStr;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, itemType === "tool" ? "tools-images" : "services-images");
      }

      const description = buildDescription();
      const features = buildFeatures();
      const price = buildPrice();

      if (itemType === "tool") {
        const toolData = {
          name: itemTitle,
          description: description,
          category: itemCategory || "AI Tools",
          link: itemTestUrl || null,
          status: itemStatus,
          ...(imageUrl ? { image_url: imageUrl } : {}),
        };

        if (editingId) {
          const { error } = await supabase.from("tools").update(toolData).eq("id", editingId);
          if (error) throw error;
          toast({ title: "Success", description: "AI Tool updated successfully" });
        } else {
          const { error } = await supabase.from("tools").insert({
            ...toolData,
            created_by: user?.id,
          });
          if (error) throw error;
          if (itemStatus === "active") await sendNotificationsToAllUsers(itemTitle, "Tool");
          toast({ title: "Success", description: "AI Tool added successfully" });
        }
      } else {
        const serviceData = {
          name: itemTitle,
          description: description,
          price: price,
          features: features,
          link: itemTestUrl || null,
          status: itemStatus,
          ...(imageUrl ? { image_url: imageUrl } : {}),
        };

        if (editingId) {
          const { error } = await supabase.from("services").update(serviceData).eq("id", editingId);
          if (error) throw error;
          toast({ title: "Success", description: "AI Service updated successfully" });
        } else {
          const { error } = await supabase.from("services").insert({
            ...serviceData,
            created_by: user?.id,
          });
          if (error) throw error;
          if (itemStatus === "active") await sendNotificationsToAllUsers(itemTitle, "Service");
          toast({ title: "Success", description: "AI Service added successfully" });
        }
      }

      resetForm();
      fetchAIItems();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setItemTitle("");
    setItemShortLine("");
    setItemKeyFeatures("");
    setItemPrice("");
    setItemOldPrice("");
    setItemDiscount("");
    setItemTestUrl("");
    setItemBestFor("");
    setItemCategory("");
    setItemStatus("draft");
    setItemType("tool");
    setImageFile(null);
    setEditingId(null);
  };

  const handleEdit = (item: AIItem) => {
    setEditingId(item.id);
    setItemTitle(item.name);
    setItemShortLine(item.description?.split(" | ")[0] || "");
    setItemKeyFeatures(item.features?.join(", ") || "");
    setItemPrice(typeof item.price === 'string' ? item.price.split(" (was")[0] : String(item.price || ""));
    setItemOldPrice("");
    setItemDiscount("");
    setItemTestUrl(item.link || "");
    setItemBestFor("");
    setItemCategory(item.category);
    setItemStatus(item.status);
    setItemType(item.type);
  };

  const handleDelete = async (item: AIItem) => {
    if (!confirm("Are you sure you want to delete this?")) return;

    const table = item.type === "tool" ? "tools" : "services";
    const { error } = await supabase.from(table).delete().eq("id", item.id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Deleted successfully" });
      fetchAIItems();
    }
  };

  if (loading || roleLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-lg">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-black">AI Tools & Services</h1>
          </div>
          <p className="text-base text-muted-foreground">
            Manage AI-powered tools and services
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {editingId ? "Edit AI Item" : "Add New AI Item"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={itemType} onValueChange={(v) => setItemType(v as "tool" | "service")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tool">AI Tool</SelectItem>
                    <SelectItem value="service">AI Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemTitle">Title *</Label>
                <Input
                  id="itemTitle"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="Enter title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemShortLine">Short Line</Label>
                <Input
                  id="itemShortLine"
                  value={itemShortLine}
                  onChange={(e) => setItemShortLine(e.target.value)}
                  placeholder="Brief one-line description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemKeyFeatures">Key Features</Label>
                <Textarea
                  id="itemKeyFeatures"
                  value={itemKeyFeatures}
                  onChange={(e) => setItemKeyFeatures(e.target.value)}
                  placeholder="Feature 1, Feature 2, Feature 3 (comma separated)"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="itemPrice">Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="itemPrice"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      placeholder="29.99"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemOldPrice">Old Price</Label>
                  <Input
                    id="itemOldPrice"
                    value={itemOldPrice}
                    onChange={(e) => setItemOldPrice(e.target.value)}
                    placeholder="49.99"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemDiscount">% Off</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="itemDiscount"
                      value={itemDiscount}
                      onChange={(e) => setItemDiscount(e.target.value)}
                      placeholder="40"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemTestUrl">Test URL</Label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="itemTestUrl"
                    value={itemTestUrl}
                    onChange={(e) => setItemTestUrl(e.target.value)}
                    placeholder="https://example.com/try"
                    type="url"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemBestFor">Best For</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="itemBestFor"
                    value={itemBestFor}
                    onChange={(e) => setItemBestFor(e.target.value)}
                    placeholder="Marketers, Content Creators, etc."
                    className="pl-9"
                  />
                </div>
              </div>

              {itemType === "tool" && (
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={itemCategory} onValueChange={setItemCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AI Tools">AI Tools</SelectItem>
                      <SelectItem value="AI Image">AI Image</SelectItem>
                      <SelectItem value="AI Writing">AI Writing</SelectItem>
                      <SelectItem value="AI Video">AI Video</SelectItem>
                      <SelectItem value="AI Audio">AI Audio</SelectItem>
                      <SelectItem value="AI Code">AI Code</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={itemStatus} onValueChange={setItemStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  <Image className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  <Upload className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : editingId ? "Update" : "Add"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">
              AI Items ({aiTools.length + aiServices.length})
            </h2>
            
            <Tabs defaultValue="tools">
              <TabsList className="mb-4">
                <TabsTrigger value="tools">Tools ({aiTools.length})</TabsTrigger>
                <TabsTrigger value="services">Services ({aiServices.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="tools" className="space-y-3 max-h-[500px] overflow-y-auto">
                {aiTools.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No AI tools yet</p>
                ) : (
                  aiTools.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded object-cover" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{item.name}</p>
                            {item.link && <LinkIcon className="w-3 h-3 text-primary" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                          item.status === "draft" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}>{item.status}</span>
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(item)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="services" className="space-y-3 max-h-[500px] overflow-y-auto">
                {aiServices.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No AI services yet</p>
                ) : (
                  aiServices.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded object-cover" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{item.name}</p>
                            {item.link && <LinkIcon className="w-3 h-3 text-primary" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                          item.status === "draft" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}>{item.status}</span>
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(item)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAIUpload;