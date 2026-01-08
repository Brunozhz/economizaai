import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClaimRequest {
  email: string;
  phone: string;
  name: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, phone, name } = await req.json() as ClaimRequest;

    // Validação básica
    if (!email || !phone || !name) {
      console.log('Missing required fields:', { email: !!email, phone: !!phone, name: !!name });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Campos obrigatórios não preenchidos' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Normalizar telefone (remover formatação, garantir 55 no início)
    const normalizedPhone = phone.replace(/\D/g, '');
    const phoneWithCountry = normalizedPhone.startsWith('55') ? normalizedPhone : `55${normalizedPhone}`;

    console.log('Checking if email or phone already claimed:', { email, phone: phoneWithCountry });

    // Verificar se email já resgatou
    const { data: emailClaim, error: emailError } = await supabase
      .from('free_trial_claims')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (emailError) {
      console.error('Error checking email:', emailError);
      throw emailError;
    }

    if (emailClaim) {
      console.log('Email already claimed:', email);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Este e-mail já resgatou os créditos gratuitos' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verificar se telefone já resgatou
    const { data: phoneClaim, error: phoneError } = await supabase
      .from('free_trial_claims')
      .select('id')
      .eq('phone', phoneWithCountry)
      .maybeSingle();

    if (phoneError) {
      console.error('Error checking phone:', phoneError);
      throw phoneError;
    }

    if (phoneClaim) {
      console.log('Phone already claimed:', phoneWithCountry);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Este telefone já resgatou os créditos gratuitos' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Registrar o resgate
    const { error: insertError } = await supabase
      .from('free_trial_claims')
      .insert({
        email: email.toLowerCase().trim(),
        phone: phoneWithCountry,
        name: name.trim(),
      });

    if (insertError) {
      console.error('Error inserting claim:', insertError);
      
      // Verificar se é erro de constraint (duplicado)
      if (insertError.code === '23505') {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Este e-mail ou telefone já foi utilizado' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      throw insertError;
    }

    console.log('Free trial claimed successfully:', { email, phone: phoneWithCountry, name });

    // Enviar webhook para n8n (status: paid, sem evento Meta)
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_PIX_GERADO');
    if (webhookUrl) {
      try {
        const webhookPayload = {
          email: email.toLowerCase().trim(),
          whatsapp: phoneWithCountry,
          status: 'paid',
          plano: 'Demonstração - 20 Créditos Grátis',
          valor: 0,
          nome: name.trim(),
          creditos: 20,
          tipo: 'demonstracao_gratuita',
        };

        console.log('Sending webhook to n8n:', webhookPayload);

        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload),
        });

        console.log('Webhook response status:', webhookResponse.status);
      } catch (webhookError) {
        console.error('Webhook error (non-blocking):', webhookError);
        // Não bloquear o sucesso por falha no webhook
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Créditos resgatados com sucesso!' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in claim-free-trial:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Erro interno. Tente novamente.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});