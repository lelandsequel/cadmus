'use client';

import { getSupabaseBrowserClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface TopNavProps {
  breadcrumb?: string;
}

export default function TopNav({ breadcrumb }: TopNavProps) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <header className="w-full h-16 bg-surface-container-low flex justify-between items-center px-8 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold tracking-tighter text-on-surface">CADMUS</span>
        {breadcrumb && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <span className="text-primary border-b-2 border-primary pb-1">{breadcrumb}</span>
          </nav>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-surface-container rounded-full px-4 py-1.5 gap-2">
          <span className="material-symbols-outlined text-sm text-on-surface-variant">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-32 placeholder-on-surface-variant/50 outline-none"
            placeholder="Search specs..."
            type="text"
          />
        </div>
        <button
          onClick={handleSignOut}
          className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
          title="Sign out"
        >
          <span className="material-symbols-outlined">logout</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
          TJ
        </div>
      </div>
    </header>
  );
}
