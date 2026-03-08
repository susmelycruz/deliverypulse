-- Sprint Capacity Planner schema + RLS policies
create extension if not exists "pgcrypto";

create table if not exists team_members (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null check (role in ('Backend', 'UI', 'QA', 'Business Analyst')),
  country text not null,
  active boolean not null default true
);

create table if not exists increments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  year int not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists sprints (
  id uuid primary key default gen_random_uuid(),
  increment_id uuid not null references increments(id) on delete cascade,
  name text not null,
  "order" int not null check ("order" between 1 and 4)
);

create table if not exists holidays (
  id uuid primary key default gen_random_uuid(),
  sprint_id uuid not null references sprints(id) on delete cascade,
  country text not null,
  holiday_days int not null check (holiday_days between 0 and 10),
  unique(sprint_id, country)
);

create table if not exists pto_entries (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references team_members(id) on delete cascade,
  sprint_id uuid not null references sprints(id) on delete cascade,
  pto_days int not null check (pto_days between 0 and 10),
  unique(member_id, sprint_id)
);

alter table team_members enable row level security;
alter table increments enable row level security;
alter table sprints enable row level security;
alter table holidays enable row level security;
alter table pto_entries enable row level security;

create policy "authenticated_can_read_team" on team_members
for select to authenticated using (true);

create policy "authenticated_can_read_increments" on increments
for select to authenticated using (true);

create policy "authenticated_can_read_sprints" on sprints
for select to authenticated using (true);

create policy "authenticated_can_read_holidays" on holidays
for select to authenticated using (true);

create policy "users_read_own_pto" on pto_entries
for select to authenticated using (auth.uid() = member_id);

create policy "users_upsert_own_pto" on pto_entries
for insert to authenticated with check (auth.uid() = member_id);

create policy "users_update_own_pto" on pto_entries
for update to authenticated using (auth.uid() = member_id) with check (auth.uid() = member_id);

-- Admin write policies can be implemented by assigning service role in backend routes,
-- or by extending with a custom claim like auth.jwt() ->> 'role' = 'admin'.
