-- Improved business click analytics setup
-- 1) Events table (use bigint id for primary key for best practice; keep a uuid_business_id FK)
create table if not exists public.business_click_events (
  id bigint primary key generated always as identity,
  business_id uuid not null references public.businesses(id) on delete cascade,
  source text default 'listings',
  city text,
  category text,
  created_at timestamp with time zone default now()
);

-- Create an index on the foreign key and on created_at to help reporting queries
create index if not exists idx_business_click_events_business_id on public.business_click_events(business_id);
create index if not exists idx_business_click_events_created_at on public.business_click_events(created_at);

-- 2) Row Level Security (enable RLS and create minimal, correct policies)
alter table public.business_click_events enable row level security;

-- INSERT: for INSERT policies only WITH CHECK is allowed; remove USING clause
do $$ begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='business_click_events' and policyname='allow_insert_events') then
    drop policy allow_insert_events on public.business_click_events;
  end if;
end $$;
create policy "allow_insert_events" on public.business_click_events
  for insert to anon, authenticated
  with check (true);

-- SELECT: SELECT policies must use USING
do $$ begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='business_click_events' and policyname='allow_select_events') then
    drop policy allow_select_events on public.business_click_events;
  end if;
end $$;
create policy "allow_select_events" on public.business_click_events
  for select to anon, authenticated
  using (true);

grant select, insert on public.business_click_events to anon, authenticated;

-- 3) Views for reporting (use security_invoker to follow best practice)
create or replace view public.business_clicks_by_month with (security_invoker=on) as
select
  b.id as business_id,
  b.name as business_name,
  date_trunc('month', e.created_at) as month,
  count(e.id)::int as clicks
from public.businesses b
left join public.business_click_events e on e.business_id = b.id
group by b.id, b.name, date_trunc('month', e.created_at)
order by b.name, month;

create or replace view public.business_clicks_totals with (security_invoker=on) as
select
  b.id as business_id,
  b.name as business_name,
  coalesce(count(e.id), 0)::int as total_clicks
from public.businesses b
left join public.business_click_events e on e.business_id = b.id
group by b.id, b.name
order by total_clicks desc;

-- 4) Optional: materialized variants for performance (refresh manually)
-- create materialized view private.mv_business_clicks_by_month as
--   select * from public.business_clicks_by_month;
-- create materialized view private.mv_business_clicks_totals as
--   select * from public.business_clicks_totals;
-- grant select on private.mv_business_clicks_by_month, private.mv_business_clicks_totals to anon, authenticated;

