create table if not exists public.links (
  id text primary key,
  label text not null,
  url text not null,
  bg_color text not null,
  hover_color text not null,
  icon text,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.redirects (
  slug text primary key,
  destination_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.clicks (
  id bigint generated always as identity primary key,
  link_id text not null,
  clicked_at timestamptz not null default now(),
  referrer text,
  user_agent text
);

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  ip text,
  created_at timestamptz not null default now(),
  replied_at timestamptz
);

create index if not exists idx_links_sort_order on public.links(sort_order);
create index if not exists idx_links_is_active on public.links(is_active);
create index if not exists idx_redirects_created_at on public.redirects(created_at desc);
create index if not exists idx_clicks_link_id on public.clicks(link_id);
create index if not exists idx_clicks_clicked_at on public.clicks(clicked_at desc);
create index if not exists idx_messages_created_at on public.messages(created_at desc);
create index if not exists idx_messages_ip_created_at on public.messages(ip, created_at desc);

alter table public.links enable row level security;
alter table public.redirects enable row level security;
alter table public.clicks enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Anyone can read active links" on public.links;
drop policy if exists "Authenticated users can manage links" on public.links;
create policy "Anyone can read active links"
  on public.links
  for select
  using (is_active = true);
create policy "Authenticated users can manage links"
  on public.links
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Anyone can read redirects" on public.redirects;
drop policy if exists "Authenticated users can manage redirects" on public.redirects;
create policy "Anyone can read redirects"
  on public.redirects
  for select
  using (true);
create policy "Authenticated users can manage redirects"
  on public.redirects
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Anyone can insert clicks" on public.clicks;
drop policy if exists "Authenticated users can read clicks" on public.clicks;
create policy "Anyone can insert clicks"
  on public.clicks
  for insert
  with check (true);
create policy "Authenticated users can read clicks"
  on public.clicks
  for select
  to authenticated
  using (true);

drop policy if exists "Anyone can insert messages" on public.messages;
drop policy if exists "Authenticated users can read messages" on public.messages;
drop policy if exists "Authenticated users can update messages" on public.messages;
drop policy if exists "Authenticated users can delete messages" on public.messages;
create policy "Anyone can insert messages"
  on public.messages
  for insert
  with check (true);
create policy "Authenticated users can read messages"
  on public.messages
  for select
  to authenticated
  using (true);
create policy "Authenticated users can update messages"
  on public.messages
  for update
  to authenticated
  using (true)
  with check (true);
create policy "Authenticated users can delete messages"
  on public.messages
  for delete
  to authenticated
  using (true);

create or replace function public.get_click_summary()
returns table (
  total_clicks bigint,
  weekly_clicks bigint
)
language sql
security invoker
set search_path = public
as $$
  select
    count(*)::bigint as total_clicks,
    count(*) filter (
      where clicked_at >= now() - interval '7 days'
    )::bigint as weekly_clicks
  from public.clicks;
$$;

create or replace function public.get_clicks_per_link()
returns table (
  link_id text,
  count bigint
)
language sql
security invoker
set search_path = public
as $$
  select
    clicks.link_id,
    count(*)::bigint as count
  from public.clicks as clicks
  group by clicks.link_id
  order by count desc, clicks.link_id asc;
$$;

create or replace function public.get_daily_clicks(window_days integer default 30)
returns table (
  date text,
  count bigint
)
language sql
security invoker
set search_path = public
as $$
  with bounded_window as (
    select greatest(window_days, 1) as days_in_window
  ),
  days as (
    select generate_series(
      current_date - ((select days_in_window from bounded_window) - 1),
      current_date,
      interval '1 day'
    )::date as day
  ),
  counts as (
    select
      date_trunc('day', clicked_at)::date as day,
      count(*)::bigint as count
    from public.clicks
    where clicked_at >= now() - make_interval(days => (select days_in_window from bounded_window) - 1)
    group by 1
  )
  select
    to_char(days.day, 'YYYY-MM-DD') as date,
    coalesce(counts.count, 0)::bigint as count
  from days
  left join counts using (day)
  order by days.day asc;
$$;

grant execute on function public.get_click_summary() to authenticated;
grant execute on function public.get_clicks_per_link() to authenticated;
grant execute on function public.get_daily_clicks(integer) to authenticated;
