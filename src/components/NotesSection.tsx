import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight, FileText, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Note {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
}

const NotesSection = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await supabase
        .from("notes")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(4);
      
      if (data) setNotes(data);
      setLoading(false);
    };
    fetchNotes();
  }, []);

  if (loading || notes.length === 0) return null;

  return (
    <section id="notes" className="max-w-7xl mx-auto px-6 lg:px-10 mb-24">
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-foreground">Premium Notes</h2>
          </div>
          <p className="text-muted-foreground">Curated study materials and documentation</p>
        </div>
        <Link to="/notes" className="flex items-center gap-2 text-accent font-bold text-sm hover:underline">
          View All Notes <span className="material-symbols-outlined text-[18px]">open_in_new</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {notes.map((note, index) => (
          <div key={note.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="aspect-[4/3] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 relative overflow-hidden">
              {note.image_url ? (
                <img src={note.image_url} alt={note.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-16 h-16 text-blue-500/50" />
                </div>
              )}
              {note.category && (
                <span className="absolute top-3 left-3 px-3 py-1 bg-background/90 backdrop-blur-sm text-muted-foreground text-[10px] font-bold rounded-full uppercase tracking-tighter">
                  {note.category}
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">{note.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{note.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-foreground">
                  {note.price > 0 ? `₹${note.price}` : 'Free'}
                </span>
                <Link to={`/notes/${note.id}`}>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    {note.price > 0 ? 'Buy Now' : 'Get Free'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NotesSection;
