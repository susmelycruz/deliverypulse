# Sprint Capacity Planner

Internal tool to calculate sprint capacity using members, country holidays and PTO.

## 1) Folder structure

- `app/` → Next.js App Router pages + API routes
  - `app/dashboard` → capacity tables and summaries
  - `app/pto` → PTO capture page
  - `app/team`, `app/holidays`, `app/increments` → admin pages
  - `app/api/*` → JSON endpoints for team, increments, holidays, PTO, capacity
- `components/` → shared UI shell + sign out
- `lib/` → supabase clients, auth helpers, capacity formula
- `supabase/schema.sql` → full PostgreSQL schema + RLS

## 2) Database SQL

Run `supabase/schema.sql` in your Supabase SQL editor.

- Admin authorization is now handled with `team_members.is_admin`.
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
npm run dev
```

Then open `http://localhost:3000`.

## 6) Deploy to Vercel

1. Push this repo to GitHub.
2. Import into Vercel as a Next.js project.
3. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (production URL)
4. Deploy.
5. In Supabase SQL Editor, run `supabase/schema.sql`.
6. Insert at least one admin member row in `team_members` with `is_admin = true` for your PM user UUID.

## 7) Functional deployment checklist

- ✅ Supabase project created and Auth email/password enabled
- ✅ Schema applied
- ✅ At least one increment created (auto creates 4 sprints)
- ✅ Holidays configured by sprint/country
- ✅ Team members loaded with matching Auth UUIDs
- ✅ Members can submit PTO and see personal capacity
- ✅ Dashboard shows member matrix + totals by sprint + totals by role
