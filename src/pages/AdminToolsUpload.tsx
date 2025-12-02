import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Wrench, Upload, Plus, Trash2, Edit, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Tool {
  id: string;
  name: string;
  description: string | null;
  category: string;
  icon: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
}

const AdminToolsUpload = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState<Tool[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useUserRole(user?.id);
  const { toast } = useToast();

  const [toolName, setToolName] = useState("");
  const [toolDescription, setToolDescription] = useState("");
  const [toolIcon, setToolIcon] = useState("");
  const [toolCategory, setToolCategory] = useState("");
  const [toolStatus, setToolStatus] = useState("draft");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!loading && !roleLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [loading, roleLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchTools();
    }
  }, [isAdmin]);

  const fetchTools = async () => {
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tools:", error);
    } else {
      setTools(data || []);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("tools-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return null;
    }

    const { data } = supabase.storage.from("tools-images").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (editingId) {
        const updateData: Record<string, unknown> = {
          name: toolName,
          description: toolDescription,
          category: toolCategory,
          icon: toolIcon,
          status: toolStatus,
        };
        if (imageUrl) updateData.image_url = imageUrl;

        const { error } = await supabase
          .from("tools")
          .update(updateData)
          .eq("id", editingId);

        if (error) throw error;
        toast({ title: "Success", description: "Tool updated successfully" });
      } else {
        const { error } = await supabase.from("tools").insert({
          name: toolName,
          description: toolDescription,
          category: toolCategory,
          icon: toolIcon,
          image_url: imageUrl,
          status: toolStatus,
          created_by: user?.id,
        });

        if (error) throw error;
        toast({ title: "Success", description: "Tool added successfully" });
      }

      resetForm();
      fetchTools();
    } catch (error: unknown) {
      console.error("Error saving tool:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save tool",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setToolName("");
    setToolDescription("");
    setToolIcon("");
    setToolCategory("");
    setToolStatus("draft");
    setImageFile(null);
    setEditingId(null);
  };

  const handleEdit = (tool: Tool) => {
    setEditingId(tool.id);
    setToolName(tool.name);
    setToolDescription(tool.description || "");
    setToolIcon(tool.icon || "");
    setToolCategory(tool.category);
    setToolStatus(tool.status);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tool?")) return;

    const { error } = await supabase.from("tools").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete tool", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Tool deleted successfully" });
      fetchTools();
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

  if (!isAdmin) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Wrench className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-black">Tools Upload</h1>
          </div>
          <p className="text-base text-muted-foreground">
            Add and manage tools for users
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {editingId ? "Edit Tool" : "Add New Tool"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="toolName">Tool Name</Label>
                <Input
                  id="toolName"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  placeholder="Enter tool name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="toolCategory">Category</Label>
                <Input
                  id="toolCategory"
                  value={toolCategory}
                  onChange={(e) => setToolCategory(e.target.value)}
                  placeholder="e.g., Image Tools, Text Tools"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="toolIcon">Icon Name (Lucide)</Label>
                <Input
                  id="toolIcon"
                  value={toolIcon}
                  onChange={(e) => setToolIcon(e.target.value)}
                  placeholder="e.g., Image, FileText, Code"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="toolStatus">Status</Label>
                <Select value={toolStatus} onValueChange={setToolStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toolImage">Tool Image</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="toolImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  <Image className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toolDescription">Description</Label>
                <Textarea
                  id="toolDescription"
                  value={toolDescription}
                  onChange={(e) => setToolDescription(e.target.value)}
                  placeholder="Describe what this tool does..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  <Upload className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : editingId ? "Update Tool" : "Add Tool"}
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
            <h2 className="text-xl font-bold mb-6">Existing Tools ({tools.length})</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {tools.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No tools added yet</p>
              ) : (
                tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      {tool.image_url && (
                        <img
                          src={tool.image_url}
                          alt={tool.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{tool.name}</p>
                        <p className="text-sm text-muted-foreground">{tool.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          tool.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : tool.status === "draft"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        {tool.status}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(tool)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDelete(tool.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminToolsUpload;
