import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
// ❗️ Bỏ useSelector (không dùng)
import UpdateAccount from "./UpdateAccount";
import UpdatePassword from "./UpdatePassword";
import axiosClient from "../../../services/axiosClient";
import { API_USER } from "../../../constant/api";

const MyAccount = () => {
  // ❗️ FIX 1: Thêm state để lưu data người dùng
  const [user, setUser] = useState(null); // Ban đầu là null
  const [isLoading, setIsLoading] = useState(true); // Thêm state loading

  // 🔹 Hai state riêng cho hai modal (Giữ nguyên)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // ❗️ FIX 2: Sửa lại cách gọi API bằng useEffect
  // Tạo một hàm riêng để fetch data
  const fetchUserData = async () => {
    setIsLoading(true); // Bật loading
    try {
      const res = await axiosClient.get(`${API_USER}/me`);
      setUser(res.data); // 👈 Lưu data lấy được vào state
    } catch (error) {
      console.error("Không thể tải thông tin user:", error);
      setUser(null); // Set là null nếu có lỗi
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  // Gọi hàm fetch data khi component được render lần đầu
  useEffect(() => {
    fetchUserData();
  }, []); // 👈 Thêm mảng rỗng để useEffect chỉ chạy 1 lần

  // ❗️ FIX 4: Tạo hàm callback để tải lại data sau khi cập nhật
  const handleAccountUpdateSuccess = () => {
    setIsAccountModalOpen(false); // Đóng modal
    fetchUserData(); // 👈 Tải lại dữ liệu mới nhất
  };

  // ❗️ FIX 3: Thêm giao diện cho lúc đang tải (Loading)
  if (isLoading) {
    return (
      <section className="bg-gray-100 min-h-screen py-10">
        <div className="container mx-auto max-w-4xl text-center p-8">
          <p className="text-gray-600">Đang tải thông tin tài khoản...</p>
        </div>
      </section>
    );
  }

  // Thêm giao diện cho lúc bị lỗi (Không fetch được data)
  if (!user) {
    return (
      <section className="bg-gray-100 min-h-screen py-10">
        <div className="container mx-auto max-w-4xl text-center p-8">
          <p className="text-red-500">
            Không thể tải thông tin. Vui lòng thử lại.
          </p>
        </div>
      </section>
    );
  }

  // 👉 Nếu code chạy được đến đây, nghĩa là 'user' đã có data
  return (
    <section className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto max-w-4xl bg-white rounded-2xl shadow-md p-8 space-y-8">
        {/* --- THÔNG TIN CÁ NHÂN --- */}
        <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-sm transition-all duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Thông tin cá nhân
            </h2>
            <button
              onClick={() => setIsAccountModalOpen(true)}
              className="text-red-500 flex items-center gap-1 hover:text-red-600 hover:underline text-sm"
            >
              <FiEdit className="text-base" />
              Cập nhật
            </button>
          </div>

          {/* Giờ các dòng này đã an toàn để render (vì 'user' đã được định nghĩa) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-gray-700">
            <p>
              <span className="font-medium text-gray-800">Họ và tên:</span>{" "}
              {user.name || "Chưa cập nhật"}
            </p>
            <p>
              <span className="font-medium text-gray-800">Số điện thoại:</span>{" "}
              {user.phone || "Chưa cập nhật"}
            </p>
            <p>
              <span className="font-medium text-gray-800">Email:</span>{" "}
              {user.email || "Chưa cập nhật"}
            </p>
            <p>
              <span className="font-medium text-gray-800">Địa chỉ:</span>{" "}
              {user.address || "Chưa có địa chỉ"}
            </p>
          </div>
        </div>

        {/* --- MẬT KHẨU --- */}
        <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-sm transition-all duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Mật khẩu</h2>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="text-red-500 flex items-center gap-1 hover:text-red-600 hover:underline text-sm"
            >
              <FiEdit className="text-base" />
              Thay đổi mật khẩu
            </button>
          </div>

          <p className="text-gray-600">
            Bạn nên thay đổi mật khẩu định kỳ để bảo mật tài khoản.
          </p>
        </div>
      </div>

      {/* --- MODAL CẬP NHẬT THÔNG TIN --- */}
      {isAccountModalOpen && (
        <UpdateAccount
          user={user}
          onClose={() => setIsAccountModalOpen(false)}
          onSuccess={handleAccountUpdateSuccess} // ❗️ Thêm prop onSuccess
        />
      )}

      {/* --- MODAL ĐỔI MẬT KHẨU --- */}
      {isPasswordModalOpen && (
        <UpdatePassword onClose={() => setIsPasswordModalOpen(false)} />
      )}
    </section>
  );
};

export default MyAccount;
