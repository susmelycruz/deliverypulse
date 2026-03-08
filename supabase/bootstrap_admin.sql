-- Bootstrap admin user in team_members.
-- Replace placeholders before running.
insert into team_members (id, name, email, role, country, active, is_admin)
values ('<auth_user_uuid>', 'Project Manager', '<admin_email>', 'Business Analyst', 'US', true, true)
on conflict (id)
do update set
  name = excluded.name,
  email = excluded.email,
  role = excluded.role,
  country = excluded.country,
  active = true,
  is_admin = true;
