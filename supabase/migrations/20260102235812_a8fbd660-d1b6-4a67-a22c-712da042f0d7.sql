-- Create table for remarketing coupons tied to specific products
CREATE TABLE public.remarketing_coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  coupon_code TEXT NOT NULL,
  discount_percent INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  product_price NUMERIC NOT NULL,
  pix_id TEXT,
  is_used BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(coupon_code)
);

-- Enable RLS
ALTER TABLE public.remarketing_coupons ENABLE ROW LEVEL SECURITY;

-- Policy for service role to manage coupons
CREATE POLICY "Service role can manage remarketing coupons"
ON public.remarketing_coupons
FOR ALL
USING (true)
WITH CHECK (true);

-- Index for faster lookups
CREATE INDEX idx_remarketing_coupons_email ON public.remarketing_coupons(email);
CREATE INDEX idx_remarketing_coupons_code ON public.remarketing_coupons(coupon_code);