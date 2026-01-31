import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Note {
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

const AdminNotesUpload = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    status: "draft",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [noteFile, setNoteFile] = useState<File | null>(null);
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
      fetchNotes();
    }
  }, [loading, roleLoading, isAdmin]);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Failed to fetch notes");
    } else {
      setNotes(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      let imageUrl = editingNote?.image_url || null;
      let fileUrl = editingNote?.file_url || null;

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("notes-files")
          .upload(`images/${fileName}`, imageFile);

        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("notes-files").getPublicUrl(`images/${fileName}`);
        imageUrl = urlData.publicUrl;
      }

      // Upload note file if provided
      if (noteFile) {
        const fileExt = noteFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("notes-files")
          .upload(`files/${fileName}`, noteFile);

        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("notes-files").getPublicUrl(`files/${fileName}`);
        fileUrl = urlData.publicUrl;
      }

      const noteData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        category: formData.category || null,
        status: formData.status,
        image_url: imageUrl,
        file_url: fileUrl,
        created_by: user.id,
      };

      if (editingNote) {
        const { error } = await supabase
          .from("notes")
          .update(noteData)
          .eq("id", editingNote.id);
        if (error) throw error;
        toast.success("Note updated successfully");
      } else {
        const { error } = await supabase.from("notes").insert(noteData);
        if (error) throw error;
        toast.success("Note created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchNotes();
    } catch (error: any) {
      toast.error(error.message || "Failed to save note");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete note");
    } else {
      toast.success("Note deleted successfully");
      fetchNotes();
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", category: "", status: "draft" });
    setImageFile(null);
    setNoteFile(null);
    setEditingNote(null);
  };

  const openEditDialog = (note: Note) => {
    setEditingNote(note);
    setFormData({
      name: note.name,
      description: note.description || "",
      price: note.price.toString(),
      category: note.category || "",
      status: note.status,
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
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Notes Management</h1>
              <p className="text-muted-foreground text-sm">Upload and manage premium notes</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingNote ? "Edit Note" : "Add New Note"}</DialogTitle>
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
                  <Label>Note File (PDF, DOCX, etc.)</Label>
                  <Input type="file" onChange={(e) => setNoteFile(e.target.files?.[0] || null)} />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Saving..." : editingNote ? "Update Note" : "Create Note"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Card key={note.id} className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-indigo-500/20 relative">
                {note.image_url ? (
                  <img src={note.image_url} alt={note.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-12 h-12 text-blue-500/50" />
                  </div>
                )}
                <span className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold ${note.status === 'active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                  {note.status}
                </span>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-lg line-clamp-1">{note.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{note.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-500">
                    {note.price > 0 ? `₹${note.price}` : 'Free'}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => openEditDialog(note)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(note.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {notes.length === 0 && (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first note</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminNotesUpload;
