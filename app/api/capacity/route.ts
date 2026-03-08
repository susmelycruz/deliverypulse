import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { calculateCapacity } from '@/lib/capacity';

export async function GET() {
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

  const memberRows = (members || []).map((member) => {
    const capacities = sprintList.map((sprint) => {
      const holidayDays = Number(holidayMap.get(`${sprint.id}-${member.country}`) || 0);
      const ptoDays = Number(ptoMap.get(`${sprint.id}-${member.id}`) || 0);
      return { sprintId: sprint.id, sprintName: sprint.name, ...calculateCapacity(holidayDays, ptoDays) };
    });
    return { ...member, capacities };
  });

  const totalsBySprint = sprintList.map((sprint) => ({
    sprintId: sprint.id,
    sprintName: sprint.name,
    total: Number(memberRows.reduce((acc, m) => acc + (m.capacities.find((c: { sprintId: string }) => c.sprintId === sprint.id)?.capacityPoints || 0), 0).toFixed(1))
  }));

  const totalsByRole = ['Backend', 'UI', 'QA', 'Business Analyst'].map((role) => ({
    role,
    total: Number(memberRows.filter((m) => m.role === role).reduce((acc, m) => acc + m.capacities.reduce((x: number, c: { capacityPoints: number }) => x + c.capacityPoints, 0), 0).toFixed(1))
  }));

  return NextResponse.json({ sprints: sprintList, members: memberRows, totalsBySprint, totalsByRole });
}
