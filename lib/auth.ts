import { createSupabaseServerClient } from './supabase-server';

export async function requireUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentMember() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return { user: null, member: null, isAdmin: false };

  const { data: member } = await supabase
    .from('team_members')
    .select('id,name,email,role,country,active,is_admin')
    .eq('id', user.id)
    .single();

  return {
    user,
    member,
    isAdmin: Boolean(member?.is_admin)
  };
}
