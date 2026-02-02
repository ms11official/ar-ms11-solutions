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
import { Palette, Upload, Plus, Trash2, Edit, Image, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface UIDesign {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  image_url: string | null;
  file_url: string | null;
  status: string;
}

const AdminUIUXUpload = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [designs, setDesigns] = useState<UIDesign[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin, loading: roleLoading } = useUserRole(user?.id);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("draft");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && !roleLoading && user && isAdmin) {
      fetchDesigns();
    }
  }, [loading, roleLoading, user, isAdmin]);

  const fetchDesigns = async () => {
    const { data } = await supabase
      .from("ui_ux_designs")
      .select("*")
      .order("created_at", { ascending: false });
    setDesigns(data || []);
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
      let imageUrl = null;
      let fileUrl = null;
      if (imageFile) imageUrl = await uploadFile(imageFile, "ui-ux-files");
      if (designFile) fileUrl = await uploadFile(designFile, "ui-ux-files");

      const data = {
        name,
        description,
        category,
        price: parseFloat(price) || 0,
        status,
        ...(imageUrl && { image_url: imageUrl }),
        ...(fileUrl && { file_url: fileUrl }),
      };

      if (editingId) {
        await supabase.from("ui_ux_designs").update(data).eq("id", editingId);
        toast({ title: "Updated successfully" });
      } else {
        await supabase.from("ui_ux_designs").insert({ ...data, created_by: user?.id });
        toast({ title: "Added successfully" });
      }

      resetForm();
      fetchDesigns();
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
    setImageFile(null);
    setDesignFile(null);
    setEditingId(null);
  };

  const handleEdit = (design: UIDesign) => {
    setEditingId(design.id);
    setName(design.name);
    setDescription(design.description || "");
    setCategory(design.category || "");
    setPrice(String(design.price));
    setStatus(design.status);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this design?")) return;
    await supabase.from("ui_ux_designs").delete().eq("id", id);
    toast({ title: "Deleted successfully" });
    fetchDesigns();
  };

  if (loading || roleLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-full">Loading...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-black">UI/UX Designs</h1>
          </div>
          <p className="text-muted-foreground">Manage UI/UX design assets</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {editingId ? "Edit Design" : "Add New Design"}
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
                      <SelectItem value="Web Design">Web Design</SelectItem>
                      <SelectItem value="Mobile Design">Mobile Design</SelectItem>
                      <SelectItem value="Dashboard">Dashboard</SelectItem>
                      <SelectItem value="Landing Page">Landing Page</SelectItem>
                      <SelectItem value="Icons">Icons</SelectItem>
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
                <Label>Preview Image</Label>
                <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
              </div>
              <div className="space-y-2">
                <Label>Design File</Label>
                <Input type="file" onChange={e => setDesignFile(e.target.files?.[0] || null)} />
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
            <h2 className="text-xl font-bold mb-4">All Designs ({designs.length})</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {designs.map(design => (
                <div key={design.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  {design.image_url ? (
                    <img src={design.image_url} alt={design.name} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                      <Image className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{design.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={design.status === "active" ? "default" : "secondary"}>{design.status}</Badge>
                      <span className="text-sm text-muted-foreground">₹{design.price}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(design)}><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(design.id)}><Trash2 className="w-4 h-4" /></Button>
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

export default AdminUIUXUpload;