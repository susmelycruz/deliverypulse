import { revalidatePath } from 'next/cache';
import AppShell from '@/components/AppShell';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { calculateCapacity } from '@/lib/capacity';

async function savePto(formData: FormData) {
  'use server';
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: sprints } = await supabase.from('sprints').select('id');
  const rows = (sprints || []).map((s) => ({
    member_id: user.id,
    sprint_id: s.id,
    pto_days: Number(formData.get(`pto_${s.id}`) || 0)
  }));

  await supabase.from('pto_entries').upsert(rows, { onConflict: 'member_id,sprint_id' });
  revalidatePath('/pto');
  revalidatePath('/dashboard');
}

export default async function PTOPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: member }, { data: sprints }, { data: holidays }, { data: ptoEntries }] = await Promise.all([
    supabase.from('team_members').select('*').eq('id', user?.id).single(),
    supabase.from('sprints').select('*').order('order'),
    supabase.from('holidays').select('*'),
    supabase.from('pto_entries').select('*').eq('member_id', user?.id)
  ]);

  const ptoMap = new Map((ptoEntries || []).map((e) => [e.sprint_id, e.pto_days]));
  const holidayMap = new Map((holidays || []).map((h) => [`${h.sprint_id}-${h.country}`, h.holiday_days]));

  return (
    <AppShell>
      <div className="card">
        <h2>My PTO per Sprint</h2>
        <form action={savePto} className="grid">
          {sprints?.map((s) => (
            <div key={s.id} className="grid two">
              <div>
                <label>{s.name} PTO days</label>
                <input name={`pto_${s.id}`} type="number" min={0} max={10} defaultValue={ptoMap.get(s.id) || 0} />
              </div>
              <div>
                <label>Calculated Capacity</label>
                <div>
                  {(() => {
                    const holidayDays = Number(holidayMap.get(`${s.id}-${member?.country}`) || 0);
                    const ptoDays = Number(ptoMap.get(s.id) || 0);
                    const c = calculateCapacity(holidayDays, ptoDays);
                    return <p>{c.capacityPoints} pts <span className="small">({c.reason})</span></p>;
                  })()}
                </div>
              </div>
            </div>
          ))}
          <button type="submit">Save PTO</button>
        </form>
      </div>
    </AppShell>
  );
}
