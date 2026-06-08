import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { escapeHtml, sendEmail } from '../_shared/email.ts';

function json(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }); }
function parseSig(header: string | null) { const out: Record<string,string[]> = {}; for (const p of (header || '').split(',')) { const [k,v]=p.split('='); if(k&&v) out[k]=[...(out[k]||[]),v]; } return { t: out.t?.[0], sigs: out.v1 || [] }; }
function hex(buf: ArrayBuffer) { return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join(''); }
async function hmac(secret: string, payload: string) { const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name:'HMAC', hash:'SHA-256' }, false, ['sign']); return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))); }
async function verify(raw: string, header: string | null, secret: string) { const { t, sigs } = parseSig(header); if (!t || !sigs.length) return false; const expected = await hmac(secret, `${t}.${raw}`); return sigs.includes(expected); }

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!secret) return json({ error: 'Missing webhook secret' }, 503);
  const raw = await req.text();
  if (!(await verify(raw, req.headers.get('stripe-signature'), secret))) return json({ error: 'Invalid signature' }, 400);

  const event = JSON.parse(raw);
  if (event.type !== 'checkout.session.completed' && event.type !== 'invoice.paid') return json({ received: true });
  const object = event.data.object;
  const purchaseId = object.metadata?.purchase_id || object.subscription_details?.metadata?.purchase_id;
  const clientId = object.metadata?.client_id || object.subscription_details?.metadata?.client_id;
  if (!purchaseId || !clientId) return json({ received: true });

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: purchase, error: purchaseErr } = await supabase.from('bundle_purchases').select('*').eq('id', purchaseId).single();
  if (purchaseErr) return json({ error: purchaseErr.message }, 500);

  await supabase.from('bundle_purchases').update({ payment_status: 'paid', sessions_remaining: purchase.sessions_purchased, stripe_subscription_id: object.subscription || purchase.stripe_subscription_id || null, paid_at: new Date().toISOString() }).eq('id', purchaseId);
  const { data: client } = await supabase.from('clients').update({ payment_status: 'paid', updated_at: new Date().toISOString() }).eq('id', clientId).select('*').single();
  if (client?.client_email) await sendEmail(client.client_email, 'Tutoring package confirmed', `<h2>Your tutoring package is active</h2><p>Hi ${escapeHtml(client.client_name || client.student_name)}, your ${escapeHtml(purchase.sku)} package is confirmed with ${purchase.sessions_purchased} sessions for the month.</p>`);
  return json({ received: true });
});
