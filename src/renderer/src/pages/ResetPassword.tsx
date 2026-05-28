import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = (): React.JSX.Element => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  useEffect(() => {
    if (!showSuccess) {
      return;
    }

    const timer = window.setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [showSuccess, navigate]);

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (!token) {
      setError('Reset link is invalid or missing.');
      return;
    }

    if (!password || password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await window.api.auth.resetPassword(token, password);
      if (response.success) {
        setShowSuccess(true);
      } else {
        setError(response.error || 'Reset password failed.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Reset password failed.';
      setError(errorMessage || 'Reset password failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-[var(--color-text)] bg-[var(--color-bg-app)]">
      <main className="w-full max-w-[440px]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[var(--color-primary)] rounded-lg flex items-center justify-center mb-3 shadow-lg">
            <span
              className="material-symbols-outlined text-white text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-[var(--color-primary)] tracking-tight">Promos</h2>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 p-4 rounded-md flex items-start gap-3">
            <span className="material-symbols-outlined text-[var(--color-success)]">check_circle</span>
            <p className="text-sm text-[var(--color-success)] font-medium">
              Update successful! Redirecting to sign in page...
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 p-4 rounded-md flex items-start gap-3">
            <span className="material-symbols-outlined text-[var(--color-error)]">error</span>
            <p className="text-sm text-[var(--color-error)] font-medium">
              {error}
            </p>
          </div>
        )}

        <div className="bg-[var(--color-bg)] rounded-lg shadow-soft border border-[var(--color-border)] p-8">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-2">Reset Password</h1>
            <p className="text-sm text-[var(--color-muted)]">
              Please enter your new password.
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--color-text)] tracking-wider block" htmlFor="new-password">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full h-11 px-4 pr-12 rounded-md border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/15 outline-none transition-all text-sm bg-[var(--color-bg)] text-[var(--color-text)]"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--color-text)] tracking-wider block" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  className="w-full h-11 px-4 pr-12 rounded-md border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/15 outline-none transition-all text-sm bg-[var(--color-bg)] text-[var(--color-text)]"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                  onClick={() => setShowConfirm((value) => !value)}
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white h-12 rounded-md font-medium transition-all active:scale-[0.98] shadow-md disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back to Login
              </Link>
            </div>
          </form>
        </div>

        <footer className="mt-8 text-center">
          <p className="text-xs text-[var(--color-muted)]">Promos © 2026 Copyright.</p>
        </footer>
      </main>
    </div>
  );
};

export default ResetPassword;
