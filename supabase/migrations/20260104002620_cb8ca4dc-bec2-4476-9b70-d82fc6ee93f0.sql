-- Fix 1: abandoned_carts - Add TO clause to restrict to service_role only
DROP POLICY IF EXISTS "Service role can manage abandoned carts" ON public.abandoned_carts;

CREATE POLICY "Service role can manage abandoned carts"
ON public.abandoned_carts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix 2: remarketing_coupons - Add TO clause to restrict to service_role only
DROP POLICY IF EXISTS "Service role can manage remarketing coupons" ON public.remarketing_coupons;

CREATE POLICY "Service role can manage remarketing coupons"
ON public.remarketing_coupons
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix 3: support_conversations - Fix overly permissive policies
-- First add a session_token column to track anonymous conversations
ALTER TABLE public.support_conversations
ADD COLUMN IF NOT EXISTS session_token TEXT,
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Anyone can view their conversation" ON public.support_conversations;
DROP POLICY IF EXISTS "Anyone can update support conversations" ON public.support_conversations;

-- Create proper restrictive policies for viewing
-- Users can only view conversations they created (by session_token stored in the conversation)
CREATE POLICY "Users can view own conversations by session"
ON public.support_conversations
FOR SELECT
USING (
  -- Admins can see all
  has_role(auth.uid(), 'admin') OR
  -- Authenticated users can see their own
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  -- Match by email for authenticated users
  (auth.uid() IS NOT NULL AND email = (SELECT email FROM profiles WHERE profiles.user_id = auth.uid()))
);

-- Create proper restrictive policy for updates
-- Only admins or the conversation owner can update
CREATE POLICY "Users can update own conversations"
ON public.support_conversations
FOR UPDATE
USING (
  has_role(auth.uid(), 'admin') OR
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NOT NULL AND email = (SELECT email FROM profiles WHERE profiles.user_id = auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'admin') OR
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NOT NULL AND email = (SELECT email FROM profiles WHERE profiles.user_id = auth.uid()))
);

-- Admins have full update access (already exists but re-add for clarity)
DROP POLICY IF EXISTS "Admins can update all conversations" ON public.support_conversations;
CREATE POLICY "Admins can update all conversations"
ON public.support_conversations
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));