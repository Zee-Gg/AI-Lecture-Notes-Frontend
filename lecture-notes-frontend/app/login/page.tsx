'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setSubmitting(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-screen bg-surface-alt flex">
      {/* Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-accent relative overflow-hidden flex-col justify-between p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10"
        />

        <Link href="/" className="relative flex items-center gap-2 w-fit">
          <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-sm font-bold">
            AI
          </span>
          <span className="text-white font-semibold tracking-tight">
            Lecture Notes Assistant
          </span>
        </Link>

        <div className="relative">
          <h2 className="text-3xl font-bold text-white leading-tight max-w-md">
            Welcome back. Your notes are exactly where you left them.
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              'AI-generated notes from every lecture',
              'Ask questions across a whole course',
              'Organized, editable, and searchable',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-white/90">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs shrink-0">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-white/70 text-sm">
          © {new Date().getFullYear()} Lecture Notes Assistant
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="lg:hidden inline-flex items-center gap-2 mb-8"
          >
            <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white text-sm font-bold">
              AI
            </span>
            <span className="font-semibold tracking-tight text-text-primary">
              Lecture Notes Assistant
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Log in to your account
          </h1>
          <p className="text-text-secondary text-sm mt-1.5">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-accent font-medium hover:text-accent-hover">
              Sign up free
            </Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-4 mt-8">
            {error && (
              <p className="bg-status-failed-bg text-status-failed-text text-sm px-4 py-2.5 rounded-xl">
                {error}
              </p>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/40"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/40"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60"
            >
              {submitting ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
