create table if not exists public.buyer_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  category text not null default 'All categories',
  city text not null default 'All cities',
  source text not null default 'marketplace_zero_state',
  created_at timestamptz not null default now()
);

alter table public.buyer_waitlist enable row level security;

drop policy if exists "Service role can manage buyer waitlist" on public.buyer_waitlist;
create policy "Service role can manage buyer waitlist"
  on public.buyer_waitlist
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
