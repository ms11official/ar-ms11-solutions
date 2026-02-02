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
import { Loader, Upload, Plus, Trash2, Edit, Play, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Animation {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  preview_url: string | null;
  file_url: string | null;
  status: string;
}

const AdminAnimationsUpload = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [animations, setAnimations] = useState<Animation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin, loading: roleLoading } = useUserRole(user?.id);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("draft");
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [animationFile, setAnimationFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && !roleLoading && user && isAdmin) {
      fetchAnimations();
    }
  }, [loading, roleLoading, user, isAdmin]);

  const fetchAnimations = async () => {
    const { data } = await supabase
      .from("loading_animations")
      .select("*")
      .order("created_at", { ascending: false });
    setAnimations(data || []);
  };

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) return null;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let previewUrl = null;
      let fileUrl = null;
      if (previewFile) previewUrl = await uploadFile(previewFile, "animation-files");
      if (animationFile) fileUrl = await uploadFile(animationFile, "animation-files");

      const data = {
        name,
        description,
        category,
        price: parseFloat(price) || 0,
        status,
        ...(previewUrl && { preview_url: previewUrl }),
        ...(fileUrl && { file_url: fileUrl }),
      };

      if (editingId) {
        await supabase.from("loading_animations").update(data).eq("id", editingId);
        toast({ title: "Updated successfully" });
      } else {
        await supabase.from("loading_animations").insert({ ...data, created_by: user?.id });
        toast({ title: "Added successfully" });
      }

      resetForm();
      fetchAnimations();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setStatus("draft");
    setPreviewFile(null);
    setAnimationFile(null);
    setEditingId(null);
  };

  const handleEdit = (animation: Animation) => {
    setEditingId(animation.id);
    setName(animation.name);
    setDescription(animation.description || "");
    setCategory(animation.category || "");
    setPrice(String(animation.price));
    setStatus(animation.status);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this animation?")) return;
    await supabase.from("loading_animations").delete().eq("id", id);
    toast({ title: "Deleted successfully" });
    fetchAnimations();
  };

  if (loading || roleLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-full">Loading...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Loader className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-black">Loading Animations</h1>
          </div>
          <p className="text-muted-foreground">Manage loading animation assets</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {editingId ? "Edit Animation" : "Add New Animation"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Spinner">Spinner</SelectItem>
                      <SelectItem value="Progress">Progress</SelectItem>
                      <SelectItem value="Skeleton">Skeleton</SelectItem>
                      <SelectItem value="Pulse">Pulse</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={price} onChange={e => setPrice(e.target.value)} className="pl-9" type="number" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preview (GIF/Video)</Label>
                <Input type="file" accept="image/gif,video/*" onChange={e => setPreviewFile(e.target.files?.[0] || null)} />
              </div>
              <div className="space-y-2">
                <Label>Animation File</Label>
                <Input type="file" onChange={e => setAnimationFile(e.target.files?.[0] || null)} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  <Upload className="w-4 h-4 mr-2" />
                  {editingId ? "Update" : "Add"}
                </Button>
                {editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">All Animations ({animations.length})</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {animations.map(animation => (
                <div key={animation.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  {animation.preview_url ? (
                    <img src={animation.preview_url} alt={animation.name} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                      <Play className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{animation.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={animation.status === "active" ? "default" : "secondary"}>{animation.status}</Badge>
                      <span className="text-sm text-muted-foreground">₹{animation.price}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(animation)}><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(animation.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnimationsUpload;