-- Create table to track user spins
CREATE TABLE public.user_spins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  last_free_spin_at TIMESTAMP WITH TIME ZONE,
  purchased_spins INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index on user_id
CREATE UNIQUE INDEX idx_user_spins_user_id ON public.user_spins(user_id);

-- Enable RLS
ALTER TABLE public.user_spins ENABLE ROW LEVEL SECURITY;

-- Users can view their own spins
CREATE POLICY "Users can view their own spins"
ON public.user_spins
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own spins record
CREATE POLICY "Users can insert their own spins"
ON public.user_spins
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own spins
CREATE POLICY "Users can update their own spins"
ON public.user_spins
FOR UPDATE
USING (auth.uid() = user_id);

-- Create table for won coupons
CREATE TABLE public.user_coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  coupon_code TEXT NOT NULL,
  discount_percent INTEGER NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_coupons ENABLE ROW LEVEL SECURITY;

-- Users can view their own coupons
CREATE POLICY "Users can view their own coupons"
ON public.user_coupons
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own coupons
CREATE POLICY "Users can insert their own coupons"
ON public.user_coupons
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own coupons (mark as used)
CREATE POLICY "Users can update their own coupons"
ON public.user_coupons
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_spins_updated_at
BEFORE UPDATE ON public.user_spins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();