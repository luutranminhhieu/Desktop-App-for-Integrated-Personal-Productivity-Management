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
    const token = localStorage.getItem('token');
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
    <div className="min-h-screen bg-white text-[#1A1A2E]">
      <main className="flex min-h-screen w-full">
        <section className="hidden md:flex w-[40%] bg-indigo-brand-gradient flex-col justify-between p-[48px] relative overflow-hidden">
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
              <span className="text-[24px] font-black tracking-tight text-white">Promos</span>
            </div>

          <div className="relative z-10">
            <footer className="pt-4 border-t border-white/10">
              <p className="text-[12px] text-white/40">Promos © 2026 Copyright </p>
            </footer>
          </div>
        </section>

        <section className="flex-1 flex items-center justify-center p-6 bg-white">
          <div className="w-full max-w-[400px]">
            <div className="mb-8">
              <h1 className="text-[24px] font-semibold text-[#1A1A2E] mb-2">Create a New Account</h1>
            </div>

            {error && (
              <div className="mb-4 text-[12px] text-[#EF4444] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {error}
              </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleRegister}>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-[#6B7280]">Username</label>
                <input
                  className="w-full h-[44px] px-4 rounded-lg border border-[#E5E7EB] focus:ring-4 focus:ring-[#4F3CC9]/15 focus:border-[#4F3CC9] transition-all outline-none text-[14px]"
                  placeholder="luutranminhhieu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-[#6B7280]">Email</label>
                <input
                  className="w-full h-[44px] px-4 rounded-lg border border-[#E5E7EB] focus:ring-4 focus:ring-[#4F3CC9]/15 focus:border-[#4F3CC9] transition-all outline-none text-[14px]"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-[#6B7280]">Password</label>
                <div className="relative">
                  <input
                    className="w-full h-[44px] px-4 pr-12 rounded-lg border border-[#E5E7EB] focus:ring-4 focus:ring-[#4F3CC9]/15 focus:border-[#4F3CC9] transition-all outline-none text-[14px]"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#4F3CC9]"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-[#6B7280]">Confirm your password</label>
                <div className="relative">
                  <input
                    className="w-full h-[44px] px-4 pr-12 rounded-lg border border-[#E5E7EB] focus:ring-4 focus:ring-[#4F3CC9]/15 focus:border-[#4F3CC9] transition-all outline-none text-[14px]"
                    placeholder="••••••••"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#4F3CC9]"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                  >
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 py-1">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-[#E5E7EB] text-[#4F3CC9] focus:ring-[#4F3CC9]/20"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label className="text-[13px] text-[#6B7280] leading-normal">
                  I agree with{' '}
                  <a className="text-[#4F3CC9] hover:underline" href="#">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a className="text-[#4F3CC9] hover:underline" href="#">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[44px] bg-[#4F3CC9] text-white font-semibold rounded-lg hover:bg-[#3A2D9E] active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {loading ? 'Creating account' : 'Account is created'}
              </button>

              <div className="text-center mt-2">
                <p className="text-[14px] text-[#6B7280]">
                  Already have an account?{' '}
                  <Link className="text-[#4F3CC9] font-semibold hover:underline" to="/login">
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