import React, { useEffect, useState, JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await window.api.auth.login(email, password);
      if (response.success && response.data) {
        if (remember) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('rememberLogin', 'true');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        } else {
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('rememberLogin');
        }
        navigate('/');
      } else {
        setError(response.error || 'Failed to sign in. Please');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error occurred during sign in.';
      setError(errorMessage || 'Error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    setError('');
    setGoogleLoading(true);

    try {
      const response = await window.api.auth.googleSignIn();
      if (response.success && response.data) {
        if (remember) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('rememberLogin', 'true');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        } else {
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('rememberLogin');
        }
        navigate('/');
      } else {
        setError(response.error || 'Google sign-in failed.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error occurred during Google sign in.';
      setError(errorMessage || 'Error occurred during Google sign in.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <main className="flex min-h-screen w-full">
        <section className="hidden md:flex w-[40%] bg-navy-brand-gradient flex-col justify-between p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="400" cy="0" r="300" stroke="white" strokeWidth="2" />
              <circle cx="400" cy="0" r="200" stroke="white" strokeWidth="1" />
              <circle cx="400" cy="0" r="100" stroke="white" strokeWidth="0.5" />
            </svg>
          </div>

            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-white text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
              <span className="text-2xl font-black tracking-tight text-white">Promos</span>
            </div>

          <footer className="relative z-10 pt-4 border-t border-white/10">
            <p className="text-xs text-white/40">Promos © 2026 Copyright</p>
          </footer>
        </section>

        <section className="flex-1 flex items-center justify-center p-6 bg-[var(--color-bg)] relative overflow-hidden">

          <div className="w-full max-w-[400px]">
            <div className="md:hidden flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-white text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
              </div>
              <span className="text-lg font-black text-[var(--color-primary)]">Promos</span>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-2">Welcome</h1>
              <p className="text-sm text-[var(--color-muted)]">Sign in to continue with Promos</p>
            </div>

            {error && (
              <div className="mb-4 text-xs text-[var(--color-error)] flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[var(--color-muted)]" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full h-11 px-4 rounded-md border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/15 transition-all outline-none text-sm bg-[var(--color-bg)] text-[var(--color-text)]"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[var(--color-muted)]" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full h-11 pl-4 pr-12 rounded-md border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/15 transition-all outline-none text-sm bg-[var(--color-bg)] text-[var(--color-text)]"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label="Toggle password"
                  >
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[13px]">
                <label className="flex items-center gap-2 text-[var(--color-muted)]">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-primary)]"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember login
                </label>
                <Link to="/forgot-password" className="text-[var(--color-primary)] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-md transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? 'Waiting for login' : 'Sign in'}
              </button>
            </form>

            <div className="mb-8 flex items-center gap-4 ">
              <div className="flex-1 h-px bg-[var(--color-border)] "></div>
              <p className="text-xs font-medium text-[var(--color-muted)] whitespace-nowrap">
                Other option
              </p>
              <div className="flex-1 h-px bg-[var(--color-border)]"></div>
            </div>

            <button
              type="button"
              className="w-full h-11 border border-[var(--color-border)] rounded-md bg-[var(--color-bg)] flex items-center justify-center gap-3 text-sm text-[var(--color-text)] hover:bg-[var(--color-primary-lighter)] transition-all active:scale-[0.98]"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {googleLoading ? 'Connecting to Google...' : 'Sign in with google'}
            </button>

            <div className="mt-6 text-center text-sm text-[var(--color-muted)]">
              No account yet?{' '}
              <Link to="/register" className="text-[var(--color-primary)] font-semibold hover:underline">
                Register now
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;