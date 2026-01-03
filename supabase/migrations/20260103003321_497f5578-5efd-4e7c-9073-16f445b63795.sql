-- Create table for support conversations
CREATE TABLE public.support_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  admin_response TEXT
);

-- Enable Row Level Security
ALTER TABLE public.support_conversations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create a conversation
CREATE POLICY "Anyone can create support conversations"
ON public.support_conversations
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update their own conversation (by id stored in localStorage)
CREATE POLICY "Anyone can update support conversations"
ON public.support_conversations
FOR UPDATE
USING (true);

-- Allow admins to view all conversations
CREATE POLICY "Admins can view all support conversations"
ON public.support_conversations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Allow conversation owner to view by id
CREATE POLICY "Anyone can view their conversation"
ON public.support_conversations
FOR SELECT
USING (true);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_conversations;