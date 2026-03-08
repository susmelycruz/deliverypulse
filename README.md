# Sprint Capacity Planner

Internal tool to calculate sprint capacity using members, country holidays and PTO.

## Fastest way (one-click deploy)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/REPLACE_WITH_YOUR_ORG/deliverypulse&env=SUPABASE_URL,SUPABASE_ANON_KEY,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXT_PUBLIC_SITE_URL&project-name=sprint-capacity-planner&repository-name=deliverypulse)

> Before using the button, replace `REPLACE_WITH_YOUR_ORG` with your GitHub org/user where this repo lives.

After deploy:
1. In Supabase SQL Editor run: `supabase/schema.sql`
2. Create PM user in Supabase Auth (email + password)
3. Run: `supabase/bootstrap_admin.sql` (replace placeholders first)
4. Login in deployed URL with PM credentials

## If you do not see the Deploy button

Open this direct Vercel page and paste your GitHub repository URL:

`https://vercel.com/new`

Then click **Deploy** after adding the 5 environment variables listed below.

## 1) Folder structure

- `app/` → Next.js App Router pages + API routes
  - `app/dashboard` → capacity tables and summaries
  - `app/pto` → PTO capture page
  - `app/team`, `app/holidays`, `app/increments` → admin pages
  - `app/api/*` → JSON endpoints for team, increments, holidays, PTO, capacity
- `components/` → shared UI shell + sign out
- `lib/` → supabase clients, auth helpers, capacity formula
- `supabase/schema.sql` → full PostgreSQL schema + RLS
- `supabase/bootstrap_admin.sql` → admin bootstrap script

## 2) Database SQL

Run `supabase/schema.sql` in your Supabase SQL editor.

- Admin authorization is handled with `team_members.is_admin`.
- `pto_entries` enforces ownership via RLS (member can manage own rows; admin can manage all).

## 3) API routes

- `GET/POST /api/team-members`
- `GET/POST /api/increments` (POST creates 4 sprints automatically)
- `GET/POST /api/holidays`
- `GET/POST /api/pto` (member can edit own PTO; admin can manage all through RLS)
- `GET /api/capacity`

## 4) Frontend pages

- `/login` → email/password with Supabase Auth
- `/dashboard` → member/sprint capacity matrix + role and sprint totals
- `/pto` → member PTO registration and personal capacity preview
- `/team` → admin team member management
- `/holidays` → admin holiday setup by country/sprint
- `/increments` → admin increment creation with auto sprint generation

## 5) Local run

```bash
npm install
cp .env.example .env.local
npm run preflight
npm run dev
```

Then open `http://localhost:3000`.

## 6) Manual deploy to Vercel (UI)

1. Push this repo to GitHub.
2. Open Vercel: https://vercel.com/new
3. Import repository.
4. In **Environment Variables**, add:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your final Vercel URL)
5. Click **Deploy**.
6. Open Supabase SQL Editor and run:
   - `supabase/schema.sql`
   - `supabase/bootstrap_admin.sql` (after replacing placeholders)

## 7) Functional deployment checklist

- ✅ Supabase project created and Auth email/password enabled
- ✅ Schema applied
- ✅ PM/admin user exists with `is_admin = true`
- ✅ At least one increment created (auto creates 4 sprints)
- ✅ Holidays configured by sprint/country
- ✅ Team members loaded with matching Auth UUIDs
- ✅ Members can submit PTO and see personal capacity
- ✅ Dashboard shows member matrix + totals by sprint + totals by role
