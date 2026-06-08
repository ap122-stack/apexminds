import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { ArrowRight, CheckCircle2, CreditCard, Mail, Minus, Plus, ShieldCheck } from 'lucide-react';
import './styles.css';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

const tiers = {
  standard: { label: 'Standard', description: 'Math, science, AP support, writing, and homework help.', walkIn: 45 },
  test_prep: { label: 'Test Prep', description: 'SAT/ACT strategy, pacing, and targeted practice.', walkIn: 60 },
  ap_direct: { label: 'AP Direct', description: 'One-on-one sessions directly with AP.', walkIn: 55 },
};

const packages = {
  standard: { 4: { sku: 'standard_4', price: 148, rate: 37, savings: 32 }, 8: { sku: 'standard_8', price: 280, rate: 35, savings: 80 }, 12: { sku: 'standard_12', price: 396, rate: 33, savings: 144 } },
  test_prep: { 4: { sku: 'test_prep_4', price: 212, rate: 53, savings: 28 }, 8: { sku: 'test_prep_8', price: 400, rate: 50, savings: 80 }, 12: { sku: 'test_prep_12', price: 576, rate: 48, savings: 144 } },
  ap_direct: { 4: { sku: 'ap_direct_4', price: 188, rate: 47, savings: 32 }, 8: { sku: 'ap_direct_8', price: 352, rate: 44, savings: 88 }, 12: { sku: 'ap_direct_12', price: 504, rate: 42, savings: 156 } },
};

const bookingLinks = {
  standard: import.meta.env.VITE_CAL_STANDARD_URL || '',
  test_prep: import.meta.env.VITE_CAL_TEST_PREP_URL || '',
  ap_direct: import.meta.env.VITE_CAL_AP_DIRECT_URL || '',
};

function App() {
  const [tier, setTier] = useState('standard');
  const [sessions, setSessions] = useState(8);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ student_name: '', client_name: '', client_email: '', client_phone: '', grade_level: '' });
  const selected = useMemo(() => packages[tier][sessions], [tier, sessions]);
  const params = new URLSearchParams(window.location.search);
  if (window.location.pathname === '/success') return <Success tier={params.get('tier') || 'standard'} />;

  const move = (direction) => {
    const options = [4, 8, 12];
    const index = options.indexOf(sessions);
    setSessions(options[Math.min(Math.max(index + direction, 0), options.length - 1)]);
  };

  const checkout = async (event) => {
    event.preventDefault();
    if (!form.student_name || !form.client_email.includes('@')) return alert('Enter student name and parent/client email.');
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('api-create-checkout-session', { body: { sku: selected.sku, tier, sessions, ...form } });
    setLoading(false);
    if (error || !data?.url) return alert(data?.error || error?.message || 'Could not open Stripe Checkout.');
    window.location.href = data.url;
  };

  return <main className="checkoutShell">
    <section className="leftPane">
      <div className="brand"><span>AP</span><strong>AP Tutoring</strong></div>
      <p className="muted">Monthly tutoring package</p>
      <h1>{tiers[tier].label}</h1>
      <div className="price"><span>${selected.price}</span><small>/ month</small></div>

      <div className="packageArt">
        <div className="calendarCard"><strong>{sessions}</strong><span>sessions / month</span></div>
        <div className="miniCard"><b>${selected.rate}/hr</b><span>effective rate</span></div>
        <div className="miniCard light"><b>${selected.savings}</b><span>saved vs walk-in</span></div>
      </div>

      <div className="orderLines">
        <div><span>{sessions} one-on-one sessions</span><b>${selected.price}</b></div>
        <div><span>Walk-in anchor</span><b className="strike">${tiers[tier].walkIn}/hr</b></div>
        <div><span>Package rate</span><b>${selected.rate}/hr</b></div>
      </div>
    </section>

    <section className="rightPane">
      <form className="checkoutCard" onSubmit={checkout}>
        <div className="expressPay"><ShieldCheck size={20}/> Secure checkout handled by Stripe</div>
        <div className="divider"><span>Choose package</span></div>

        <div className="tiers">
          {Object.entries(tiers).map(([key, value]) => <button type="button" className={tier === key ? 'tier active' : 'tier'} onClick={() => setTier(key)} key={key}>
            <strong>{value.label}</strong><span>{value.description}</span>
          </button>)}
        </div>

        <label className="label">Sessions per month</label>
        <div className="stepBox">
          <button type="button" onClick={() => move(-1)} disabled={sessions === 4}><Minus size={18}/></button>
          <div><strong>{sessions}</strong><span>{sessions === 8 ? 'Recommended package' : 'Monthly package'}</span></div>
          <button type="button" onClick={() => move(1)} disabled={sessions === 12}><Plus size={18}/></button>
        </div>

        <h2>Student information</h2>
        <div className="fields">
          <input placeholder="Student name *" value={form.student_name} onChange={e => setForm({...form, student_name: e.target.value})}/>
          <input placeholder="Parent/client email *" value={form.client_email} onChange={e => setForm({...form, client_email: e.target.value})}/>
          <input placeholder="Parent/client name" value={form.client_name} onChange={e => setForm({...form, client_name: e.target.value})}/>
          <input placeholder="Phone" value={form.client_phone} onChange={e => setForm({...form, client_phone: e.target.value})}/>
          <input placeholder="Grade level" value={form.grade_level} onChange={e => setForm({...form, grade_level: e.target.value})}/>
        </div>

        <button className="payButton" disabled={loading}>{loading ? 'Opening Stripe...' : `Pay ${selected.price}/month`} <CreditCard size={18}/></button>
        <p className="finePrint">Payment method, billing details, wallets, and subscription confirmation happen on Stripe Checkout.</p>
      </form>

      <aside className="admissions"><Mail size={20}/><div><strong>Admissions consulting</strong><p>$250 flat, inquiry only. AP handles admissions personally.</p></div></aside>
    </section>
  </main>;
}

function Success({ tier }) {
  const link = bookingLinks[tier] || '';
  return <main className="success"><div className="done"><CheckCircle2 size={56}/><h1>Payment confirmed</h1><p>Your monthly package is active. Book your sessions using the calendar for your tier.</p>{link ? <a className="payButton" href={link}>Open booking calendar <ArrowRight size={18}/></a> : <a className="payButton" href="mailto:ap@example.com">Contact AP to schedule <ArrowRight size={18}/></a>}</div></main>;
}

createRoot(document.getElementById('root')).render(<App />);
