import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Prompt {
  id: string;
  name: string;
  description: string | null;
  content: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  status: string;
  created_at: string;
}

const AdminPromptsUpload = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    content: "",
    price: "",
    category: "",
    status: "draft",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
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
      fetchPrompts();
    }
  }, [loading, roleLoading, isAdmin]);

  const fetchPrompts = async () => {
    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Failed to fetch prompts");
    } else {
      setPrompts(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      let imageUrl = editingPrompt?.image_url || null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("services-images")
          .upload(`prompts/${fileName}`, imageFile);

        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("services-images").getPublicUrl(`prompts/${fileName}`);
        imageUrl = urlData.publicUrl;
      }

      const promptData = {
        name: formData.name,
        description: formData.description,
        content: formData.content,
        price: parseFloat(formData.price) || 0,
        category: formData.category || null,
        status: formData.status,
        image_url: imageUrl,
        created_by: user.id,
      };

      if (editingPrompt) {
        const { error } = await supabase
          .from("prompts")
          .update(promptData)
          .eq("id", editingPrompt.id);
        if (error) throw error;
        toast.success("Prompt updated successfully");
      } else {
        const { error } = await supabase.from("prompts").insert(promptData);
        if (error) throw error;
        toast.success("Prompt created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPrompts();
    } catch (error: any) {
      toast.error(error.message || "Failed to save prompt");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;

    const { error } = await supabase.from("prompts").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete prompt");
    } else {
      toast.success("Prompt deleted successfully");
      fetchPrompts();
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", content: "", price: "", category: "", status: "draft" });
    setImageFile(null);
    setEditingPrompt(null);
  };

  const openEditDialog = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setFormData({
      name: prompt.name,
      description: prompt.description || "",
      content: prompt.content || "",
      price: prompt.price.toString(),
      category: prompt.category || "",
      status: prompt.status,
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
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Prompts Management</h1>
              <p className="text-muted-foreground text-sm">Upload and manage AI prompts</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Prompt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPrompt ? "Edit Prompt" : "Add New Prompt"}</DialogTitle>
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
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Prompt Content</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={5}
                    placeholder="Enter the actual prompt content..."
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
                      placeholder="e.g., ChatGPT, Midjourney"
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
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Saving..." : editingPrompt ? "Update Prompt" : "Create Prompt"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <Card key={prompt.id} className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative">
                {prompt.image_url ? (
                  <img src={prompt.image_url} alt={prompt.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-purple-500/50" />
                  </div>
                )}
                <span className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold ${prompt.status === 'active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                  {prompt.status}
                </span>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-lg line-clamp-1">{prompt.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{prompt.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-purple-500">
                    {prompt.price > 0 ? `₹${prompt.price}` : 'Free'}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => openEditDialog(prompt)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(prompt.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {prompts.length === 0 && (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No prompts yet</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first prompt</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminPromptsUpload;
