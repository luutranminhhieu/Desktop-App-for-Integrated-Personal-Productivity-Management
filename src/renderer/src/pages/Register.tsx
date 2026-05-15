import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (!termsAccepted) {
      setError('Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật.');
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
        setError(response.error || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra trong quá trình đăng ký.');
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

          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-white text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
              <span className="text-[24px] font-black tracking-tight text-white">FocusHub</span>
            </div>

            <div className="mt-10">
              <h2 className="text-[32px] font-extrabold text-white leading-tight mb-4">
                Làm chủ thời gian.<br />Tập trung vào điều quan trọng.
              </h2>
              <p className="text-[14px] text-[#EDE9FF] opacity-80 max-w-[320px]">
                Giải pháp tối ưu giúp bạn duy trì trạng thái tập trung và hoàn thành mọi mục tiêu trong công việc.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="grid grid-cols-3 gap-6 mb-10">
              {[
                { icon: 'calendar_today', label: 'Lịch biểu' },
                { icon: 'timer', label: 'Tập trung' },
                { icon: 'description', label: 'Ghi chú' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">{item.icon}</span>
                  </div>
                  <span className="text-[12px] text-[#EDE9FF]">{item.label}</span>
                </div>
              ))}
            </div>

            <footer className="pt-4 border-t border-white/10">
              <p className="text-[12px] text-white/40">© 2023 FocusHub Productivity Suite</p>
            </footer>
          </div>
        </section>

        <section className="flex-1 flex items-center justify-center p-6 bg-white">
          <div className="w-full max-w-[400px]">
            <div className="mb-8">
              <h1 className="text-[24px] font-semibold text-[#1A1A2E] mb-2">Tạo tài khoản mới</h1>
              <p className="text-[14px] text-[#6B7280]">Bắt đầu hành trình nâng cao năng suất của bạn ngay hôm nay.</p>
            </div>

            {error && (
              <div className="mb-4 text-[12px] text-[#EF4444] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {error}
              </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleRegister}>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-[#6B7280]">Họ và tên</label>
                <input
                  className="w-full h-[44px] px-4 rounded-lg border border-[#E5E7EB] focus:ring-4 focus:ring-[#4F3CC9]/15 focus:border-[#4F3CC9] transition-all outline-none text-[14px]"
                  placeholder="Nguyễn Văn A"
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
                <label className="text-[12px] font-medium text-[#6B7280]">Mật khẩu</label>
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
                <div className="flex gap-2 mt-1">
                  <div className="password-strength-bar flex-1 bg-[#EF4444]"></div>
                  <div className="password-strength-bar flex-1 bg-[#F59E0B]"></div>
                  <div className="password-strength-bar flex-1 bg-[#4F3CC9]"></div>
                  <div className="password-strength-bar flex-1 bg-[#10B981]"></div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-[#6B7280]">Xác nhận mật khẩu</label>
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
                  Tôi đồng ý với{' '}
                  <a className="text-[#4F3CC9] hover:underline" href="#">
                    Điều khoản sử dụng
                  </a>{' '}
                  và{' '}
                  <a className="text-[#4F3CC9] hover:underline" href="#">
                    Chính sách bảo mật
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[44px] bg-[#4F3CC9] text-white font-semibold rounded-lg hover:bg-[#3A2D9E] active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
              </button>

              <div className="text-center mt-2">
                <p className="text-[14px] text-[#6B7280]">
                  Đã có tài khoản?{' '}
                  <Link className="text-[#4F3CC9] font-semibold hover:underline" to="/login">
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center justify-center mb-4">
                <div className="w-full border-t border-[#E5E7EB]"></div>
                <span className="absolute px-4 bg-white text-[12px] text-[#6B7280]">Hoặc đăng ký bằng</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 h-[44px] border border-[#E5E7EB] rounded-lg hover:bg-[#F5F4FA] transition-colors text-[14px]">
                  <img
                    alt="Google Logo"
                    className="w-5 h-5"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg3mcufAqWwgxunoKBiWSoFGNOnBByGirSdqUEnbmmnkhntV4UVku9Ro6vdoKHm4S7j2mDOlzKLcTWnsphdQhXVOIdIPDxuq9r2ewCuVB0u7Z2kJuyU4_x06fKq4PWevcdQrk75BxdVURvNueri1qCVPdEH-LAXH_feUfLxkG7W8tW19P-NdBMle8K6Aie6LjqB4s7x08njgKpchHmTTAgJg8Od0ki4F3sraiyBYdLs3RIgV39jJtML79adpCC5yZkXRJGYe2OEpY"
                  />
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 h-[44px] border border-[#E5E7EB] rounded-lg hover:bg-[#F5F4FA] transition-colors text-[14px]">
                  <span
                    className="material-symbols-outlined text-[#1A1A2E]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    ios
                  </span>
                  Apple
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Register;