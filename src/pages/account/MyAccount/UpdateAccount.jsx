import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import axiosClient from "../../../services/axiosClient";
import { API_USER } from "../../../constant/api";

// 1. Nhận thêm prop 'onSuccess' từ cha (MyAccount)
const UpdateAccount = ({ user, onClose, onSuccess }) => {
  const getInitialState = () => ({
    name: user?.name || "",
    address: user?.address || "",
    phone: user?.phone || "",
  });

  const [form, setForm] = useState(getInitialState());
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.patch(`${API_USER}/me`, form);

      window.alert("Cập nhật thông tin thành công!");

      // 2. ❗️ GỌI HÀM CALLBACK 'onSuccess'
      // (Hàm này sẽ tự động đóng modal VÀ tải lại data ở trang cha)
      if (onSuccess) {
        onSuccess(res.data); // Gửi data mới về (nếu cha cần)
      } else {
        // Nếu không có onSuccess (dự phòng), thì chỉ đóng modal
        onClose();
      }
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      window.alert(
        `Cập nhật thất bại: ${error.response?.data?.message || "Có lỗi xảy ra"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm(getInitialState());
  };

  // --- (Toàn bộ phần JSX của bạn giữ nguyên, nó đã đúng) ---
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          <IoClose size={22} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Cập nhật thông tin cá nhân
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            disabled={isLoading}
          >
            Thiết lập lại
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAccount;
