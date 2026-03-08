import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import AppShell from '@/components/AppShell';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getCurrentMember } from '@/lib/auth';

async function createIncrement(formData: FormData) {
  'use server';
  const supabase = createSupabaseServerClient();
  const { data: increment } = await supabase
    .from('increments')
    .insert({ name: formData.get('name') as string, year: Number(formData.get('year')), active: true })
    .select('*')
    .single();

  if (increment) {
    await supabase.from('sprints').insert([1, 2, 3, 4].map((n) => ({ increment_id: increment.id, name: `Sprint ${n}`, order: n })));
  }

  revalidatePath('/increments');
}

export default async function IncrementsPage() {
  const supabase = createSupabaseServerClient();
  const { isAdmin } = await getCurrentMember();
  if (!isAdmin) redirect('/dashboard');

  const { data } = await supabase.from('increments').select('*, sprints(*)').order('year', { ascending: false });

  return (
    <AppShell>
      <div className="card">
        <h2>Create increment</h2>
        <form action={createIncrement} className="grid two">
          <div><label>Name</label><input name="name" placeholder="Increment Q1" required /></div>
          <div><label>Year</label><input name="year" type="number" required /></div>
          <div><button type="submit">Create increment + 4 sprints</button></div>
        </form>
      </div>
      <div className="card">
        <h2>Increments</h2>
        {data?.map((i) => (
          <div key={i.id} style={{ marginBottom: 12 }}>
            <strong>{i.name} ({i.year})</strong>
            <div className="small">{(i.sprints || []).map((s: { name: string }) => s.name).join(', ')}</div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
