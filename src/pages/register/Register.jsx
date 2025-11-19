import React, { useState } from "react";
import { API_REGISTER } from "../../constant/api";
import axiosClient from "../../services/axiosClient";
import { useNavigate } from "react-router-dom";
// 1. Import thư viện thông báo
import { toast } from "react-toastify";

export const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading để chặn spam nút click
  const [formRegister, setFormRegister] = useState({
    email: "",
    name: "",
    password: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormRegister({
      ...formRegister,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- 2. VALIDATION CLIENT-SIDE (Kiểm tra trước khi gửi) ---

    // Kiểm tra độ dài mật khẩu
    if (formRegister.password.length < 8) {
      toast.warning("Mật khẩu phải có ít nhất 8 ký tự!");
      return; // Dừng hàm, không gửi dữ liệu đi
    }

    // Kiểm tra các trường bắt buộc khác (tuỳ chọn thêm)
    if (!formRegister.email || !formRegister.phone || !formRegister.name) {
      toast.warning("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setIsLoading(true); // Bắt đầu loading

    try {
      // --- 3. GỌI API ---
      const res = await axiosClient.post(API_REGISTER, formRegister);

      if (res.status === 201 || res.status === 200) {
        // --- 4. THÔNG BÁO THÀNH CÔNG ---
        toast.success("Đăng ký tài khoản thành công! Đang chuyển hướng...");

        // Đợi 1.5 giây để người dùng đọc thông báo rồi mới chuyển trang
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.log(error);

      // --- 5. XỬ LÝ LỖI TỪ BACKEND (Trùng Email/SĐT) ---
      if (error.response && error.response.data) {
        const { message } = error.response.data;

        // Backend thường trả về message dạng chuỗi hoặc mảng
        if (Array.isArray(message)) {
          toast.error(message[0]); // Lấy lỗi đầu tiên
        } else {
          // Ví dụ Backend trả về: "Email already exists" hoặc "Phone number already exists"
          toast.error(message || "Đăng ký thất bại.");
        }
      } else {
        toast.error("Lỗi kết nối server. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false); // Tắt loading dù thành công hay thất bại
    }
  };

  return (
    <div className=" flex items-center justify-center min-h-screen ">
      <div className=" w-full max-w-md bg-white p-8 shadow rounded ">
        <h2 className=" text-2xl font-bold mb-6 text-center ">Register</h2>

        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            className=" mb-4 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px] "
            type="text"
            name="name"
            placeholder="UserName"
            onChange={handleChange}
            value={formRegister.name}
            required
          />
          <input
            className=" mb-4 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px] "
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            value={formRegister.phone}
            required
          />
          <input
            className=" mb-4 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px] "
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formRegister.email}
            required
            autoComplete="new-email"
          />
          <input
            className=" mb-4 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px] "
            type="text"
            name="address"
            placeholder="Address"
            onChange={handleChange}
            value={formRegister.address}
          />
          <input
            className=" mb-4 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px] "
            type="password"
            name="password"
            placeholder="Password (min 8 chars)"
            onChange={handleChange}
            value={formRegister.password}
            autoComplete="new-password"
            required
          />

          <button
            type="submit"
            disabled={isLoading} // Khóa nút khi đang xử lý
            className={`w-full uppercase h-[50px] text-white font-semibold text-sm px-4 flex-1 rounded-lg transition-all
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-white hover:border hover:border-black hover:text-black"
                }
            `}
          >
            {isLoading ? "Processing..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};
