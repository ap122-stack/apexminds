import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { corsHeaders } from '../_shared/cors.ts';
import { getBundle } from '../_shared/pricing.ts';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  const siteUrl = (Deno.env.get('SITE_URL') || '').replace(/\/$/, '');
  if (!stripeKey || !siteUrl) return json({ error: 'Stripe or site URL is not configured' }, 503);

  const body = await req.json();
  const bundle = getBundle(body?.sku);
  if (!bundle) return json({ error: 'Invalid package selected' }, 400);
  const priceId = Deno.env.get(bundle.priceEnv);
  if (!priceId) return json({ error: `Missing ${bundle.priceEnv}` }, 503);

  const student_name = String(body?.student_name || '').trim();
  const client_email = String(body?.client_email || '').trim().toLowerCase();
  if (!student_name || !client_email.includes('@')) return json({ error: 'Student name and valid email are required' }, 400);

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: client, error: clientErr } = await supabase.from('clients').insert({
    student_name,
    client_name: body?.client_name || null,
    client_email,
    client_phone: body?.client_phone || null,
    grade_level: body?.grade_level || null,
    tier: bundle.tier,
    payment_status: 'pending',
    payment_method: 'stripe',
  }).select('id').single();
  if (clientErr) return json({ error: clientErr.message }, 500);

  const { data: purchase, error: purchaseErr } = await supabase.from('bundle_purchases').insert({
    client_id: client.id,
    sku: body.sku,
    tier: bundle.tier,
    sessions_purchased: bundle.sessions,
    sessions_remaining: 0,
    amount_cents: bundle.amountCents,
    hourly_rate_cents: bundle.hourlyRateCents,
    tutor_payout_cents_per_session: bundle.tutorPayoutCents,
    ap_margin_cents_per_session: bundle.apMarginCents,
    payment_status: 'pending',
    payment_method: 'stripe_subscription',
  }).select('id').single();
  if (purchaseErr) return json({ error: purchaseErr.message }, 500);

  const params = new URLSearchParams({
    mode: 'subscription',
    success_url: `${siteUrl}/success?tier=${bundle.tier}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/?checkout=cancelled`,
    customer_email: client_email,
    billing_address_collection: 'auto',
    allow_promotion_codes: 'true',
    'phone_number_collection[enabled]': 'true',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    'metadata[purchase_id]': purchase.id,
    'metadata[client_id]': client.id,
    'metadata[sku]': String(body.sku),
    'metadata[tier]': bundle.tier,
    'metadata[sessions]': String(bundle.sessions),
    'subscription_data[metadata][purchase_id]': purchase.id,
    'subscription_data[metadata][client_id]': client.id,
    'subscription_data[metadata][sku]': String(body.sku),
  });

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${stripeKey}`, 'Stripe-Version': '2026-02-25.clover', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  const session = await res.json();
  if (!res.ok) return json({ error: session?.error?.message || 'Stripe checkout failed' }, 502);

  await supabase.from('bundle_purchases').update({ stripe_checkout_session_id: session.id }).eq('id', purchase.id);
  return json({ ok: true, url: session.url });
});
