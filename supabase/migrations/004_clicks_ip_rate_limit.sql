-- Add IP address column to clicks for rate limiting
alter table public.clicks
  add column if not exists ip text;

-- Index to make the rate-limit count query fast
create index if not exists idx_clicks_ip_clicked_at
  on public.clicks(ip, clicked_at desc)
  where ip is not null;
