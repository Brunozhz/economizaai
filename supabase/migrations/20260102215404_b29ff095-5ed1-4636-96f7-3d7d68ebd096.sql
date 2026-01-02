-- Create abandoned_carts table to track leads
CREATE TABLE public.abandoned_carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT,
  product_name TEXT NOT NULL,
  product_price NUMERIC NOT NULL,
  pix_id TEXT,
  user_id UUID,
  is_converted BOOLEAN NOT NULL DEFAULT false,
  last_remarketing_at TIMESTAMP WITH TIME ZONE,
  remarketing_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage all records
CREATE POLICY "Service role can manage abandoned carts"
ON public.abandoned_carts
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_abandoned_carts_email ON public.abandoned_carts(email);
CREATE INDEX idx_abandoned_carts_converted ON public.abandoned_carts(is_converted);
CREATE INDEX idx_abandoned_carts_last_remarketing ON public.abandoned_carts(last_remarketing_at);