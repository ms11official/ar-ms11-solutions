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
import { Users, Upload, Plus, Trash2, Edit, Image, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Freelancer {
  id: string;
  name: string;
  title: string;
  description: string | null;
  category: string;
  skills: string[];
  hourly_rate: number;
  fixed_price: string | null;
  pricing_type: string;
  experience_years: number;
  portfolio_url: string | null;
  image_url: string | null;
  rating: number;
  total_projects: number;
  availability: string;
  location: string | null;
  status: string;
  created_at: string;
}

const AdminFreelancersUpload = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin, loading: roleLoading } = useUserRole(user?.id);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");
  const [hourlyRate, setHourlyRate] = useState("0");
  const [fixedPrice, setFixedPrice] = useState("");
  const [pricingType, setPricingType] = useState("hourly");
  const [experienceYears, setExperienceYears] = useState("0");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [rating, setRating] = useState("0");
  const [totalProjects, setTotalProjects] = useState("0");
  const [availability, setAvailability] = useState("available");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("draft");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !roleLoading && user && isAdmin) fetchFreelancers();
  }, [loading, roleLoading, user, isAdmin]);

  const fetchFreelancers = async () => {
    const { data, error } = await supabase
      .from("freelancers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("Error fetching freelancers:", error);
    else setFreelancers(data || []);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `freelancers/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("services-images").upload(fileName, file);
    if (uploadError) { console.error("Error uploading image:", uploadError); return null; }
    const { data } = supabase.storage.from("services-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (imageFile) imageUrl = await uploadImage(imageFile);

      const freelancerData = {
        name,
        title,
        description,
        category,
        skills: skills.split(",").map(s => s.trim()).filter(Boolean),
        hourly_rate: parseFloat(hourlyRate) || 0,
        fixed_price: fixedPrice || null,
        pricing_type: pricingType,
        experience_years: parseInt(experienceYears) || 0,
        portfolio_url: portfolioUrl || null,
        rating: parseFloat(rating) || 0,
        total_projects: parseInt(totalProjects) || 0,
        availability,
        location: location || null,
        status,
      };

      if (editingId) {
        const updateData: Record<string, unknown> = { ...freelancerData };
        if (imageUrl) updateData.image_url = imageUrl;
        const { error } = await supabase.from("freelancers").update(updateData).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Success", description: "Freelancer updated successfully" });
      } else {
        const insertData: Record<string, unknown> = { ...freelancerData, created_by: user?.id };
        if (imageUrl) insertData.image_url = imageUrl;
        const { error } = await supabase.from("freelancers").insert(insertData as any);
        if (error) throw error;
        toast({ title: "Success", description: "Freelancer added successfully" });
      }
      resetForm();
      fetchFreelancers();
    } catch (error: unknown) {
      console.error("Error saving freelancer:", error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to save freelancer", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName(""); setTitle(""); setDescription(""); setCategory(""); setSkills("");
    setHourlyRate("0"); setFixedPrice(""); setPricingType("hourly"); setExperienceYears("0");
    setPortfolioUrl(""); setRating("0"); setTotalProjects("0"); setAvailability("available");
    setLocation(""); setStatus("draft"); setImageFile(null); setEditingId(null);
  };

  const handleEdit = (f: Freelancer) => {
    setEditingId(f.id); setName(f.name); setTitle(f.title); setDescription(f.description || "");
    setCategory(f.category); setSkills(f.skills.join(", ")); setHourlyRate(String(f.hourly_rate));
    setFixedPrice(f.fixed_price || ""); setPricingType(f.pricing_type);
    setExperienceYears(String(f.experience_years)); setPortfolioUrl(f.portfolio_url || "");
    setRating(String(f.rating)); setTotalProjects(String(f.total_projects));
    setAvailability(f.availability); setLocation(f.location || ""); setStatus(f.status);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this freelancer?")) return;
    const { error } = await supabase.from("freelancers").delete().eq("id", id);
    if (error) toast({ title: "Error", description: "Failed to delete freelancer", variant: "destructive" });
    else { toast({ title: "Success", description: "Freelancer deleted successfully" }); fetchFreelancers(); }
  };

  if (loading || roleLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-full"><div className="text-lg">Loading...</div></div></DashboardLayout>;
  }

  const categoryOptions = ["Web Development", "Design", "Content & Marketing", "Mobile Development", "Data Science", "DevOps", "Video & Animation", "Music & Audio"];

  return (
    <DashboardLayout>
      <div className="p-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-black">Freelancers Management</h1>
          </div>
          <p className="text-base text-muted-foreground">Add and manage freelancers for the marketplace</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {editingId ? "Edit Freelancer" : "Add New Freelancer"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Senior React Developer" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Pricing Type</Label>
                  <Select value={pricingType} onValueChange={setPricingType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="contact">Contact for Quote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Hourly Rate (₹)</Label>
                  <Input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Experience (years)</Label>
                  <Input type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Rating (0-5)</Label>
                  <Input type="number" step="0.1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Projects</Label>
                  <Input type="number" value={totalProjects} onChange={(e) => setTotalProjects(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Skills (comma separated)</Label>
                <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, TypeScript" />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Mumbai, India" />
              </div>

              <div className="space-y-2">
                <Label>Portfolio URL</Label>
                <Input value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://portfolio.com" type="url" />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Profile Image</Label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="About the freelancer..." rows={4} required />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  <Upload className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : editingId ? "Update Freelancer" : "Add Freelancer"}
                </Button>
                {editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Existing Freelancers ({freelancers.length})</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {freelancers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No freelancers added yet</p>
              ) : (
                freelancers.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {f.image_url && <img src={f.image_url} alt={f.name} className="w-10 h-10 rounded-full object-cover" />}
                      <div>
                        <p className="font-medium">{f.name}</p>
                        <p className="text-sm text-muted-foreground">{f.title} • {f.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        f.status === "active" ? "bg-green-100 text-green-800" :
                        f.status === "draft" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>{f.status}</span>
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(f)}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(f.id)}><Trash2 className="w-4 h-4" /></Button>
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

export default AdminFreelancersUpload;
