import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = (): React.ReactElement => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const response = await window.api.auth.register(email, password, name);
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/');
      } else {
        setError(response.error || 'Register failed. Please try again.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during the register.');
    } finally {
      setLoading(false);
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

          <div className="relative z-10">
            <footer className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/40">Promos © 2026 Copyright </p>
            </footer>
          </div>
        </section>

        <section className="flex-1 flex items-center justify-center p-6 bg-[var(--color-bg)]">
          <div className="w-full max-w-[400px]">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-2">Create a New Account</h1>
            </div>

            {error && (
              <div className="mb-4 text-xs text-[var(--color-error)] flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleRegister}>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[var(--color-muted)]">Username</label>
                <input
                  className="w-full h-11 px-4 rounded-md border border-[var(--color-border)] focus:ring-4 focus:ring-[var(--color-primary)]/15 focus:border-[var(--color-primary)] transition-all outline-none text-sm bg-[var(--color-bg)] text-[var(--color-text)]"
                  placeholder="luutranminhhieu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[var(--color-muted)]">Email</label>
                <input
                  className="w-full h-11 px-4 rounded-md border border-[var(--color-border)] focus:ring-4 focus:ring-[var(--color-primary)]/15 focus:border-[var(--color-primary)] transition-all outline-none text-sm bg-[var(--color-bg)] text-[var(--color-text)]"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[var(--color-muted)]">Password</label>
                <div className="relative">
                  <input
                    className="w-full h-11 px-4 pr-12 rounded-md border border-[var(--color-border)] focus:ring-4 focus:ring-[var(--color-primary)]/15 focus:border-[var(--color-primary)] transition-all outline-none text-sm bg-[var(--color-bg)] text-[var(--color-text)]"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-primary)]"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[var(--color-muted)]">Confirm your password</label>
                <div className="relative">
                  <input
                    className="w-full h-11 px-4 pr-12 rounded-md border border-[var(--color-border)] focus:ring-4 focus:ring-[var(--color-primary)]/15 focus:border-[var(--color-primary)] transition-all outline-none text-sm bg-[var(--color-bg)] text-[var(--color-text)]"
                    placeholder="••••••••"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-primary)]"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                  >
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 py-1">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-primary)]"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label className="text-[13px] text-[var(--color-muted)] leading-normal">
                  I agree with{' '}
                  <a className="text-[var(--color-primary)] hover:underline" href="#">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a className="text-[var(--color-primary)] hover:underline" href="#">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[var(--color-primary)] text-white font-semibold rounded-md hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {loading ? 'Creating account' : 'Account is created'}
              </button>

              <div className="text-center mt-2">
                <p className="text-sm text-[var(--color-muted)]">
                  Already have an account?{' '}
                  <Link className="text-[var(--color-primary)] font-semibold hover:underline" to="/login">
                    Sign in now
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Register;