import React, { JSX, useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await window.api.auth.requestPasswordReset(email);
      if (response.success) {
        setSubmitted(true);
      } else {
        setError(response.error || 'Failed to send reset email.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error occurred during reset request.';
      setError(errorMessage || 'Error occurred during reset request.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (): Promise<void> => {
    if (!email) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await window.api.auth.resendPasswordReset(email);
      if (!response.success) {
        setError(response.error || 'Failed to resend email.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error occurred while resending email.';
      setError(errorMessage || 'Error occurred while resending email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-app)] flex items-center justify-center p-4 relative overflow-hidden text-[var(--color-text)]">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[var(--color-primary-light)] rounded-full mix-blend-multiply blur-3xl opacity-30"></div>
        <div className="absolute top-[60%] -right-[5%] w-[30%] h-[30%] bg-[var(--color-primary-lighter)] rounded-full mix-blend-multiply blur-3xl opacity-40"></div>
      </div>

      <main className="w-full max-w-[420px] bg-[var(--color-bg)] rounded-lg p-10 shadow-soft border border-[var(--color-border)]">
        {!submitted ? (
          <div className="flex flex-col gap-2 items-center text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-primary-light)]">
              <span className="material-symbols-outlined text-5xl text-[var(--color-primary)]">
                mail
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-[var(--color-text)]">
              Forgot your password?
            </h1>
            <p className="text-sm text-[var(--color-muted)]">
              Enter your email. We will send you a reset password link.
            </p>

            {error && (
              <div className="text-xs text-[var(--color-error)] flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}

            <form className="w-full space-y-6" onSubmit={handleSubmit}>
              <div className="text-left">
                <label
                  className="block text-xs font-medium text-[var(--color-muted)] mb-2"
                  htmlFor="email"
                >
                  Your email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full h-11 px-4 rounded-md border border-[var(--color-border)] focus:border-[var(--color-primary)] input-glow transition-all outline-none text-sm bg-[var(--color-bg)] text-[var(--color-text)]"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 h-11 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium rounded-md transition-colors active:scale-[0.98] disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Confirm your email'}
              </button>
            </form>

            <Link to='/login' className=" mt-2 flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
              <span className="material-symbols-outlined text-lg">
                arrow_back
              </span>
              <span className="underline underline-offset-4">
                Back to sign in
              </span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-primary-lighter)]">
              <span
                className="material-symbols-outlined text-5xl text-[var(--color-success)]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-2">
              Check you email
            </h1>
            <p className="text-sm text-[var(--color-muted)] mb-8">
              We have send the mail to you{" "}
              <span className="font-semibold text-[var(--color-text)]">
                {email || "example@email.com"}
              </span>
              . Please check your email (even spam).
            </p>

            <div className="w-full space-y-4">
              <button
                className="w-full h-11 border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-md hover:bg-[var(--color-primary-lighter)] transition-colors active:scale-[0.98]"
                type="button"
                onClick={handleResend}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send again'}
              </button>
              <button
                className="block w-full text-center text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)]"
                type="button"
                onClick={() => setSubmitted(false)}
              >
                <span className="underline underline-offset-4">
                  Try another email
                </span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ForgotPassword;