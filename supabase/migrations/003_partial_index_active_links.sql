-- Replace the low-selectivity boolean index with a partial index
-- that covers the main page query: SELECT * FROM links WHERE is_active = true ORDER BY sort_order
drop index if exists idx_links_is_active;
create index if not exists idx_links_active_sorted on public.links(sort_order) where is_active = true;
