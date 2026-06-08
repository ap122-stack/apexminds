create table if not exists public.tutors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  subjects text[] not null default '{}',
  booking_link text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  client_name text,
  client_email text not null,
  client_phone text,
  grade_level text,
  tier text not null,
  tutor_id uuid references public.tutors(id),
  payment_status text not null default 'pending',
  payment_method text not null default 'stripe',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bundle_purchases (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  sku text not null,
  tier text not null,
  sessions_purchased int not null,
  sessions_remaining int not null,
  amount_cents int not null,
  hourly_rate_cents int not null,
  tutor_payout_cents_per_session int not null,
  ap_margin_cents_per_session int not null,
  payment_status text not null default 'pending',
  payment_method text not null default 'stripe_subscription',
  stripe_checkout_session_id text unique,
  stripe_subscription_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_id text not null unique,
  student_name text not null,
  client_email text not null,
  subject text not null,
  day text not null,
  time text not null,
  status text not null default 'confirmed',
  booking_source text,
  external_event_id text unique,
  starts_at timestamptz,
  ends_at timestamptz,
  client_id uuid references public.clients(id),
  bundle_purchase_id uuid references public.bundle_purchases(id),
  tutor_id uuid references public.tutors(id),
  tier text,
  payment_status text,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.session_completions (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id),
  client_id uuid not null references public.clients(id) on delete cascade,
  bundle_purchase_id uuid not null references public.bundle_purchases(id) on delete cascade,
  tutor_id uuid references public.tutors(id),
  tier text not null,
  tutor_payout_cents int not null,
  ap_margin_cents int not null,
  completed_at timestamptz not null default now(),
  notes text
);

alter table public.tutors enable row level security;
alter table public.clients enable row level security;
alter table public.bundle_purchases enable row level security;
alter table public.bookings enable row level security;
alter table public.session_completions enable row level security;

grant select on public.tutors to anon, authenticated;
grant select on public.clients to anon, authenticated;
grant select on public.bundle_purchases to anon, authenticated;
grant select on public.bookings to anon, authenticated;
grant select on public.session_completions to anon, authenticated;
grant all on public.tutors to service_role;
grant all on public.clients to service_role;
grant all on public.bundle_purchases to service_role;
grant all on public.bookings to service_role;
grant all on public.session_completions to service_role;

create policy if not exists "public read tutors" on public.tutors for select to anon, authenticated using (true);
create policy if not exists "public read clients" on public.clients for select to anon, authenticated using (true);
create policy if not exists "public read purchases" on public.bundle_purchases for select to anon, authenticated using (true);
create policy if not exists "public read bookings" on public.bookings for select to anon, authenticated using (true);
create policy if not exists "public read completions" on public.session_completions for select to anon, authenticated using (true);
