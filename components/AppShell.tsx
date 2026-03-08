import Link from 'next/link';
import { ReactNode } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getCurrentMember } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SignOutButton from './SignOutButton';

export default async function AppShell({ children }: { children: ReactNode }) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { isAdmin } = await getCurrentMember();

  return (
    <main>
      <div className="header">
        <div>
          <h1>Sprint Capacity Planner</h1>
          <div className="small">Logged in as {user.email}</div>
        </div>
        <SignOutButton />
      </div>
      <div className="nav card">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/pto">PTO Entry</Link>
        {isAdmin && <Link href="/team">Team</Link>}
        {isAdmin && <Link href="/holidays">Holidays</Link>}
        {isAdmin && <Link href="/increments">Increments</Link>}
      </div>
      {children}
    </main>
  );
}
