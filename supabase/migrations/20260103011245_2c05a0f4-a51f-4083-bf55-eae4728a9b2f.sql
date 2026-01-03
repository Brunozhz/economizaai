-- Create a function to get the roulette ranking (top discounts)
-- This ensures user emails and coupon codes are not exposed
CREATE OR REPLACE FUNCTION public.get_roulette_ranking(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  user_name TEXT,
  discount_percent INTEGER,
  won_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COALESCE(p.name, CONCAT(SUBSTRING(uc.email FROM 1 FOR 3), '***')) as user_name,
    uc.discount_percent,
    uc.created_at as won_at
  FROM user_coupons uc
  LEFT JOIN profiles p ON p.email = uc.email
  WHERE uc.discount_percent >= 25  -- Only show significant wins
  ORDER BY uc.discount_percent DESC, uc.created_at DESC
  LIMIT limit_count;
$$;