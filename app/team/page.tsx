import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import AppShell from '@/components/AppShell';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { isAdminEmail } from '@/lib/auth';

async function addMember(formData: FormData) {
  'use server';
  const supabase = createSupabaseServerClient();
  await supabase.from('team_members').insert({
    id: formData.get('id') as string,
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    role: formData.get('role') as string,
    country: formData.get('country') as string,
    active: true
  });
  revalidatePath('/team');
}

export default async function TeamPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) redirect('/dashboard');

  const { data: members } = await supabase.from('team_members').select('*').order('name');

  return (
    <AppShell>
      <div className="card">
        <h2>Add team member</h2>
        <form action={addMember} className="grid two">
          <div><label>User UUID (must match Supabase Auth user id)</label><input name="id" required /></div>
          <div><label>Name</label><input name="name" required /></div>
          <div><label>Email</label><input name="email" type="email" required /></div>
          <div><label>Role</label><select name="role"><option>Backend</option><option>UI</option><option>QA</option><option>Business Analyst</option></select></div>
          <div><label>Country</label><input name="country" required /></div>
          <div style={{ alignSelf: 'end' }}><button type="submit">Create member</button></div>
        </form>
      </div>
      <div className="card">
        <h2>Members</h2>
        <table className="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Country</th><th>Active</th></tr></thead>
          <tbody>{members?.map((m) => <tr key={m.id}><td>{m.name}</td><td>{m.email}</td><td>{m.role}</td><td>{m.country}</td><td>{String(m.active)}</td></tr>)}</tbody>
        </table>
      </div>
    </AppShell>
  );
}
