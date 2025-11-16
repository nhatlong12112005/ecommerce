import React, { useState } from "react";
import { Link } from "react-router-dom"; // Giả sử bạn dùng React Router

// --- DỮ LIỆU GIẢ (MOCK DATA) ---
// Trong thực tế, dữ liệu này sẽ nằm trong cơ sở dữ liệu của bạn.
const mockUserData = [
  { id: 1, email: "user1@example.com", password: "password123" },
  { id: 2, email: "admin@myapp.com", password: "supersecret-admin-pass" },
  { id: 3, email: "test@gmail.com", password: "MyTestPassword@2025" },
];

const ForgotPassword = () => {
  // --- State Management ---
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // State để lưu mật khẩu tìm được
  const [foundPassword, setFoundPassword] = useState(null);
  // State để quản lý trạng thái đã copy
  const [isCopied, setIsCopied] = useState(false);

  // --- Form Handling ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setFoundPassword(null);
    setIsCopied(false);

    // Giả lập việc tìm kiếm trong cơ sở dữ liệu
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Giả lập độ trễ mạng

    try {
      // Tìm người dùng trong danh sách dữ liệu giả
      const user = mockUserData.find((user) => user.email === email);

      if (user) {
        // Nếu tìm thấy, lưu mật khẩu vào state để hiển thị
        setFoundPassword(user.password);
      } else {
        // Nếu không tìm thấy, tạo ra một lỗi
        throw new Error("Không tìm thấy tài khoản nào khớp với email này.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm để copy mật khẩu
  const handleCopyPassword = () => {
    if (foundPassword) {
      navigator.clipboard.writeText(foundPassword);
      setIsCopied(true);
      // Reset trạng thái copy sau 2 giây
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // --- Render ---
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        {/* --- Giao diện khi đã TÌM THẤY mật khẩu --- */}
        {foundPassword ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Tìm thấy tài khoản!
            </h2>
            <p className="mt-2 text-gray-600">
              Mật khẩu của bạn cho tài khoản{" "}
              <strong className="font-medium text-gray-800">{email}</strong> là:
            </p>

            {/* Box hiển thị mật khẩu và nút copy */}
            <div className="relative mt-4 p-4 font-mono text-lg text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-lg">
              {foundPassword}
              <button
                onClick={handleCopyPassword}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                title="Copy mật khẩu"
              >
                {isCopied ? (
                  // Checkmark icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  // Copy icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {isCopied && (
              <p className="text-sm text-green-600 mt-2">Đã sao chép!</p>
            )}

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Đi đến trang Đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          /* --- Giao diện form ban đầu --- */
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Tìm lại mật khẩu
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Nhập email đã đăng ký để tìm lại mật khẩu của bạn.
                <br />
                <span className="text-xs">
                  (Thử với: user1@example.com hoặc test@gmail.com)
                </span>
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
              {error && (
                <div
                  className="p-3 text-sm text-red-800 bg-red-100 rounded-lg"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="sr-only">
                  Địa chỉ email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nhập địa chỉ email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? "Đang tìm..." : "Tìm mật khẩu"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
};

export default ForgotPassword;
