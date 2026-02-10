
-- Create freelancers table
CREATE TABLE public.freelancers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  hourly_rate NUMERIC DEFAULT 0,
  fixed_price TEXT,
  pricing_type TEXT NOT NULL DEFAULT 'hourly',
  experience_years INTEGER DEFAULT 0,
  portfolio_url TEXT,
  image_url TEXT,
  rating NUMERIC DEFAULT 0,
  total_projects INTEGER DEFAULT 0,
  availability TEXT DEFAULT 'available',
  location TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.freelancers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active freelancers"
ON public.freelancers FOR SELECT
USING ((status = 'active') OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert freelancers"
ON public.freelancers FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update freelancers"
ON public.freelancers FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete freelancers"
ON public.freelancers FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Auto-update updated_at
CREATE TRIGGER update_freelancers_updated_at
BEFORE UPDATE ON public.freelancers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
