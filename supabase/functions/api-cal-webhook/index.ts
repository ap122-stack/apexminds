import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
function json(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }); }
Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const expected = Deno.env.get('CAL_WEBHOOK_SECRET');
  if (expected && req.headers.get('x-cal-secret') !== expected) return json({ error: 'Invalid webhook secret' }, 401);
  const event = await req.json();
  const payload = event.payload || event;
  const email = String(payload.attendees?.[0]?.email || payload.email || '').toLowerCase();
  const name = String(payload.attendees?.[0]?.name || payload.title || 'Cal.com booking');
  const externalId = String(payload.uid || payload.id || event.id || crypto.randomUUID());
  const start = payload.startTime || payload.start || null;
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: client } = await supabase.from('clients').select('id,tier').eq('client_email', email).eq('payment_status','paid').order('created_at',{ascending:false}).limit(1).maybeSingle();
  const { data: purchase } = client ? await supabase.from('bundle_purchases').select('id').eq('client_id', client.id).eq('payment_status','paid').order('created_at',{ascending:false}).limit(1).maybeSingle() : { data: null };
  const { error } = await supabase.from('bookings').upsert({ booking_id: `CAL-${externalId.slice(0,8).toUpperCase()}`, student_name: name, client_email: email, subject: String(payload.eventType?.title || payload.type || 'Tutoring'), day: start ? new Date(start).toLocaleDateString('en-US',{weekday:'long'}) : 'Cal.com', time: start ? new Date(start).toLocaleTimeString('en-US') : 'Cal.com', status: event.triggerEvent === 'BOOKING_CANCELLED' ? 'cancelled' : 'confirmed', booking_source: 'cal.com', external_event_id: externalId, starts_at: start, client_id: client?.id || null, bundle_purchase_id: purchase?.id || null, tier: client?.tier || null, payment_status: client ? 'paid' : 'pending' }, { onConflict: 'external_event_id' });
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
});
