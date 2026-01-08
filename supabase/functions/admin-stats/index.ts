import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.error('No authorization header found');
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify user is admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError?.message || 'User not found');
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log('User authenticated:', user.id, user.email);

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Admin verified, fetching stats...');

    // Get period from request body
    let period = '30d';
    try {
      const body = await req.json();
      period = body.period || '30d';
    } catch {
      // If no body, use default
    }
    
    console.log('Period filter:', period);
    
    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'yesterday':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        now.setDate(now.getDate() - 1);
        now.setHours(23, 59, 59, 999);
        break;
      case '3d':
        startDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const startDateStr = startDate.toISOString();
    const endDateStr = now.toISOString();

    console.log('Date range:', startDateStr, 'to', endDateStr);

    // Fetch page views stats
    const { data: pageViews, error: pageViewsError } = await supabase
      .from('page_views')
      .select('id, created_at, page_path, session_id')
      .gte('created_at', startDateStr)
      .lte('created_at', endDateStr);

    if (pageViewsError) {
      console.error('Error fetching page views:', pageViewsError);
    }

    // Fetch ALL purchases for revenue (with the date filter)
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('id, created_at, discounted_price, original_price, status, product_name, product_image, quantity')
      .gte('created_at', startDateStr)
      .lte('created_at', endDateStr)
      .order('created_at', { ascending: false });

    if (purchasesError) {
      console.error('Error fetching purchases:', purchasesError);
    }

    // Calculate stats
    const totalPageViews = pageViews?.length || 0;
    const uniqueSessions = new Set(pageViews?.map(pv => pv.session_id).filter(Boolean) || []).size;
    
    const paidPurchases = purchases?.filter(p => p.status === 'paid' || p.status === 'completed') || [];
    const totalRevenue = paidPurchases.reduce((sum, p) => sum + Number(p.discounted_price || 0), 0);
    const totalPurchases = purchases?.length || 0;
    const completedPurchases = paidPurchases.length;

    // Group page views by date for chart
    const pageViewsByDate: Record<string, number> = {};
    pageViews?.forEach(pv => {
      const date = pv.created_at.split('T')[0];
      pageViewsByDate[date] = (pageViewsByDate[date] || 0) + 1;
    });

    // Group revenue by date for chart
    const revenueByDate: Record<string, number> = {};
    paidPurchases.forEach(p => {
      const date = p.created_at.split('T')[0];
      revenueByDate[date] = (revenueByDate[date] || 0) + Number(p.discounted_price || 0);
    });

    // Group by page path
    const viewsByPage: Record<string, number> = {};
    pageViews?.forEach(pv => {
      viewsByPage[pv.page_path] = (viewsByPage[pv.page_path] || 0) + 1;
    });

    // Calculate TOP products by sales count and revenue
    const productStats: Record<string, { 
      name: string; 
      quantity: number; 
      revenue: number; 
      image: string | null;
      lastSale: string;
    }> = {};
    
    paidPurchases.forEach(p => {
      const key = p.product_name || 'Produto Desconhecido';
      if (!productStats[key]) {
        productStats[key] = { 
          name: key, 
          quantity: 0, 
          revenue: 0, 
          image: p.product_image,
          lastSale: p.created_at
        };
      }
      productStats[key].quantity += p.quantity || 1;
      productStats[key].revenue += Number(p.discounted_price || 0);
      if (p.created_at > productStats[key].lastSale) {
        productStats[key].lastSale = p.created_at;
      }
    });

    const topProducts = Object.values(productStats)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Recent sales for notifications
    const recentSales = (purchases || []).slice(0, 20).map(p => ({
      id: p.id,
      productName: p.product_name,
      productImage: p.product_image,
      price: p.discounted_price,
      originalPrice: p.original_price,
      status: p.status,
      quantity: p.quantity,
      createdAt: p.created_at
    }));

    // Fetch customers - from profiles, leads, and abandoned_carts
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, user_id, email, name, phone, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    const { data: leads } = await supabase
      .from('leads')
      .select('id, email, coupon_code, source, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    const { data: abandonedCarts } = await supabase
      .from('abandoned_carts')
      .select('id, email, phone, product_name, product_price, created_at, is_converted')
      .order('created_at', { ascending: false })
      .limit(100);

    const { data: freeTrials } = await supabase
      .from('free_trial_claims')
      .select('id, email, name, phone, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    // Combine all customers into a unified list
    const customerMap = new Map<string, {
      id: string;
      email: string;
      name: string | null;
      phone: string | null;
      source: string;
      createdAt: string;
      productInterest?: string;
      isConverted?: boolean;
    }>();

    // Add profiles
    profiles?.forEach(p => {
      customerMap.set(p.email, {
        id: p.id,
        email: p.email,
        name: p.name,
        phone: p.phone,
        source: 'registered',
        createdAt: p.created_at
      });
    });

    // Add leads (only if not already in map or is newer)
    leads?.forEach(l => {
      if (!customerMap.has(l.email)) {
        customerMap.set(l.email, {
          id: l.id,
          email: l.email,
          name: null,
          phone: null,
          source: l.source || 'lead',
          createdAt: l.created_at
        });
      }
    });

    // Add free trial claims
    freeTrials?.forEach(ft => {
      const existing = customerMap.get(ft.email);
      if (!existing) {
        customerMap.set(ft.email, {
          id: ft.id,
          email: ft.email,
          name: ft.name,
          phone: ft.phone,
          source: 'free_trial',
          createdAt: ft.created_at
        });
      } else if (!existing.phone && ft.phone) {
        existing.phone = ft.phone;
        if (!existing.name && ft.name) existing.name = ft.name;
      }
    });

    // Add abandoned carts
    abandonedCarts?.forEach(ac => {
      const existing = customerMap.get(ac.email);
      if (!existing) {
        customerMap.set(ac.email, {
          id: ac.id,
          email: ac.email,
          name: null,
          phone: ac.phone,
          source: 'abandoned_cart',
          createdAt: ac.created_at,
          productInterest: ac.product_name,
          isConverted: ac.is_converted
        });
      } else {
        if (!existing.phone && ac.phone) existing.phone = ac.phone;
        if (!existing.productInterest) existing.productInterest = ac.product_name;
      }
    });

    const customers = Array.from(customerMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50);

    const totalCustomers = customerMap.size;

    const stats = {
      totalPageViews,
      uniqueSessions,
      totalRevenue,
      totalPurchases,
      completedPurchases,
      totalCustomers,
      period,
      pageViewsByDate: Object.entries(pageViewsByDate)
        .map(([date, views]) => ({ date, views }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      revenueByDate: Object.entries(revenueByDate)
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      viewsByPage: Object.entries(viewsByPage)
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views),
      topProducts,
      recentSales,
      customers
    };

    console.log('Stats calculated successfully');

    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in admin-stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
