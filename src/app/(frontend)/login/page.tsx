'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-primary-white flex flex-col justify-center py-12 px-6 sm:px-8 lg:px-12 relative">
      {/* Back button */}
      <Link href="/" className="absolute top-8 left-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-soft-clay hover:text-charcoal transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Website
      </Link>

      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        <h2 className="text-center font-serif text-3xl sm:text-4xl tracking-wide text-charcoal">
          Studio Admin Access
        </h2>
        <p className="text-center text-xs uppercase tracking-widest text-soft-clay font-medium">
          Sign in to update website content
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-primary-beige/30 py-8 px-6 shadow-sm rounded-2xl border border-primary-beige/70 sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {error && (
              <div className="flex items-center gap-3 bg-rose-50 text-rose-800 p-4 rounded-xl border border-rose-200 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-charcoal/30" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-primary-white border border-charcoal/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-charcoal/30" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-primary-white border border-charcoal/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-charcoal text-primary-white py-4 rounded-xl text-sm font-semibold tracking-widest uppercase hover:bg-charcoal/90 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-primary-beige/85 pt-4 text-center">
            <span className="text-xs font-light text-charcoal/50">
              Default Seed: <code className="bg-primary-beige px-1.5 py-0.5 rounded text-charcoal">admin</code> / <code className="bg-primary-beige px-1.5 py-0.5 rounded text-charcoal">adminpassword123</code>
            </span>
          </div>

        </div>
      </div>
    </main>
  );
}
