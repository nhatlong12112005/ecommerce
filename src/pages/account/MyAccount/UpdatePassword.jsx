import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaEye, FaEyeSlash, FaInfoCircle } from "react-icons/fa";
import axiosClient from "../../../services/axiosClient";
import { API_UPDATE_PASS } from "../../../constant/api";

const UpdatePassword = ({ onClose }) => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleSubmit = async () => {
    // --- Kiểm tra dữ liệu trước ---
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      // --- Gọi API ---
      const res = await axiosClient.patch(API_UPDATE_PASS, {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      console.log("Kết quả từ API:", res);
      alert("Đổi mật khẩu thành công!");
      onClose();
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      alert("Đổi mật khẩu thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative animate-fadeIn">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <IoClose size={22} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Đổi mật khẩu
        </h2>

        {/* Mật khẩu cũ */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 font-medium mb-1">
            Mật khẩu cũ
          </label>
          <input
            type={showPassword.old ? "text" : "password"}
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            placeholder="Nhập mật khẩu cũ của bạn"
            className="w-full border border-gray-300 rounded-lg p-2.5 pr-10 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => togglePassword("old")}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          >
            {showPassword.old ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Mật khẩu mới */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 font-medium mb-1">
            Mật khẩu mới
          </label>
          <input
            type={showPassword.new ? "text" : "password"}
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Nhập mật khẩu mới của bạn"
            className="w-full border border-gray-300 rounded-lg p-2.5 pr-10 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => togglePassword("new")}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          >
            {showPassword.new ? <FaEyeSlash /> : <FaEye />}
          </button>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <FaInfoCircle className="text-gray-400" /> Mật khẩu tối thiểu 6 ký
            tự, có ít nhất 1 chữ số và 1 chữ cái
          </p>
        </div>

        {/* Nhập lại mật khẩu mới */}
        <div className="mb-6 relative">
          <label className="block text-gray-700 font-medium mb-1">
            Nhập lại mật khẩu mới
          </label>
          <input
            type={showPassword.confirm ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu mới của bạn"
            className="w-full border border-gray-300 rounded-lg p-2.5 pr-10 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => togglePassword("confirm")}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          >
            {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="w-full bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-600 transition"
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
