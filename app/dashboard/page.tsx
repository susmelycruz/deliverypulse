import AppShell from '@/components/AppShell';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { calculateCapacity } from '@/lib/capacity';

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const [{ data: members }, { data: sprints }, { data: holidays }, { data: ptoEntries }] = await Promise.all([
    supabase.from('team_members').select('*').eq('active', true),
    supabase.from('sprints').select('*').order('order'),
    supabase.from('holidays').select('*'),
    supabase.from('pto_entries').select('*')
  ]);

  const sprintList = sprints || [];
  const holidayMap = new Map((holidays || []).map((h) => [`${h.sprint_id}-${h.country}`, h.holiday_days]));
  const ptoMap = new Map((ptoEntries || []).map((p) => [`${p.sprint_id}-${p.member_id}`, p.pto_days]));

  const rows = (members || []).map((m) => ({
    ...m,
    capacities: sprintList.map((s) => {
      const h = Number(holidayMap.get(`${s.id}-${m.country}`) || 0);
      const p = Number(ptoMap.get(`${s.id}-${m.id}`) || 0);
      return { sprintId: s.id, ...calculateCapacity(h, p) };
    })
  }));

  const totalsBySprint = sprintList.map((s) => ({
    name: s.name,
    total: Number(rows.reduce((acc, m) => acc + (m.capacities.find((c: { sprintId: string }) => c.sprintId === s.id)?.capacityPoints || 0), 0).toFixed(1))
  }));

  const roles = ['Backend', 'UI', 'QA', 'Business Analyst'];
  const totalsByRole = roles.map((role) => ({
    role,
    total: Number(rows.filter((m) => m.role === role).reduce((acc, m) => acc + m.capacities.reduce((x: number, c: { capacityPoints: number }) => x + c.capacityPoints, 0), 0).toFixed(1))
  }));

  return (
    <AppShell>
      <div className="card">
        <h2>Capacity per Member / Sprint</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Member</th><th>Role</th><th>Country</th>
              {sprintList.map((s) => <th key={s.id}>{s.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td><td>{m.role}</td><td>{m.country}</td>
                {m.capacities.map((c: { sprintId: string; capacityPoints: number; reason: string }) => (
                  <td key={c.sprintId}>{c.capacityPoints} pts<div className="small">{c.reason}</div></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid two">
        <div className="card">
          <h3>Capacity by Sprint</h3>
          {totalsBySprint.map((s) => <p key={s.name}>{s.name} → {s.total} points</p>)}
        </div>
        <div className="card">
          <h3>Capacity by Role</h3>
          {totalsByRole.map((r) => <p key={r.role}>{r.role} → {r.total} points</p>)}
        </div>
      </div>
    </AppShell>
  );
}
