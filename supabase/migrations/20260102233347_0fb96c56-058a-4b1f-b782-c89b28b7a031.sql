-- Create leads table for email capture
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'popup_cupom',
  coupon_code TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert leads (for unauthenticated users)
CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Policy: Admins can view all leads
CREATE POLICY "Admins can view all leads"
ON public.leads
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create index for faster lookups
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);