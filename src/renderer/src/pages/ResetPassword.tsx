import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
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

  const handleSubmit = (event: React.FormEvent) => {
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
          <h2 className="text-[24px] font-semibold text-[#4F3CC9] tracking-tight">FocusHub</h2>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-[#10B981]/10 border border-[#10B981]/20 p-4 rounded-lg flex items-start gap-3">
            <span className="material-symbols-outlined text-[#10B981]">check_circle</span>
            <p className="text-[14px] text-[#10B981] font-medium">
              Cập nhật thành công! Đang chuyển hướng về trang đăng nhập...
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(79,60,201,0.08)] border border-[#E5E7EB] p-8">
          <header className="mb-6">
            <h1 className="text-[24px] font-semibold text-[#1A1A2E] mb-2">Đặt mật khẩu mới</h1>
            <p className="text-[14px] text-[#6B7280]">
              Vui lòng nhập mật khẩu mới của bạn để tiếp tục sử dụng ứng dụng.
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[12px] font-medium text-[#1A1A2E] uppercase tracking-wider block" htmlFor="new-password">
                Mật khẩu mới
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
              <div className="pt-2">
                <div className="flex gap-1 h-[6px]">
                  <div className="flex-1 rounded-full bg-[#EF4444]"></div>
                  <div className="flex-1 rounded-full bg-[#F59E0B]"></div>
                  <div className="flex-1 rounded-full bg-[#4F3CC9]"></div>
                  <div className="flex-1 rounded-full bg-[#10B981]"></div>
                </div>
                <p className="text-[12px] text-[#10B981] mt-1">Mật khẩu mạnh</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-[#1A1A2E] uppercase tracking-wider block" htmlFor="confirm-password">
                Xác nhận mật khẩu mới
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
              Cập nhật mật khẩu
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="text-[14px] text-[#6B7280] hover:text-[#4F3CC9] transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-8 rounded-xl overflow-hidden grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBMkWK-Mr9SMvlN5SWMthrMewgTgfhQBeDY-v-gYyPa6HzBNZY_-aZxaXpJUkmSoEN-sdAwDWW1qAvgFFEpYMYHngc4T4mTtI93MA8WLqrsUIpD0LOa8ZCovxciU7cJ0UZghqEN7BfKyfUVasp4rJLPqx6b99wtssJ_3e0RKFszSjhEt1K9v88U2zI4kuZQKzBDOukpzv5EQ6cCB3q6-vAGy_ziBXT0GMKBqGNrPdQgrUDhMUBjN16anJmKLeG05-vscU9TWb6E9M"
            alt="Productivity workspace"
            className="w-full h-32 object-cover"
          />
        </div>

        <footer className="mt-8 text-center">
          <p className="text-[12px] text-[#6B7280]">© 2023 FocusHub Productivity Suite. Tất cả quyền được bảo lưu.</p>
        </footer>
      </main>
    </div>
  );
};

export default ResetPassword;
