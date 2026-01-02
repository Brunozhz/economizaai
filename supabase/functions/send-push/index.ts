import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
  email?: string;
  user_id?: string;
  admin_only?: boolean;
}

// Send push notification using Web Push Protocol
async function sendWebPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: string
): Promise<boolean> {
  try {
    // Simple HTTP POST to the push endpoint
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'TTL': '86400',
        'Urgency': 'high',
      },
      body: payload,
    });

    console.log(`Push response for ${subscription.endpoint.substring(0, 50)}: ${response.status}`);
    return response.ok || response.status === 201;
  } catch (error) {
    console.error('Error sending push:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: PushPayload = await req.json();
    console.log('Sending push notification:', payload);

    // Build query for subscriptions
    let query = supabase.from('push_subscriptions').select('*');
    
    if (payload.admin_only) {
      // Get admin user IDs first
      const { data: adminRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      if (!adminRoles || adminRoles.length === 0) {
        console.log('No admin users found');
        return new Response(
          JSON.stringify({ success: true, sent: 0, message: 'No admin users found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const adminUserIds = adminRoles.map(r => r.user_id);
      console.log('Admin user IDs:', adminUserIds);
      query = query.in('user_id', adminUserIds);
    } else if (payload.email) {
      query = query.eq('email', payload.email);
    } else if (payload.user_id) {
      query = query.eq('user_id', payload.user_id);
    }

    const { data: subscriptions, error } = await query;

    if (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No push subscriptions found');
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: 'No subscriptions found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${subscriptions.length} subscriptions`);

    const pushPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/pwa-192x192.png',
      badge: payload.badge || '/pwa-192x192.png',
      data: payload.data || {},
      timestamp: Date.now(),
    });

    let sentCount = 0;
    const failedEndpoints: string[] = [];

    // Send to each subscription
    for (const subscription of subscriptions) {
      const success = await sendWebPush(
        {
          endpoint: subscription.endpoint,
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
        pushPayload
      );

      if (success) {
        sentCount++;
      } else {
        failedEndpoints.push(subscription.endpoint);
      }
    }

    // Clean up failed subscriptions
    if (failedEndpoints.length > 0) {
      console.log(`Removing ${failedEndpoints.length} failed subscriptions`);
      const { error: deleteError } = await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', failedEndpoints);
      
      if (deleteError) {
        console.error('Error deleting failed subscriptions:', deleteError);
      }
    }

    console.log(`Push notifications sent: ${sentCount}, failed: ${failedEndpoints.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: sentCount,
        failed: failedEndpoints.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in send-push function:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
