'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [workspaceName, setWorkspaceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      const { error: wsError } = await supabase.from('workspaces').insert({
        name: workspaceName,
        owner_user_id: user.id,
      });

      if (wsError) throw wsError;

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workspace');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="clay-card p-12 rounded-lg border border-white/60 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white mx-auto mb-6">
            <span className="material-symbols-outlined text-3xl">architecture</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3">
            Welcome to CADMUS
          </h1>
          <p className="text-on-surface-variant mb-8 leading-relaxed">
            You&apos;re about to turn your ideas into specs. First, let&apos;s name your workspace — think of it
            as your spec studio.
          </p>

          <form onSubmit={handleCreate} className="text-left space-y-4">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">
                Workspace Name
              </label>
              <div className="clay-inset rounded-xl p-1 focus-within:ring-2 ring-primary/20 transition-all">
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="e.g. JourdanLabs, Acme Corp, My Projects"
                  required
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder-outline text-sm px-4 py-3 outline-none"
                />
              </div>
            </div>

            {error && (
              <p className="text-error text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !workspaceName.trim()}
              className="w-full sculpted-pill text-white py-4 rounded-xl font-bold shadow-lg hover:translate-y-[-2px] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                  Creating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">rocket_launch</span>
                  Enter the Lab
                </>
              )}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { icon: 'edit_note', label: 'Describe ideas' },
            { icon: 'psychology', label: 'AI extracts structure' },
            { icon: 'file_export', label: 'Export anywhere' },
          ].map((item) => (
            <div key={item.label} className="clay-inset p-4 rounded-xl text-center">
              <span className="material-symbols-outlined text-primary text-2xl block mb-1">{item.icon}</span>
              <span className="text-[11px] text-on-surface-variant font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
