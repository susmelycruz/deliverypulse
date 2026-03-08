'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        router.push('/login');
      }}
    >
      Sign out
    </button>
  );
}
