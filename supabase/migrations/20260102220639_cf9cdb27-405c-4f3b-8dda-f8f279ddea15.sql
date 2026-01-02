-- Create table for push subscriptions
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own subscriptions"
ON public.push_subscriptions
FOR ALL
USING (
  auth.uid() = user_id OR 
  email = (SELECT profiles.email FROM profiles WHERE profiles.user_id = auth.uid())
)
WITH CHECK (
  auth.uid() = user_id OR 
  email = (SELECT profiles.email FROM profiles WHERE profiles.user_id = auth.uid())
);

CREATE POLICY "Service role can manage all subscriptions"
ON public.push_subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Index for faster lookups
CREATE INDEX idx_push_subscriptions_email ON public.push_subscriptions(email);
CREATE INDEX idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_push_subscriptions_updated_at
BEFORE UPDATE ON public.push_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();