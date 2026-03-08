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

## 6) Deploy to Vercel (no programming, UI only)

1. Push this repo to GitHub.
2. Open Vercel: https://vercel.com/new
3. Import the repository.
4. In **Environment Variables**, add:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your final Vercel URL)
5. Click **Deploy**.
6. Open Supabase SQL Editor and run `supabase/schema.sql`.
7. Create your PM/admin user in Supabase Auth (email + password).
8. Insert the admin row in `team_members` (replace values):

```sql
insert into team_members (id, name, email, role, country, active, is_admin)
values ('<auth_user_uuid>', 'Project Manager', '<admin_email>', 'Business Analyst', 'US', true, true)
on conflict (id) do update set is_admin = true, active = true;
```

9. Login in the deployed app with that admin user and start configuring increments/team/holidays.

## 7) Functional deployment checklist

- ✅ Supabase project created and Auth email/password enabled
- ✅ Schema applied
- ✅ At least one increment created (auto creates 4 sprints)
- ✅ Holidays configured by sprint/country
- ✅ Team members loaded with matching Auth UUIDs
- ✅ Members can submit PTO and see personal capacity
- ✅ Dashboard shows member matrix + totals by sprint + totals by role
