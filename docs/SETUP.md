# Supabase Setup Guide

This guide details the manual steps required to fully configure the Supabase project for the Bidyarthi Free Coaching Centre website. Since the setup relies on the Supabase Dashboard, these steps must be performed by the developer or administrator.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Note down the **Project URL** and **anon public key**.
3. Also copy the **service_role key** (used only in securely backend functions or backup scripts).

## 2. Run Database Migrations

If you have the Supabase CLI installed locally:

```bash
# Link your local repo to the remote project
npx supabase link --project-ref <your-project-ref>

# Push the schema
npx supabase db push

# (Optional) Push the seed data
psql -h aws-0-eu-central-1.pooler.supabase.com -p 6543 -d postgres -U postgres.<your-project-ref> -f supabase/seed.sql
```

Alternatively, you can run the SQL from `supabase/migrations/0001_initial_schema.sql` directly in the Supabase Dashboard **SQL Editor**, followed by `supabase/seed.sql`.

## 3. Create the First Admin User

Authentication is restricted. Users cannot sign up themselves. You must manually add the first admin:

1. Go to **Authentication > Users** in the Supabase Dashboard.
2. Click **Add user > Create new user**.
3. Enter an email (e.g., `admin@bidyarthi.org`) and a strong password.
4. Auto-confirm the user if you don't have email sending configured yet.
5. **CRITICAL:** Copy the new user's `UID`.
6. Go to the **Table Editor** > `admin_users` table.
7. Insert a new row with the `id` you just copied and the corresponding `email`.

_Note: The Row-Level Security (RLS) policies rely entirely on the `admin_users` table to grant write access._

## 4. Environment Variables

Add the following environment variables to your Vercel project (or `.env.local` for local development):

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
REVALIDATE_SECRET=your-random-secret
```

## 5. Storage Buckets Configuration

The migration script creates the following buckets:

- `notice-files`
- `gallery-images`
- `site-photos`

Verify in the Supabase Dashboard under **Storage** that these buckets exist and are marked as **Public**.

## 6. TypeScript Types Generation

Whenever you change the database schema in the future, regenerate the types:

```bash
npx supabase gen types typescript --project-id <your-project-ref> --schema public > src/types/database.ts
```

_For this initial setup, `src/types/database.ts` has been hand-generated to match the schema._
