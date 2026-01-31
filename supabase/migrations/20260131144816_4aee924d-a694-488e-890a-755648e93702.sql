-- Create notes table
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  file_url TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prompts table
CREATE TABLE public.prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  content TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mindmaps table
CREATE TABLE public.mindmaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  file_url TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchases table to track user purchases
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mindmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Notes policies
CREATE POLICY "Anyone can view active notes" ON public.notes
  FOR SELECT USING ((status = 'active') OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert notes" ON public.notes
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update notes" ON public.notes
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete notes" ON public.notes
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Prompts policies
CREATE POLICY "Anyone can view active prompts" ON public.prompts
  FOR SELECT USING ((status = 'active') OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert prompts" ON public.prompts
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update prompts" ON public.prompts
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete prompts" ON public.prompts
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Mindmaps policies
CREATE POLICY "Anyone can view active mindmaps" ON public.mindmaps
  FOR SELECT USING ((status = 'active') OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert mindmaps" ON public.mindmaps
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update mindmaps" ON public.mindmaps
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete mindmaps" ON public.mindmaps
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Purchases policies
CREATE POLICY "Users can view their own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases" ON public.purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own purchases" ON public.purchases
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases" ON public.purchases
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mindmaps_updated_at
  BEFORE UPDATE ON public.mindmaps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for files
INSERT INTO storage.buckets (id, name, public) VALUES ('notes-files', 'notes-files', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('mindmaps-files', 'mindmaps-files', true);

-- Storage policies for notes-files
CREATE POLICY "Anyone can view notes files" ON storage.objects
  FOR SELECT USING (bucket_id = 'notes-files');

CREATE POLICY "Admins can upload notes files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'notes-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update notes files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'notes-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete notes files" ON storage.objects
  FOR DELETE USING (bucket_id = 'notes-files' AND has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for mindmaps-files
CREATE POLICY "Anyone can view mindmaps files" ON storage.objects
  FOR SELECT USING (bucket_id = 'mindmaps-files');

CREATE POLICY "Admins can upload mindmaps files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'mindmaps-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update mindmaps files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'mindmaps-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete mindmaps files" ON storage.objects
  FOR DELETE USING (bucket_id = 'mindmaps-files' AND has_role(auth.uid(), 'admin'::app_role));