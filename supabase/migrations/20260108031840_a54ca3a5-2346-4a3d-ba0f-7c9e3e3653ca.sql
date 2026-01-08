-- Tabela para registrar resgates gratuitos
CREATE TABLE public.free_trial_claims (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  phone text NOT NULL,
  name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT unique_email UNIQUE (email),
  CONSTRAINT unique_phone UNIQUE (phone)
);

-- Habilitar RLS
ALTER TABLE public.free_trial_claims ENABLE ROW LEVEL SECURITY;

-- Policy para service role gerenciar
CREATE POLICY "Service role can manage free trial claims"
ON public.free_trial_claims
FOR ALL
USING (true)
WITH CHECK (true);

-- Policy para admins visualizarem
CREATE POLICY "Admins can view free trial claims"
ON public.free_trial_claims
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));