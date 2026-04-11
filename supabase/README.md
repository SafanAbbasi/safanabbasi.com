# Supabase Setup

This directory versions the database schema and RLS policies the app expects.

## Apply migrations

Run in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_redirects_private_read.sql`

Use the Supabase SQL editor, or the Supabase CLI if you already use migrations locally.

Migration `002` removes the policy that allowed anonymous clients to list every row in `redirects`. Short links are resolved in `src/app/[slug]/route.ts` using `SUPABASE_SECRET_KEY` only; the admin UI still uses an authenticated session.

## Required environment variables

The app expects:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-service-role-or-secret-key
RESEND_API_KEY=your-resend-key
RESEND_FROM_EMAIL=Your Name <email@yourdomain.com>
```

`SUPABASE_SECRET_KEY` is used on the server for contact-form rate limiting, short-link lookups, and related click validation, so sensitive tables can stay off the anonymous key.
