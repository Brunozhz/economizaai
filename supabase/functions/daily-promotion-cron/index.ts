import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Promoções diárias automáticas - uma para cada dia da semana
const dailyPromotions = [
  { day: 0, title: "🌟 Domingo Especial!", content: "Comece a semana com 25% OFF em todos os produtos! Use o código DOMINGO25", discount: "25%" },
  { day: 1, title: "💪 Segunda Fitness!", content: "Segunda é dia de começar! 20% OFF em produtos fitness. Código: SEGUNDA20", discount: "20%" },
  { day: 2, title: "🔥 Terça Turbinada!", content: "Terça com energia! 30% OFF em suplementos selecionados. Código: TERCA30", discount: "30%" },
  { day: 3, title: "🎯 Quarta Premium!", content: "Metade da semana, dobro de desconto! 35% OFF hoje. Código: QUARTA35", discount: "35%" },
  { day: 4, title: "⚡ Quinta Relâmpago!", content: "Oferta relâmpago! 40% OFF por tempo limitado. Código: QUINTA40", discount: "40%" },
  { day: 5, title: "🎉 Sexta Black!", content: "Sexta com preço de Black Friday! Até 50% OFF. Código: SEXTABLACK", discount: "50%" },
  { day: 6, title: "🏆 Sábado VIP!", content: "Fim de semana VIP! 30% OFF + frete grátis. Código: SABADOVIP", discount: "30%" },
];

// Promoções aleatórias para variar
const randomPromotions = [
  { day: -1, title: "🎁 Presente Surpresa!", content: "Você foi selecionado! Ganhe 35% OFF na sua próxima compra. Código: SURPRESA35", discount: "35%" },
  { day: -1, title: "⭐ Cliente Estrela!", content: "Você é especial para nós! 25% OFF exclusivo para você. Código: ESTRELA25", discount: "25%" },
  { day: -1, title: "🚀 Oferta Espacial!", content: "Descontos fora de órbita! 45% OFF hoje. Código: ESPACIAL45", discount: "45%" },
  { day: -1, title: "💎 Diamante do Dia!", content: "Oferta rara! 40% OFF em produtos premium. Código: DIAMANTE40", discount: "40%" },
  { day: -1, title: "🌈 Arco-íris de Descontos!", content: "7 produtos, 7 descontos! Até 50% OFF. Código: ARCOIRIS50", discount: "50%" },
];

// Helper function to verify authorization
function verifyAuth(req: Request): { authorized: boolean; error?: string; status?: number } {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    return { authorized: false, error: 'Unauthorized - No authorization header', status: 401 };
  }

  const token = authHeader.replace('Bearer ', '');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  // Only allow service role key for cron jobs
  if (token !== serviceRoleKey) {
    return { authorized: false, error: 'Unauthorized - Invalid credentials', status: 401 };
  }

  return { authorized: true };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authorization - only service role can trigger this
    const authResult = verifyAuth(req);
    if (!authResult.authorized) {
      console.error("Auth failed:", authResult.error);
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { status: authResult.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting daily promotion cron job...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Pegar o dia da semana atual (0 = domingo, 6 = sábado)
    const today = new Date();
    const dayOfWeek = today.getDay();

    // Selecionar promoção baseada no dia
    let promotion = dailyPromotions.find(p => p.day === dayOfWeek) || dailyPromotions[0];

    // Às vezes (20% de chance) enviar uma promoção aleatória para variar
    if (Math.random() < 0.2) {
      promotion = randomPromotions[Math.floor(Math.random() * randomPromotions.length)];
    }

    console.log(`Selected promotion: ${promotion.title}`);

    // Buscar todos os usuários com push subscription
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (subError) {
      console.error('Error fetching subscriptions:', subError);
      throw subError;
    }

    console.log(`Found ${subscriptions?.length || 0} push subscriptions`);

    // Buscar todos os perfis para enviar mensagens
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, email, name');

    if (profileError) {
      console.error('Error fetching profiles:', profileError);
    }

    let messagesSent = 0;
    let pushSent = 0;

    // Enviar mensagem para cada usuário
    if (profiles && profiles.length > 0) {
      for (const profile of profiles) {
        const { error: msgError } = await supabase
          .from('messages')
          .insert({
            user_id: profile.user_id,
            email: profile.email,
            title: promotion.title,
            content: promotion.content,
            type: 'promotion',
            is_read: false
          });

        if (!msgError) {
          messagesSent++;
        } else {
          console.error(`Error sending message to ${profile.email}:`, msgError);
        }
      }
    }

    console.log(`Sent ${messagesSent} messages`);

    // Enviar push notifications
    if (subscriptions && subscriptions.length > 0) {
      const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
      const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');

      if (vapidPublicKey && vapidPrivateKey) {
        for (const sub of subscriptions) {
          try {
            // Chamar a função send-push para cada subscription
            const { error: pushError } = await supabase.functions.invoke('send-push', {
              body: {
                subscription: {
                  endpoint: sub.endpoint,
                  keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                  }
                },
                title: promotion.title,
                body: promotion.content,
                url: '/'
              }
            });

            if (!pushError) {
              pushSent++;
            } else {
              console.error('Push error:', pushError);
            }
          } catch (err) {
            console.error('Error sending push:', err);
          }
        }
      }
    }

    console.log(`Daily promotion cron completed: ${messagesSent} messages, ${pushSent} push notifications`);

    return new Response(
      JSON.stringify({
        success: true,
        promotion: promotion.title,
        messagesSent,
        pushSent
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in daily promotion cron:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
