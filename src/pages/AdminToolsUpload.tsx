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
import { Wrench, Upload, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminToolsUpload = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useUserRole(user?.id);
  const { toast } = useToast();

  const [toolName, setToolName] = useState("");
  const [toolDescription, setToolDescription] = useState("");
  const [toolIcon, setToolIcon] = useState("");
  const [toolCategory, setToolCategory] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Tool Added",
      description: `${toolName} has been added successfully.`,
    });
    setToolName("");
    setToolDescription("");
    setToolIcon("");
    setToolCategory("");
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
              Add New Tool
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

              <Button type="submit" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Add Tool
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Existing Tools</h2>
            <div className="space-y-3">
              {[
                { name: "Image Compressor", category: "Image Tools", status: "Active" },
                { name: "PDF Converter", category: "Document Tools", status: "Active" },
                { name: "Code Formatter", category: "Developer Tools", status: "Active" },
                { name: "Text Analyzer", category: "Text Tools", status: "Draft" },
              ].map((tool, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{tool.name}</p>
                    <p className="text-sm text-muted-foreground">{tool.category}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      tool.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {tool.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminToolsUpload;
