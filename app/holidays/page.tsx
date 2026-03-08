import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import AppShell from '@/components/AppShell';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getCurrentMember } from '@/lib/auth';

async function saveHoliday(formData: FormData) {
  'use server';
  const supabase = createSupabaseServerClient();
  await supabase.from('holidays').upsert({
    sprint_id: formData.get('sprint_id') as string,
    country: formData.get('country') as string,
    holiday_days: Number(formData.get('holiday_days'))
  }, { onConflict: 'sprint_id,country' });
  revalidatePath('/holidays');
  revalidatePath('/dashboard');
}

export default async function HolidaysPage() {
  const supabase = createSupabaseServerClient();
  const { isAdmin } = await getCurrentMember();
  if (!isAdmin) redirect('/dashboard');

  const [{ data: sprints }, { data: holidays }] = await Promise.all([
    supabase.from('sprints').select('*').order('order'),
    supabase.from('holidays').select('*, sprints(name)')
  ]);

  return (
    <AppShell>
      <div className="card">
        <h2>Set holidays by country & sprint</h2>
        <form action={saveHoliday} className="grid two">
          <div><label>Sprint</label><select name="sprint_id">{sprints?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div><label>Country</label><input name="country" required /></div>
          <div><label>Holiday days</label><input name="holiday_days" type="number" min={0} max={10} required /></div>
          <div style={{ alignSelf: 'end' }}><button type="submit">Save</button></div>
        </form>
      </div>
      <div className="card">
        <h2>Holiday rules</h2>
        <table className="table"><thead><tr><th>Sprint</th><th>Country</th><th>Holiday Days</th></tr></thead>
          <tbody>{holidays?.map((h) => <tr key={h.id}><td>{(h.sprints as { name: string }).name}</td><td>{h.country}</td><td>{h.holiday_days}</td></tr>)}</tbody></table>
      </div>
    </AppShell>
  );
}
