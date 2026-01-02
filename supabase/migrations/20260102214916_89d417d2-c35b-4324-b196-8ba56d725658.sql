-- Create messages table for remarketing
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  phone TEXT,
  email TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'remarketing',
  is_read BOOLEAN NOT NULL DEFAULT false,
  product_name TEXT,
  product_price NUMERIC,
  pix_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own messages (by user_id or email)
CREATE POLICY "Users can view their own messages by user_id"
ON public.messages
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own messages by email"
ON public.messages
FOR SELECT
USING (email = (SELECT email FROM public.profiles WHERE user_id = auth.uid()));

-- Policy for updating read status
CREATE POLICY "Users can update their own messages"
ON public.messages
FOR UPDATE
USING (auth.uid() = user_id OR email = (SELECT email FROM public.profiles WHERE user_id = auth.uid()));

-- Allow anonymous inserts for remarketing (from edge function)
CREATE POLICY "Allow insert from service role"
ON public.messages
FOR INSERT
WITH CHECK (true);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;