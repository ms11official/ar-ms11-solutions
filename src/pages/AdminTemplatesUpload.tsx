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
import { Layout, Upload, Plus, Trash2, Edit, Image, ExternalLink, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  image_url: string | null;
  preview_url: string | null;
  file_url: string | null;
  status: string;
}

const AdminTemplatesUpload = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin, loading: roleLoading } = useUserRole(user?.id);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && !roleLoading && user && isAdmin) {
      fetchTemplates();
    }
  }, [loading, roleLoading, user, isAdmin]);

  const fetchTemplates = async () => {
    const { data } = await supabase
      .from("website_templates")
      .select("*")
      .order("created_at", { ascending: false });
    setTemplates(data || []);
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
      if (imageFile) imageUrl = await uploadFile(imageFile, "template-files");
      if (templateFile) fileUrl = await uploadFile(templateFile, "template-files");

      const data = {
        name,
        description,
        category,
        price: parseFloat(price) || 0,
        preview_url: previewUrl || null,
        status,
        ...(imageUrl && { image_url: imageUrl }),
        ...(fileUrl && { file_url: fileUrl }),
      };

      if (editingId) {
        await supabase.from("website_templates").update(data).eq("id", editingId);
        toast({ title: "Updated successfully" });
      } else {
        await supabase.from("website_templates").insert({ ...data, created_by: user?.id });
        toast({ title: "Added successfully" });
      }

      resetForm();
      fetchTemplates();
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
    setPreviewUrl("");
    setStatus("draft");
    setImageFile(null);
    setTemplateFile(null);
    setEditingId(null);
  };

  const handleEdit = (template: Template) => {
    setEditingId(template.id);
    setName(template.name);
    setDescription(template.description || "");
    setCategory(template.category || "");
    setPrice(String(template.price));
    setPreviewUrl(template.preview_url || "");
    setStatus(template.status);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    await supabase.from("website_templates").delete().eq("id", id);
    toast({ title: "Deleted successfully" });
    fetchTemplates();
  };

  if (loading || roleLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-full">Loading...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Layout className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-black">Website Templates</h1>
          </div>
          <p className="text-muted-foreground">Manage website template assets</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {editingId ? "Edit Template" : "Add New Template"}
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
                      <SelectItem value="Portfolio">Portfolio</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="Blog">Blog</SelectItem>
                      <SelectItem value="Landing Page">Landing Page</SelectItem>
                      <SelectItem value="Dashboard">Dashboard</SelectItem>
                      <SelectItem value="SaaS">SaaS</SelectItem>
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
                <Label>Live Preview URL</Label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={previewUrl} onChange={e => setPreviewUrl(e.target.value)} className="pl-9" placeholder="https://demo.example.com" />
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
                <Label>Template Files (.zip)</Label>
                <Input type="file" accept=".zip" onChange={e => setTemplateFile(e.target.files?.[0] || null)} />
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
            <h2 className="text-xl font-bold mb-4">All Templates ({templates.length})</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {templates.map(template => (
                <div key={template.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  {template.image_url ? (
                    <img src={template.image_url} alt={template.name} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                      <Image className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{template.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={template.status === "active" ? "default" : "secondary"}>{template.status}</Badge>
                      <span className="text-sm text-muted-foreground">₹{template.price}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(template)}><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(template.id)}><Trash2 className="w-4 h-4" /></Button>
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

export default AdminTemplatesUpload;