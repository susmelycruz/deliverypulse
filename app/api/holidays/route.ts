import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getCurrentMember } from '@/lib/auth';

export async function GET() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('holidays').select('*, sprints(name, order)').order('sprint_id');
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const { isAdmin } = await getCurrentMember();
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const payload = await request.json();
  const { error } = await supabase.from('holidays').upsert(payload, { onConflict: 'sprint_id,country' });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
