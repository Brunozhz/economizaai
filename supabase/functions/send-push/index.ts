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

// VAPID public key (same as in usePushNotifications.ts)
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

// Helper to convert base64url to Uint8Array
function base64urlToUint8Array(base64url: string): Uint8Array {
  const padding = '='.repeat((4 - base64url.length % 4) % 4);
  const base64 = (base64url + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Helper to convert Uint8Array to base64url
function uint8ArrayToBase64url(uint8Array: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Create VAPID JWT token
async function createVapidJwt(audience: string, vapidPrivateKey: string): Promise<string> {
  const header = { typ: 'JWT', alg: 'ES256' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: audience,
    exp: now + 12 * 60 * 60, // 12 hours
    sub: 'mailto:contato@economiza.ia',
  };

  const headerB64 = uint8ArrayToBase64url(new TextEncoder().encode(JSON.stringify(header)));
  const payloadB64 = uint8ArrayToBase64url(new TextEncoder().encode(JSON.stringify(payload)));
  const unsignedToken = `${headerB64}.${payloadB64}`;

  // Import the private key
  const privateKeyBytes = base64urlToUint8Array(vapidPrivateKey);
  
  // The private key for ES256 needs to be in JWK format
  const jwk = {
    kty: 'EC',
    crv: 'P-256',
    d: uint8ArrayToBase64url(privateKeyBytes),
    x: uint8ArrayToBase64url(base64urlToUint8Array(VAPID_PUBLIC_KEY).slice(1, 33)),
    y: uint8ArrayToBase64url(base64urlToUint8Array(VAPID_PUBLIC_KEY).slice(33, 65)),
  };

  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    new TextEncoder().encode(unsignedToken)
  );

  // Convert DER signature to raw format (r || s)
  const signatureBytes = new Uint8Array(signature);
  const signatureB64 = uint8ArrayToBase64url(signatureBytes);

  return `${unsignedToken}.${signatureB64}`;
}

// Encrypt payload using Web Push encryption
async function encryptPayload(
  payload: string,
  p256dh: string,
  auth: string
): Promise<{ encrypted: Uint8Array; salt: Uint8Array; localPublicKey: Uint8Array }> {
  // Generate local key pair
  const localKeyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits']
  );

  // Export local public key
  const localPublicKeyRaw = await crypto.subtle.exportKey('raw', localKeyPair.publicKey);
  const localPublicKey = new Uint8Array(localPublicKeyRaw);

  // Import subscriber's public key
  const subscriberPublicKeyBytes = base64urlToUint8Array(p256dh);
  const subscriberPublicKey = await crypto.subtle.importKey(
    'raw',
    subscriberPublicKeyBytes.buffer as ArrayBuffer,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  // Derive shared secret
  const sharedSecret = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: subscriberPublicKey },
    localKeyPair.privateKey,
    256
  );

  // Generate salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Import auth secret
  const authBytes = base64urlToUint8Array(auth);

  // Build info for key derivation
  const encoder = new TextEncoder();
  
  // Build key info with proper format for WebPush
  const keyInfoData = new Uint8Array([
    ...encoder.encode('WebPush: info\0'),
    ...subscriberPublicKeyBytes,
    ...localPublicKey,
  ]);

  // Derive IKM using HKDF
  const ikmKey = await crypto.subtle.importKey(
    'raw',
    sharedSecret,
    { name: 'HKDF' },
    false,
    ['deriveBits']
  );

  const ikm = await crypto.subtle.deriveBits(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: authBytes.buffer as ArrayBuffer,
      info: keyInfoData.buffer as ArrayBuffer,
    },
    ikmKey,
    256
  );

  // Derive CEK
  const cekInfo = encoder.encode('Content-Encoding: aes128gcm\0');

  const ikmKeyForCek = await crypto.subtle.importKey(
    'raw',
    ikm,
    { name: 'HKDF' },
    false,
    ['deriveBits']
  );

  const cek = await crypto.subtle.deriveBits(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: salt.buffer as ArrayBuffer,
      info: cekInfo.buffer as ArrayBuffer,
    },
    ikmKeyForCek,
    128
  );

  // Derive nonce
  const nonceInfo = encoder.encode('Content-Encoding: nonce\0');

  const nonce = await crypto.subtle.deriveBits(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: salt.buffer as ArrayBuffer,
      info: nonceInfo.buffer as ArrayBuffer,
    },
    ikmKeyForCek,
    96
  );

  // Encrypt the payload
  const aesKey = await crypto.subtle.importKey(
    'raw',
    cek,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  // Add padding delimiter
  const payloadBytes = encoder.encode(payload);
  const paddedPayload = new Uint8Array(payloadBytes.length + 1);
  paddedPayload.set(payloadBytes);
  paddedPayload[payloadBytes.length] = 2; // Padding delimiter

  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: new Uint8Array(nonce) },
    aesKey,
    paddedPayload
  );

  // Build the aes128gcm content
  const recordSize = 4096;
  const header = new Uint8Array(21 + localPublicKey.length);
  header.set(salt, 0);
  new DataView(header.buffer).setUint32(16, recordSize, false);
  header[20] = localPublicKey.length;
  header.set(localPublicKey, 21);

  const encrypted = new Uint8Array(header.length + encryptedData.byteLength);
  encrypted.set(header);
  encrypted.set(new Uint8Array(encryptedData), header.length);

  return { encrypted, salt, localPublicKey };
}

// Send push notification using Web Push Protocol with VAPID
async function sendWebPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: string,
  vapidPrivateKey: string
): Promise<boolean> {
  try {
    // Get the audience (origin) from the endpoint
    const endpointUrl = new URL(subscription.endpoint);
    const audience = endpointUrl.origin;

    // Create VAPID JWT
    const jwt = await createVapidJwt(audience, vapidPrivateKey);

    // Encrypt the payload
    const { encrypted } = await encryptPayload(payload, subscription.p256dh, subscription.auth);

    // Prepare VAPID public key for header
    const vapidPublicKeyBytes = base64urlToUint8Array(VAPID_PUBLIC_KEY);
    const vapidPublicKeyB64 = uint8ArrayToBase64url(vapidPublicKeyBytes);

    // Send the push notification
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'aes128gcm',
        'TTL': '86400',
        'Urgency': 'high',
        'Authorization': `vapid t=${jwt}, k=${vapidPublicKeyB64}`,
      },
      body: encrypted.buffer as ArrayBuffer,
    });

    console.log(`Push response for ${subscription.endpoint.substring(0, 60)}...: ${response.status}`);
    
    if (!response.ok && response.status !== 201) {
      const text = await response.text();
      console.error(`Push failed: ${response.status} - ${text}`);
    }
    
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
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    
    if (!vapidPrivateKey) {
      console.error('VAPID_PRIVATE_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'VAPID_PRIVATE_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
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
        pushPayload,
        vapidPrivateKey
      );

      if (success) {
        sentCount++;
      } else {
        failedEndpoints.push(subscription.endpoint);
      }
    }

    // Log failed notifications
    if (failedEndpoints.length > 0) {
      console.log(`${failedEndpoints.length} notifications failed`);
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
