-- Short-link destinations are resolved server-side only (see src/app/[slug]/route.ts).
-- Authenticated users retain full manage access for the admin dashboard.

drop policy if exists "Anyone can read redirects" on public.redirects;
