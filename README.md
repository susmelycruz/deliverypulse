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

## 3) API routes

- `GET/POST /api/team-members`
- `GET/POST /api/increments` (POST creates 4 sprints automatically)
- `GET/POST /api/holidays`
- `GET/POST /api/pto` (user can only edit own PTO)
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
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (production URL)
   - `ADMIN_EMAILS` (comma separated admin emails)
4. Deploy.

> Note: Create users in Supabase Auth first, then use the Auth `user.id` value when adding each member in Team Management.
