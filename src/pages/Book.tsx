import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CreditCard, Mail, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BUNDLES, getPaymentLink, TutoringTier } from "@/lib/pricing";
import { admissionsPackage, pricingTiers } from "@/lib/apTutoring";
import { EMAIL_RE } from "@/lib/siteData";

const SESSION_OPTIONS = [4, 8, 12];

const initialForm = {
  student_name: "",
  client_name: "",
  client_email: "",
  client_phone: "",
  student_email: "",
  grade_level: "",
};

export default function Book() {
  const [params] = useSearchParams();
  const [selectedTier, setSelectedTier] = useState<TutoringTier>("standard");
  const [selectedSessions, setSelectedSessions] = useState(8);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const selected = useMemo(
    () => BUNDLES.find((bundle) => bundle.tier === selectedTier && bundle.sessions === selectedSessions),
    [selectedTier, selectedSessions],
  );

  useEffect(() => {
    const tier = params.get("tier") as TutoringTier | null;
    const sessions = Number(params.get("sessions"));
    if (tier && ["standard", "test_prep", "advanced"].includes(tier)) {
      setSelectedTier(tier);
    }
    if (SESSION_OPTIONS.includes(sessions)) {
      setSelectedSessions(sessions);
    }
  }, [params]);

  const moveSessions = (direction: -1 | 1) => {
    const index = SESSION_OPTIONS.indexOf(selectedSessions);
    const next = SESSION_OPTIONS[Math.min(Math.max(index + direction, 0), SESSION_OPTIONS.length - 1)];
    setSelectedSessions(next);
  };

  const valid = Boolean(selected && (!form.client_email || EMAIL_RE.test(form.client_email)) && (!form.student_email || EMAIL_RE.test(form.student_email)));

  const startCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || !selected) {
      toast.error("Choose a package. Email fields can be blank or valid emails.");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("api-create-checkout-session", {
      body: { sku: selected.sku, ...form },
    });
    setSubmitting(false);

    if (error || !data?.url) {
      const fallbackLink = getPaymentLink(selected.sku);
      if (fallbackLink) {
        window.location.href = fallbackLink;
        return;
      }
      toast.error((data as any)?.error || error?.message || "Could not start checkout.");
      return;
    }

    window.location.href = data.url;
  };

  return (
    <section className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="bg-[var(--soft-page)] px-5 py-10 sm:px-8 lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] lg:px-14">
          <div className="mx-auto flex h-full max-w-md flex-col justify-center">
            <p className="ae-label">Selected package</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              Packages built around momentum, not one-off scrambling.
            </h1>
            <p className="mt-5 text-muted-foreground">
              Choose a monthly session rhythm, then book directly with the right tutor.
            </p>

            {selected && (
              <div className="ae-card mt-10 bg-white p-6">
                <p className="text-sm text-muted-foreground">{selected.tierLabel}</p>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-6xl font-semibold">${selected.price}</span>
                  <span className="pb-2 text-muted-foreground">/mo</span>
                </div>
                <div className="mt-6 space-y-3 text-sm">
                  <SummaryRow label="Sessions" value={`${selected.sessions} per month`} />
                  <SummaryRow label="Effective rate" value={`$${selected.hourlyRate}/hr`} />
                  <SummaryRow label="Walk-in anchor" value={`$${selected.walkInRate}/hr`} strike />
                  <SummaryRow label="Savings" value={`$${selected.savings}`} success />
                </div>
              </div>
            )}

            <div className="mt-6 rounded-lg border border-border bg-[hsl(var(--violet-panel))] p-5">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Admissions consulting</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {admissionsPackage.label}. Inquiry only, handled directly by AP.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="px-5 py-10 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-3xl space-y-12">
            <section>
              <p className="ae-label">Tutoring tier</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {pricingTiers.map((tier) => (
                  <button
                    key={tier.tier}
                    type="button"
                    onClick={() => setSelectedTier(tier.tier)}
                    className={`rounded-lg border bg-white p-5 text-left transition hover:border-primary/50 ${
                      selectedTier === tier.tier ? "border-primary ring-2 ring-primary/10" : "border-border"
                    }`}
                  >
                    <p className="font-semibold">{tier.label}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{tier.short}</p>
                    <p className="mt-4 text-xs text-muted-foreground line-through">${tier.bundles[0].walkInRate}/hr walk-in</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="ae-card bg-white p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="ae-label">Sessions per month</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-5xl font-semibold">{selectedSessions}</span>
                    <span className="text-muted-foreground">sessions</span>
                  </div>
                  {selectedSessions === 8 && <p className="mt-2 text-sm font-semibold ae-success">Recommended rhythm</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => moveSessions(-1)} disabled={selectedSessions === 4}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="min-w-28 rounded-md border border-border px-5 py-3 text-center font-semibold">
                    {selectedSessions}
                  </div>
                  <Button type="button" variant="outline" size="icon" onClick={() => moveSessions(1)} disabled={selectedSessions === 12}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </section>

            <section className="grid gap-3 md:grid-cols-3">
              {pricingTiers.map((tier) => (
                <div key={tier.tier} className="rounded-lg border border-border bg-white p-5">
                  <p className="font-semibold">{tier.label}</p>
                  <div className="mt-4 space-y-2">
                    {tier.bundles.map((bundle) => (
                      <div key={bundle.sku} className={`rounded-md border px-3 py-2 text-sm ${bundle.featured ? "border-primary bg-secondary" : "border-border"}`}>
                        <div className="flex justify-between gap-2">
                          <span>{bundle.sessions} sessions</span>
                          <span className="font-semibold">${bundle.price}/mo</span>
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                          <span>${bundle.hourlyRate}/hr</span>
                          {bundle.featured && <span className="ae-success">Recommended</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section className="ae-card bg-white p-6">
              <form onSubmit={startCheckout} className="space-y-5">
                <div>
                  <p className="ae-label">Checkout details</p>
                  <h2 className="mt-2 text-2xl font-semibold">Pay now, then book the right calendar.</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    These fields are optional here because Stripe will collect the required student details at checkout.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Student name" id="student_name">
                    <Input id="student_name" value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} />
                  </Field>
                  <Field label="Parent / client name" id="client_name">
                    <Input id="client_name" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
                  </Field>
                  <Field label="Parent / client email" id="client_email">
                    <Input id="client_email" type="email" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} />
                  </Field>
                  <Field label="Phone" id="client_phone">
                    <Input id="client_phone" value={form.client_phone} onChange={(e) => setForm({ ...form, client_phone: e.target.value })} />
                  </Field>
                  <Field label="Student email" id="student_email">
                    <Input id="student_email" type="email" value={form.student_email} onChange={(e) => setForm({ ...form, student_email: e.target.value })} />
                  </Field>
                  <Field label="Grade level" id="grade_level">
                    <Input id="grade_level" value={form.grade_level} onChange={(e) => setForm({ ...form, grade_level: e.target.value })} placeholder="e.g. 10th grade" />
                  </Field>
                </div>

                <Button type="submit" size="lg" disabled={!valid || submitting} className="w-full">
                  {submitting ? "Opening checkout..." : `Pay ${selected ? `$${selected.price}/month` : "with Stripe"}`}
                  <CreditCard className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </section>

            <section className="rounded-lg border border-border bg-[hsl(var(--violet-panel))] p-6">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <p className="ae-label">Admissions</p>
                  <h2 className="mt-2 text-2xl font-semibold">{admissionsPackage.label}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Application strategy, essay guidance, activity positioning, deadlines, and planning check-ins.
                  </p>
                </div>
                <a href={admissionsPackage.stripeLink} target="_blank" rel="noreferrer" className="ae-button-secondary">
                  Purchase Admissions Package <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </section>
          </div>
        </main>
      </div>
    </section>
  );
}

function SummaryRow({ label, value, strike, success }: { label: string; value: string; strike?: boolean; success?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={`${strike ? "line-through" : ""} ${success ? "font-semibold ae-success" : ""}`}>{value}</span>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
