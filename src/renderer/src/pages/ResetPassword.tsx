import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ResetPassword = (): React.JSX.Element => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showSuccess) {
      return;
    }

    const timer = window.setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [showSuccess, navigate]);

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (!password || password !== confirmPassword) {
      return;
    }
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-[#1A1A2E]" style={{ backgroundColor: '#F5F4FA' }}>
      <main className="w-full max-w-[440px]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#4F3CC9] rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-[#4F3CC9]/20">
            <span
              className="material-symbols-outlined text-white text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
          </div>
          <h2 className="text-[24px] font-semibold text-[#4F3CC9] tracking-tight">Promos</h2>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-[#10B981]/10 border border-[#10B981]/20 p-4 rounded-lg flex items-start gap-3">
            <span className="material-symbols-outlined text-[#10B981]">check_circle</span>
            <p className="text-[14px] text-[#10B981] font-medium">
              Update successful! Redirecting to sign in page...
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(79,60,201,0.08)] border border-[#E5E7EB] p-8">
          <header className="mb-6">
            <h1 className="text-[24px] font-semibold text-[#1A1A2E] mb-2">Reset Password</h1>
            <p className="text-[14px] text-[#6B7280]">
              Please enter your new password.
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[12px] font-medium text-[#1A1A2E] tracking-wider block" htmlFor="new-password">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full h-[44px] px-4 pr-12 rounded-lg border border-[#E5E7EB] focus:border-[#4F3CC9] focus:ring-[3px] focus:ring-[#4F3CC9]/15 outline-none transition-all text-[14px]"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#4F3CC9] transition-colors"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-[#1A1A2E] tracking-wider block" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  className="w-full h-[44px] px-4 pr-12 rounded-lg border border-[#E5E7EB] focus:border-[#4F3CC9] focus:ring-[3px] focus:ring-[#4F3CC9]/15 outline-none transition-all text-[14px]"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#4F3CC9] transition-colors"
                  onClick={() => setShowConfirm((value) => !value)}
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4F3CC9] hover:bg-[#3A2D9E] text-white h-[48px] rounded-lg font-medium transition-all active:scale-[0.98] shadow-md shadow-[#4F3CC9]/20"
            >
              Update Password
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="text-[14px] text-[#6B7280] hover:text-[#4F3CC9] transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to Login
              </Link>
            </div>
          </form>
        </div>

        <footer className="mt-8 text-center">
          <p className="text-[12px] text-[#6B7280]">Promos © 2026 Copyright.</p>
        </footer>
      </main>
    </div>
  );
};

export default ResetPassword;
