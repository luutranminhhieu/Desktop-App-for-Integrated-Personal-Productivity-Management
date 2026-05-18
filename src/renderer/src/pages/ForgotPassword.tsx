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
    <div className="min-h-screen bg-[#F5F4FA] flex items-center justify-center p-4 relative overflow-hidden text-[#1A1A2E]">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[#EDE9FF] rounded-full mix-blend-multiply blur-3xl opacity-30"></div>
        <div className="absolute top-[60%] -right-[5%] w-[30%] h-[30%] bg-[#F6F2FE] rounded-full mix-blend-multiply blur-3xl opacity-40"></div>
      </div>

      <main className="w-full max-w-[420px] bg-white rounded-xl p-[40px] shadow-soft border border-[#E5E7EB]">
        {!submitted ? (
          <div className="flex flex-col gap-2 items-center text-center">
            <div className="flex items-center justify-center w-[80px] h-[80px] rounded-full bg-[#EDE9FF]">
              <span className="material-symbols-outlined text-[48px] text-[#4F3CC9]">
                mail
              </span>
            </div>
            <h1 className="text-[24px] font-semibold text-[#1A1A2E]">
              Forgot your password?
            </h1>
            <p className="text-[14px] text-[#6B7280]">
              Enter your email. We will send you a reset password link.
            </p>

            {error && (
              <div className="text-[12px] text-[#EF4444] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {error}
              </div>
            )}

            <form className="w-full space-y-6" onSubmit={handleSubmit}>
              <div className="text-left">
                <label
                  className="block text-[12px] font-medium text-[#6B7280] mb-2"
                  htmlFor="email"
                >
                  Your email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full h-[44px] px-4 rounded-lg border border-[#E5E7EB] focus:border-[#4F3CC9] input-glow transition-all outline-none text-[14px]"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 h-[44px] bg-[#4F3CC9] hover:bg-[#3A2D9E] text-white font-medium rounded-lg transition-colors active:scale-[0.98] disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Confirm your email'}
              </button>
            </form>

            <Link to='/login' className=" mt-2 flex items-center gap-2 text-[14px] text-[#6B7280] hover:text-[#4F3CC9] transition-colors">
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              <span className="underline underline-offset-4">
                Back to sign in
              </span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex items-center justify-center w-[80px] h-[80px] rounded-full bg-[#F6F2FE]">
              <span
                className="material-symbols-outlined text-[48px] text-[#10B981]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <h1 className="text-[24px] font-semibold text-[#1A1A2E] mb-2">
              Check you email
            </h1>
            <p className="text-[14px] text-[#6B7280] mb-8">
              We have send the mail to you{" "}
              <span className="font-semibold text-[#1A1A2E]">
                {email || "example@email.com"}
              </span>
              . Please check your email (even spam).
            </p>

            <div className="w-full space-y-4">
              <button
                className="w-full h-[44px] border border-[#E5E7EB] text-[#1A1A2E] font-medium rounded-lg hover:bg-[#F6F2FE] transition-colors active:scale-[0.98]"
                type="button"
                onClick={handleResend}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send again'}
              </button>
              <button
                className="block w-full text-center text-[14px] text-[#6B7280] hover:text-[#4F3CC9]"
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