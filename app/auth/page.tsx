'use client';

import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = getSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="clay-card p-10 rounded-lg border border-white/60">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl">architecture</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">Welcome to CADMUS</h1>
            <p className="text-on-surface-variant text-sm mt-2">
              Enter your email to receive a magic link
            </p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-tertiary-pale flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-tertiary text-3xl">mark_email_read</span>
              </div>
              <h2 className="text-lg font-bold text-on-surface mb-2">Check your email</h2>
              <p className="text-on-surface-variant text-sm">
                We sent a magic link to <strong>{email}</strong>. Click it to sign in.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <div className="clay-inset rounded-xl p-1 focus-within:ring-2 ring-primary/20 transition-all">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
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
                disabled={loading || !email}
                className="w-full sculpted-pill text-white py-4 rounded-xl font-bold shadow-lg hover:translate-y-[-2px] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
