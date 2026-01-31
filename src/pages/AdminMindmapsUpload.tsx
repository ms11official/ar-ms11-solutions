import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Network } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Mindmap {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  file_url: string | null;
  category: string | null;
  status: string;
  created_at: string;
}

const AdminMindmapsUpload = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mindmaps, setMindmaps] = useState<Mindmap[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMindmap, setEditingMindmap] = useState<Mindmap | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    status: "draft",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mindmapFile, setMindmapFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { isAdmin, loading: roleLoading } = useUserRole(user?.id);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && !roleLoading && isAdmin) {
      fetchMindmaps();
    }
  }, [loading, roleLoading, isAdmin]);

  const fetchMindmaps = async () => {
    const { data, error } = await supabase
      .from("mindmaps")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Failed to fetch mindmaps");
    } else {
      setMindmaps(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      let imageUrl = editingMindmap?.image_url || null;
      let fileUrl = editingMindmap?.file_url || null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("mindmaps-files")
          .upload(`images/${fileName}`, imageFile);

        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("mindmaps-files").getPublicUrl(`images/${fileName}`);
        imageUrl = urlData.publicUrl;
      }

      if (mindmapFile) {
        const fileExt = mindmapFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("mindmaps-files")
          .upload(`files/${fileName}`, mindmapFile);

        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("mindmaps-files").getPublicUrl(`files/${fileName}`);
        fileUrl = urlData.publicUrl;
      }

      const mindmapData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        category: formData.category || null,
        status: formData.status,
        image_url: imageUrl,
        file_url: fileUrl,
        created_by: user.id,
      };

      if (editingMindmap) {
        const { error } = await supabase
          .from("mindmaps")
          .update(mindmapData)
          .eq("id", editingMindmap.id);
        if (error) throw error;
        toast.success("Mindmap updated successfully");
      } else {
        const { error } = await supabase.from("mindmaps").insert(mindmapData);
        if (error) throw error;
        toast.success("Mindmap created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchMindmaps();
    } catch (error: any) {
      toast.error(error.message || "Failed to save mindmap");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mindmap?")) return;

    const { error } = await supabase.from("mindmaps").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete mindmap");
    } else {
      toast.success("Mindmap deleted successfully");
      fetchMindmaps();
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", category: "", status: "draft" });
    setImageFile(null);
    setMindmapFile(null);
    setEditingMindmap(null);
  };

  const openEditDialog = (mindmap: Mindmap) => {
    setEditingMindmap(mindmap);
    setFormData({
      name: mindmap.name,
      description: mindmap.description || "",
      price: mindmap.price.toString(),
      category: mindmap.category || "",
      status: mindmap.status,
    });
    setIsDialogOpen(true);
  };

  if (loading || roleLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Network className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Mindmaps Management</h1>
              <p className="text-muted-foreground text-sm">Upload and manage mindmaps</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Mindmap
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingMindmap ? "Edit Mindmap" : "Add New Mindmap"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0 for free"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cover Image</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                </div>
                <div>
                  <Label>Mindmap File (PDF, Image, etc.)</Label>
                  <Input type="file" onChange={(e) => setMindmapFile(e.target.files?.[0] || null)} />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Saving..." : editingMindmap ? "Update Mindmap" : "Create Mindmap"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mindmaps.map((mindmap) => (
            <Card key={mindmap.id} className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-teal-500/20 relative">
                {mindmap.image_url ? (
                  <img src={mindmap.image_url} alt={mindmap.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Network className="w-12 h-12 text-emerald-500/50" />
                  </div>
                )}
                <span className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold ${mindmap.status === 'active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                  {mindmap.status}
                </span>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-lg line-clamp-1">{mindmap.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{mindmap.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-emerald-500">
                    {mindmap.price > 0 ? `₹${mindmap.price}` : 'Free'}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => openEditDialog(mindmap)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(mindmap.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {mindmaps.length === 0 && (
          <div className="text-center py-20">
            <Network className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No mindmaps yet</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first mindmap</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminMindmapsUpload;
