# Supabase Setup

This directory versions the database schema and RLS policies the app expects.

## Apply the migration

Run the SQL in `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor, or apply it with the Supabase CLI if you already use migrations locally.

## Required environment variables

The app now expects:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-service-role-or-secret-key
RESEND_API_KEY=your-resend-key
RESEND_FROM_EMAIL=Your Name <email@yourdomain.com>
```

`SUPABASE_SECRET_KEY` is used only on the server for privileged operations like contact-form rate limiting, so message RLS can stay private.
