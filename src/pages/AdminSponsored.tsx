import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sponsored {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  image_url: string | null;
  link: string | null;
  badge: string | null;
  is_active: boolean;
  display_order: number;
}

const AdminSponsored = () => {
  const [items, setItems] = useState<Sponsored[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Sponsored | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    link: "",
    badge: "",
    is_active: true,
    display_order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("sponsored")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      link: "",
      badge: "",
      is_active: true,
      display_order: 0,
    });
    setImageFile(null);
    setEditingItem(null);
  };

  const handleEdit = (item: Sponsored) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price || "",
      link: item.link || "",
      badge: item.badge || "",
      is_active: item.is_active ?? true,
      display_order: item.display_order ?? 0,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = editingItem?.image_url || null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("tools-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("tools-images")
          .getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      const payload = {
        name: formData.name,
        description: formData.description || null,
        price: formData.price || null,
        link: formData.link || null,
        badge: formData.badge || null,
        is_active: formData.is_active,
        display_order: formData.display_order,
        image_url: imageUrl,
      };

      if (editingItem) {
        const { error } = await supabase
          .from("sponsored")
          .update(payload)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast({ title: "Success", description: "Sponsored item updated" });
      } else {
        const { error } = await supabase.from("sponsored").insert(payload);
        if (error) throw error;
        toast({ title: "Success", description: "Sponsored item created" });
      }

      setDialogOpen(false);
      resetForm();
      fetchItems();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    const { error } = await supabase.from("sponsored").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Sponsored item removed" });
      fetchItems();
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("sponsored")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      fetchItems();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black flex items-center gap-3">
              <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
              Sponsored Items
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage featured/sponsored items on the landing page
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Sponsored
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit Sponsored Item" : "Add Sponsored Item"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="₹499 or Free"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="badge">Badge</Label>
                    <Input
                      id="badge"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="New, Hot, etc."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">External Link</Label>
                  <Input
                    id="link"
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">Active</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? "Saving..." : editingItem ? "Update" : "Create"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Sponsored Items ({items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : items.length === 0 ? (
              <p className="text-muted-foreground">No sponsored items yet</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Badge</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.display_order}</TableCell>
                        <TableCell>
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <Star className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.price || "-"}</TableCell>
                        <TableCell>{item.badge || "-"}</TableCell>
                        <TableCell>
                          <Switch
                            checked={item.is_active ?? true}
                            onCheckedChange={() => toggleActive(item.id, item.is_active ?? true)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {item.link && (
                              <Button variant="ghost" size="icon" asChild>
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminSponsored;
