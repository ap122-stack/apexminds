import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tutorProfiles } from "@/lib/apTutoring";

const filters = ["Subject", "Tier", "Grade", "Availability", "Teaching style"];
const packageOptions = ["4 sessions", "8 sessions", "12 sessions"];
const matchFields = ["Subject", "Student grade", "Goal", "Learning style", "Availability", "Tutor traits", "Urgency"];

export default function Tutors() {
  const [selectedId, setSelectedId] = useState(tutorProfiles[0].id);
  const selected = useMemo(() => tutorProfiles.find((profile) => profile.id === selectedId) || tutorProfiles[0], [selectedId]);
  const checkoutUrl = `/packages?tier=${selected.checkoutTier}&sessions=8&tutor=${selected.id}`;

  return (
    <>
      <section className="bg-[var(--soft-page)] py-16 md:py-24">
        <div className="ae-shell">
          <div className="max-w-4xl">
            <p className="ae-label">Tutor directory</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight md:text-7xl">
              Choose the tutor your student will actually work with.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Read the profile, check availability, then reserve a session after package checkout.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="ae-shell grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="ae-card bg-white p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex flex-1 items-center gap-2 rounded-md border border-border px-3 py-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Search by subject or goal</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <button key={filter} className="rounded-md border border-border bg-white px-3 py-2 text-sm text-muted-foreground">
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {tutorProfiles.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => setSelectedId(profile.id)}
                  className={`rounded-lg border bg-white p-5 text-left transition hover:border-primary/50 ${
                    selectedId === profile.id ? "border-primary ring-2 ring-primary/10" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="ae-label">{profile.tier}</p>
                      <h2 className="mt-2 text-xl font-semibold">{profile.label}</h2>
                    </div>
                    <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold">View profile</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{profile.subjects}</p>
                  <p className="mt-2 text-sm">{profile.style}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Subject fit", "Schedule fit", "Style fit"].map((chip) => (
                      <span key={chip} className="rounded-full bg-[hsl(var(--success))]/10 px-3 py-1 text-xs font-semibold ae-success">
                        {chip}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="ae-card bg-white p-6">
              <p className="ae-label">Selected tutor</p>
              <h2 className="mt-3 text-3xl font-semibold">{selected.label}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{selected.bestFor}</p>

              <div className="mt-6 grid gap-3 text-sm">
                <Detail label="Subjects" value={selected.subjects} />
                <Detail label="Teaching style" value={selected.style} />
                <Detail label="Format" value="Online via Microsoft Teams" />
                {/* Calendar moved to the availability preview: pick the rhythm before you pay */}
              </div>

              <Button asChild className="mt-6 w-full">
                <Link to={checkoutUrl}>
                  I want this tutor <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="ae-card bg-white p-6">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Availability preview</p>
                  <p className="text-sm text-muted-foreground">Final booking confirms after payment or session verification.</p>
                </div>
              </div>
              <div className="mt-5 grid gap-2">
                <p className="text-sm text-muted-foreground">Pick the rhythm before you pay — preview available session times below and then choose a package to finalize booking.</p>
                {selected.availability.map((slot) => (
                  <button key={slot} className="flex items-center justify-between rounded-md border border-border px-4 py-3 text-sm transition hover:border-primary/50">
                    <span>{slot}</span>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[var(--soft-page)] py-16">
        <div className="ae-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="ae-label">Match flow</p>
            <h2 className="mt-3 text-4xl font-semibold">Want AP to choose the fit?</h2>
            <p className="mt-4 text-muted-foreground">
              Share what the student needs, then AP reviews the fit before you book with the matched tutor.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="ae-card bg-white p-5">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <p className="font-semibold">Matching intake</p>
              </div>
              <div className="mt-5 grid gap-2">
                {matchFields.map((field) => (
                  <div key={field} className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
                    {field}
                  </div>
                ))}
              </div>
            </div>
            <div className="ae-card bg-white p-5">
              <p className="font-semibold">Schedule and pay</p>
              <div className="mt-5 grid gap-2">
                {packageOptions.map((option) => (
                  <button key={option} className={`rounded-md border px-3 py-2 text-left text-sm ${option.startsWith("8") ? "border-primary bg-secondary" : "border-border"}`}>
                    {option} {option.startsWith("8") && <span className="ae-success">recommended</span>}
                  </button>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-2">
                <Link to={checkoutUrl} className="ae-button">
                  Continue to Stripe Checkout
                </Link>
                <button className="ae-button-secondary">Use remaining sessions</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
