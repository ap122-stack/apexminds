import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpenCheck, CheckCircle2, ChevronDown, CreditCard, GraduationCap, Mail, Minus, Plus, ShieldCheck, Sparkles, Target, TrendingUp } from 'lucide-react';
import './styles.css';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

const tiers = {
  standard: { label: 'Standard', short: 'Core tutoring', description: 'Math, science, AP support, writing, and homework help.', walkIn: 45, accent: '#DBE7FF' },
  test_prep: { label: 'Test Prep', short: 'SAT / ACT track', description: 'SAT/ACT strategy, pacing, diagnostics, and targeted practice.', walkIn: 80, accent: '#E7F7EF' },
  ap_direct: { label: 'AP Direct', short: 'With AP only', description: 'One-on-one sessions directly with AP for the highest-touch support.', walkIn: 55, accent: '#FAF0FF' },
};

const packages = {
  standard: { 4: { sku: 'standard_4', price: 148, rate: 37, savings: 32, link: 'https://buy.stripe.com/7sYcN537agBQaos6nX0sU00' }, 8: { sku: 'standard_8', price: 280, rate: 35, savings: 80, link: 'https://buy.stripe.com/3cIbJ10Z21GWfIM3bL0sU01' }, 12: { sku: 'standard_12', price: 396, rate: 33, savings: 144, link: 'https://buy.stripe.com/3cI8wP4beclAaos5jT0sU02' } },
  test_prep: { 4: { sku: 'test_prep_4', price: 292, rate: 73, savings: 28, link: 'https://buy.stripe.com/5kQ8wP4be99o2W08w50sU0c' }, 8: { sku: 'test_prep_8', price: 560, rate: 70, savings: 80, link: 'https://buy.stripe.com/cNi3cvbDG2L0bswdQp0sU0b' }, 12: { sku: 'test_prep_12', price: 816, rate: 68, savings: 144, link: 'https://buy.stripe.com/14AfZhazCfxMfIM9A90sU0d' } },
  ap_direct: { 4: { sku: 'ap_direct_4', price: 188, rate: 47, savings: 32, link: 'https://buy.stripe.com/dRmbJ17nqclA5488w50sU06' }, 8: { sku: 'ap_direct_8', price: 352, rate: 44, savings: 88, link: 'https://buy.stripe.com/8x214nePS5Xcaos7s10sU07' }, 12: { sku: 'ap_direct_12', price: 504, rate: 42, savings: 156, link: 'https://buy.stripe.com/eVq7sLePS2L0gMQdQp0sU08' } },
};

const bookingLinks = {
  standard: import.meta.env.VITE_CAL_STANDARD_URL || '',
  test_prep: import.meta.env.VITE_CAL_TEST_PREP_URL || '',
  ap_direct: import.meta.env.VITE_CAL_AP_DIRECT_URL || '',
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function App() {
  const [tier, setTier] = useState('standard');
  const [sessions, setSessions] = useState(8);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ student_name: '', client_name: '', client_email: '', client_phone: '', grade_level: '' });
  const reduceMotion = useReducedMotion();
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

  return <main>
    <section className="checkoutShell" id="checkout">
      <motion.section className="leftPane" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
        <motion.div className="brand" variants={fadeUp}><span>AP</span><strong>AP Tutoring</strong></motion.div>
        <motion.p className="muted eyebrow" variants={fadeUp}>Monthly tutoring package</motion.p>
        <motion.h1 variants={fadeUp}>{tiers[tier].label}</motion.h1>
        <motion.p className="paneCopy" variants={fadeUp}>{tiers[tier].description}</motion.p>
        <motion.div className="price" variants={fadeUp}>
          <AnimatePresence mode="popLayout">
            <motion.span key={selected.price} initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -16 }} transition={{ duration: 0.26 }}>${selected.price}</motion.span>
          </AnimatePresence>
          <small>/ month</small>
        </motion.div>

        <motion.div className="packageArt" style={{ '--accent': tiers[tier].accent }} variants={fadeUp} whileHover={reduceMotion ? undefined : { y: -4 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }}>
          <motion.div className="calendarCard" layout>
            <AnimatePresence mode="wait"><motion.strong key={sessions} initial={reduceMotion ? false : { opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, scale: 1.08 }} transition={{ duration: 0.22 }}>{sessions}</motion.strong></AnimatePresence>
            <span>sessions / month</span>
          </motion.div>
          <div className="miniCard"><b>${selected.rate}/hr</b><span>effective rate</span></div>
          <div className="miniCard light"><b>${selected.savings}</b><span>saved vs walk-in</span></div>
        </motion.div>

        <motion.div className="orderLines" variants={fadeUp}>
          <div><span>{sessions} one-on-one sessions</span><b>${selected.price}</b></div>
          <div><span>Walk-in anchor</span><b className="strike">${tiers[tier].walkIn}/hr</b></div>
          <div><span>Package rate</span><b>${selected.rate}/hr</b></div>
        </motion.div>
      </motion.section>

      <section className="rightPane">
        <motion.form className="checkoutCard" onSubmit={checkout} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}>
          <motion.div className="expressPay" whileTap={{ scale: 0.99 }}><ShieldCheck size={20}/> Secure checkout handled by Stripe</motion.div>
          <div className="divider"><span>Choose package</span></div>

          <div className="tiers">
            {Object.entries(tiers).map(([key, value]) => <motion.button type="button" className={tier === key ? 'tier active' : 'tier'} onClick={() => setTier(key)} key={key} whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={{ scale: 0.98 }}>
              <strong>{value.label}</strong><em>{value.short}</em><span>{value.description}</span>
            </motion.button>)}
          </div>

          <label className="label">Sessions per month</label>
          <div className="stepBox">
            <button type="button" onClick={() => move(-1)} disabled={sessions === 4} aria-label="Decrease sessions"><Minus size={18}/></button>
            <div><strong>{sessions}</strong><span>{sessions === 8 ? 'Recommended package' : 'Monthly package'}</span></div>
            <button type="button" onClick={() => move(1)} disabled={sessions === 12} aria-label="Increase sessions"><Plus size={18}/></button>
          </div>

          <h2>Student information</h2>
          <div className="fields">
            <input placeholder="Student name *" value={form.student_name} onChange={e => setForm({...form, student_name: e.target.value})}/>
            <input placeholder="Parent/client email *" value={form.client_email} onChange={e => setForm({...form, client_email: e.target.value})}/>
            <input placeholder="Parent/client name" value={form.client_name} onChange={e => setForm({...form, client_name: e.target.value})}/>
            <input placeholder="Phone" value={form.client_phone} onChange={e => setForm({...form, client_phone: e.target.value})}/>
            <input placeholder="Grade level" value={form.grade_level} onChange={e => setForm({...form, grade_level: e.target.value})}/>
          </div>

          <motion.button className="payButton" disabled={loading} whileHover={reduceMotion ? undefined : { y: -1 }} whileTap={{ scale: 0.985 }}>{loading ? 'Opening Stripe...' : `Pay $${selected.price}/month`} <CreditCard size={18}/></motion.button>
          <p className="finePrint">Payment method, billing details, wallets, and subscription confirmation happen on Stripe Checkout.</p>
        </motion.form>

        <motion.aside className="admissions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}><Mail size={20}/><div><strong>Admissions consulting</strong><p><span className="strike">$550</span> <strong>$400</strong> — inquiry only. AP handles admissions personally.</p></div></motion.aside>
      </section>
    </section>

    <section className="signalBand">
      <div className="signal"><Sparkles size={18}/><span>Built for students who need consistency, not random one-offs.</span></div>
      <ChevronDown size={20}/>
    </section>

    <InfoSections />
  </main>;
}

function InfoSections() {
  const cards = [
    ['Premium cadence', 'The 8-session plan gives students two weekly touchpoints so concepts stay warm between classes.', TrendingUp],
    ['Tutor-ready backend', 'Student packages, sessions remaining, payout math, and AP margin are structured for scale.', BookOpenCheck],
    ['Focused paths', 'Standard, Test Prep, and AP Direct stay separate so families pick the exact support model they need.', Target],
  ];
  return <section className="contentStack">
    <div className="sectionIntro"><p className="eyebrow">How the system works</p><h2>Clear buying, clean scheduling, trackable delivery.</h2></div>
    <div className="proofGrid">{cards.map(([title, text, Icon], index) => <motion.article className="proofCard" key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ delay: index * 0.08 }}><Icon size={22}/><h3>{title}</h3><p>{text}</p></motion.article>)}</div>
    <div className="flowPanel"><div><span>01</span><b>Choose package</b><p>Pick tier and monthly session count.</p></div><div><span>02</span><b>Pay with Stripe</b><p>Stripe handles wallets, cards, and subscription setup.</p></div><div><span>03</span><b>Book sessions</b><p>Client is sent to the right calendar for the tier.</p></div><div><span>04</span><b>Track delivery</b><p>Sessions and tutor payouts can be reconciled as they happen.</p></div></div>
  </section>;
}

function Success({ tier }) {
  const link = bookingLinks[tier] || '';
  return <main className="success"><motion.div className="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}><CheckCircle2 size={56}/><h1>Payment confirmed</h1><p>Your monthly package is active. Book your sessions using the calendar for your tier.</p>{link ? <a className="payButton" href={link}>Open booking calendar <ArrowRight size={18}/></a> : <a className="payButton" href="mailto:ap@example.com">Contact AP to schedule <ArrowRight size={18}/></a>}</motion.div></main>;
}

createRoot(document.getElementById('root')).render(<App />);
