import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PromotionRequest {
  title?: string;
  content?: string;
  discountPercentage?: number;
  productName?: string;
  useRandom?: boolean;
}

// Promoções diárias com descontos variados
const dailyPromotions = [
  {
    title: "🔥 PROMOÇÃO RELÂMPAGO! 30% OFF",
    content: `🎉 **OFERTA ESPECIAL DO DIA!**

Hoje você tem **30% de desconto** em todos os nossos créditos!

Essa é sua chance de economizar ainda mais enquanto investe no seu futuro.

⏰ **Válido apenas por 24 horas!**

💡 Use o código: **FLASH30**

Não perca essa oportunidade única! 🚀`,
    discountPercentage: 30,
  },
  {
    title: "💎 Oferta VIP - 25% de Desconto",
    content: `Olá! 👋

Você foi selecionado para uma **oferta exclusiva VIP**!

Por ser um cliente especial, você tem direito a **25% de desconto** na sua próxima compra.

🎯 **O que você ganha:**
- 25% OFF em qualquer pacote
- Créditos extras de bônus
- Atendimento prioritário

💫 **Código promocional: VIP25**

Aproveite enquanto dura! 💚`,
    discountPercentage: 25,
  },
  {
    title: "🎁 Presente do Dia - 20% OFF",
    content: `Bom dia! ☀️

Hoje acordamos generosos e temos um **presente especial** para você!

✨ **20% de desconto** em todos os nossos serviços!

Por que esperar? O momento perfeito para investir em você é **AGORA**!

🔑 Use: **PRESENTE20**

Te esperamos! 💚`,
    discountPercentage: 20,
  },
  {
    title: "⚡ Última Chance - 35% OFF",
    content: `🚨 **ATENÇÃO!**

Essa é a **MAIOR promoção do mês**!

Por tempo limitado, você tem **35% de desconto** em qualquer compra!

Muitos já aproveitaram... Não fique de fora!

🏷️ **Código: MEGA35**

⏳ Corre que está acabando! 🏃‍♂️`,
    discountPercentage: 35,
  },
  {
    title: "🌟 Oferta Especial - 15% OFF + Bônus",
    content: `Oi! Tudo bem? 😊

Temos uma **surpresa** para você hoje!

Além de **15% de desconto**, você ganha **créditos bônus** na sua compra!

🎁 **Benefícios:**
- 15% OFF no valor total
- +10% de créditos extras
- Suporte VIP por 7 dias

📌 **Use: BONUS15**

Aproveite essa combinação incrível! 🌈`,
    discountPercentage: 15,
  },
  {
    title: "🎯 Promoção Exclusiva - 40% OFF",
    content: `🔥🔥🔥 **A MAIOR PROMOÇÃO DO ANO!** 🔥🔥🔥

Você não está sonhando... São **40% de desconto**!

Essa oferta é tão especial que só aparece uma vez por mês.

💰 Economize de verdade e invista no seu sucesso!

🎟️ **Código: SUPER40**

⚠️ Válido apenas para as próximas 12 horas!

Não deixe escapar! 🚀`,
    discountPercentage: 40,
  },
  {
    title: "💫 Sexta Especial - 22% OFF",
    content: `Sextou com **PROMOÇÃO**! 🎉

Para celebrar o fim de semana, preparamos **22% de desconto** para você!

O que você está esperando? Comece o final de semana investindo no seu futuro!

🌟 **Código: SEXTA22**

Bom final de semana! 🥳`,
    discountPercentage: 22,
  },
  {
    title: "🌅 Bom Dia com Desconto - 18% OFF",
    content: `Bom dia! ☕

Nada melhor do que começar o dia com uma **boa notícia**, né?

Hoje você tem **18% de desconto** garantido!

Aproveite esse momento para dar o próximo passo na sua jornada de sucesso.

📌 **Use: BOMDIA18**

Tenha um ótimo dia! ☀️`,
    discountPercentage: 18,
  },
];

// Helper function to verify admin authentication
async function verifyAdminAuth(req: Request, supabaseClient: any) {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    return { error: 'Unauthorized - No authorization header', status: 401 };
  }

  const token = authHeader.replace('Bearer ', '');
  
  // Check if it's the service role key (for cron jobs)
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (token === serviceRoleKey) {
    return { authorized: true };
  }

  // Otherwise, verify JWT and check admin role
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

  if (authError || !user) {
    return { error: 'Unauthorized - Invalid token', status: 401 };
  }

  // Verify admin role
  const { data: roleData, error: roleError } = await supabaseClient
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (roleError || !roleData) {
    return { error: 'Forbidden - Admin access required', status: 403 };
  }

  return { authorized: true, user };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify admin authentication
    const authResult = await verifyAdminAuth(req, supabase);
    if ('error' in authResult) {
      console.error("Auth failed:", authResult.error);
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { status: authResult.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: PromotionRequest = await req.json();
    const { useRandom = true, title, content, discountPercentage, productName } = body;

    // Input validation
    if (!useRandom) {
      if (title && title.length > 200) {
        return new Response(
          JSON.stringify({ error: "Title must be less than 200 characters" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (content && content.length > 2000) {
        return new Response(
          JSON.stringify({ error: "Content must be less than 2000 characters" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (discountPercentage !== undefined && (discountPercentage < 0 || discountPercentage > 100)) {
        return new Response(
          JSON.stringify({ error: "Discount percentage must be between 0 and 100" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    console.log("Sending promotion:", body);

    // Get all unique emails from profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("email, user_id, name");

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }

    if (!profiles || profiles.length === 0) {
      console.log("No profiles found");
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No profiles found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${profiles.length} profiles to send promotion`);

    // Select promotion
    let promotion;
    if (useRandom) {
      promotion = dailyPromotions[Math.floor(Math.random() * dailyPromotions.length)];
    } else {
      promotion = {
        title: title || "🎉 Promoção Especial!",
        content: content || "Confira nossa oferta especial!",
        discountPercentage: discountPercentage || 0,
      };
    }

    let sentCount = 0;
    let errorCount = 0;

    // Send promotion to each user
    for (const profile of profiles) {
      try {
        const { error: messageError } = await supabase
          .from("messages")
          .insert({
            email: profile.email,
            user_id: profile.user_id,
            title: promotion.title,
            content: promotion.content,
            type: "promotion",
            product_name: productName || "Créditos Especiais",
          });

        if (messageError) {
          console.error(`Error sending to ${profile.email}:`, messageError);
          errorCount++;
          continue;
        }

        sentCount++;
        console.log(`Promotion sent to ${profile.email}`);
      } catch (err) {
        console.error(`Error processing ${profile.email}:`, err);
        errorCount++;
      }
    }

    // Send push notifications to all users
    try {
      const pushResponse = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-push`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({
            title: promotion.title,
            body: `Você tem ${promotion.discountPercentage}% de desconto! Confira agora!`,
            data: { url: "/messages", type: "promotion" },
          }),
        }
      );
      console.log("Push notification response:", pushResponse.status);
    } catch (pushError) {
      console.error("Error sending push notifications:", pushError);
    }

    console.log(`Promotion sent. Success: ${sentCount}, Errors: ${errorCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        errors: errorCount,
        promotion: {
          title: promotion.title,
          discountPercentage: promotion.discountPercentage,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-promotion:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
