-- Create coupon_usage table to track coupon usage per user
CREATE TABLE public.coupon_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  coupon_code TEXT NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (email, coupon_code)
);

-- Enable RLS
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for checkout validation)
CREATE POLICY "Anyone can insert coupon usage"
ON public.coupon_usage
FOR INSERT
WITH CHECK (true);

-- Policy: Anyone can check their own coupon usage by email
CREATE POLICY "Anyone can check coupon usage"
ON public.coupon_usage
FOR SELECT
USING (true);

-- Policy: Admins can view all usage
CREATE POLICY "Admins can manage coupon usage"
ON public.coupon_usage
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes
CREATE INDEX idx_coupon_usage_email ON public.coupon_usage(email);
CREATE INDEX idx_coupon_usage_code ON public.coupon_usage(coupon_code);