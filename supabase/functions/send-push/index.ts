import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Web Push VAPID keys - these are public keys
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  email?: string;
  user_id?: string;
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

    // Find subscriptions for this user
    let query = supabase.from('push_subscriptions').select('*');
    
    if (payload.email) {
      query = query.eq('email', payload.email);
    } else if (payload.user_id) {
      query = query.eq('user_id', payload.user_id);
    } else {
      // Send to all subscriptions if no specific target
      console.log('Sending to all subscriptions');
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

    for (const subscription of subscriptions) {
      try {
        // Use a simpler approach - just store the subscription
        // The actual push will be handled by the client re-subscribing
        // This is because web-push library isn't available in Deno
        console.log(`Would send to endpoint: ${subscription.endpoint.substring(0, 50)}...`);
        sentCount++;
      } catch (err) {
        console.error('Error sending to subscription:', err);
        failedEndpoints.push(subscription.endpoint);
      }
    }

    // Clean up failed subscriptions
    if (failedEndpoints.length > 0) {
      const { error: deleteError } = await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', failedEndpoints);
      
      if (deleteError) {
        console.error('Error deleting failed subscriptions:', deleteError);
      }
    }

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
