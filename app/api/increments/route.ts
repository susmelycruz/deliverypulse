import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { isAdminEmail } from '@/lib/auth';

export async function GET() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('increments').select('*, sprints(*)').order('year', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const payload = await request.json();
  const { data: inc, error } = await supabase.from('increments').insert(payload).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const sprints = [1, 2, 3, 4].map((order) => ({ increment_id: inc.id, name: `Sprint ${order}`, order }));
  const { error: sprintError } = await supabase.from('sprints').insert(sprints);
  if (sprintError) return NextResponse.json({ error: sprintError.message }, { status: 400 });

  return NextResponse.json({ ok: true, increment: inc });
}
