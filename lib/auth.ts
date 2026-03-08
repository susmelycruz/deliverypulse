import { createSupabaseServerClient } from './supabase-server';

export async function requireUser() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function isAdminEmail(email: string | undefined) {
  if (!email) return false;
  const allowlist = (process.env.ADMIN_EMAILS || '').split(',').map((x) => x.trim()).filter(Boolean);
  return allowlist.includes(email);
}
