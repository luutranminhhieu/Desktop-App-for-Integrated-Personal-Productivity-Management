import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F4FA] flex items-center justify-center p-4 relative overflow-hidden text-[#1A1A2E]">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[#EDE9FF] rounded-full mix-blend-multiply blur-3xl opacity-30"></div>
        <div className="absolute top-[60%] -right-[5%] w-[30%] h-[30%] bg-[#F6F2FE] rounded-full mix-blend-multiply blur-3xl opacity-40"></div>
      </div>

      <main className="w-full max-w-[420px] bg-white rounded-xl p-[40px] shadow-soft border border-[#E5E7EB]">
        {!submitted ? (
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex items-center justify-center w-[80px] h-[80px] rounded-full bg-[#EDE9FF]">
              <span className="material-symbols-outlined text-[48px] text-[#4F3CC9]">mail</span>
            </div>
            <h1 className="text-[24px] font-semibold text-[#1A1A2E] mb-2">Quên mật khẩu?</h1>
            <p className="text-[14px] text-[#6B7280] mb-8">
              Nhập email của bạn. Chúng tôi sẽ gửi link đặt lại mật khẩu.
            </p>

            <form className="w-full space-y-6" onSubmit={handleSubmit}>
              <div className="text-left">
                <label className="block text-[12px] font-medium text-[#6B7280] mb-2" htmlFor="email">
                  Địa chỉ email
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
                className="w-full h-[44px] bg-[#4F3CC9] hover:bg-[#3A2D9E] text-white font-medium rounded-lg transition-colors active:scale-[0.98]"
              >
                Gửi link đặt lại
              </button>
            </form>

            <Link
              to="/login"
              className="mt-8 flex items-center gap-2 text-[14px] text-[#6B7280] hover:text-[#4F3CC9] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="underline underline-offset-4">Quay lại đăng nhập</span>
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
            <h1 className="text-[24px] font-semibold text-[#1A1A2E] mb-2">Kiểm tra email của bạn</h1>
            <p className="text-[14px] text-[#6B7280] mb-8">
              Chúng tôi đã gửi link đến{' '}
              <span className="font-semibold text-[#1A1A2E]">{email || 'example@email.com'}</span>. Vui lòng kiểm tra hộp thư đến
              (và cả thư rác).
            </p>

            <div className="w-full space-y-4">
              <button
                className="w-full h-[44px] border border-[#E5E7EB] text-[#1A1A2E] font-medium rounded-lg hover:bg-[#F6F2FE] transition-colors active:scale-[0.98]"
                type="button"
              >
                Gửi lại email
              </button>
              <button
                className="block w-full text-center text-[14px] text-[#6B7280] hover:text-[#4F3CC9]"
                type="button"
                onClick={() => setSubmitted(false)}
              >
                <span className="underline underline-offset-4">Thử một email khác</span>
              </button>
            </div>

            <Link
              to="/login"
              className="mt-8 flex items-center gap-2 text-[14px] text-[#6B7280] hover:text-[#4F3CC9] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="underline underline-offset-4">Quay lại đăng nhập</span>
            </Link>
          </div>
        )}
      </main>

      <div className="absolute bottom-4 right-4 opacity-20 hidden md:block">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnJwmtuzjdZjtuct2JSQ4YV66uA5wLfYuwerXOXXMCC_lf5RR4DEL3qIwOrh9POwVmmau4ju-g5ljDyPNUMNzGKIbVAbpWS5fOb-jdOqiiO9drmJxYO0cqOozh8-cRP8dHqnjxwDTUJhttC9IPiEDXh-EzH9FAIujDoaG82ojr8CcEBVBKHm_2OBG-dRDHgPHG_lt_vDe5_BC-9Kg0CPTgZz5vHiMH5I0C21hEjQrQm36-i5VO3a7QQr7Bz5XchCaBmJfb5Ogri1Q"
          alt="Office workspace"
          className="w-[200px] rounded-lg grayscale"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
