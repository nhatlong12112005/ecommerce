import { API_USER } from "../constant/api";
import axiosClient from "./axiosClient";

// 1. Lấy danh sách (Active)
export const fetchDataCustomer = async (params) => {
  const res = await axiosClient.get(API_USER, {
    params,
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  return res.data;
};

// 2. Lấy thùng rác (MỚI)
export const getTrashCustomers = async () => {
  const res = await axiosClient.get(`${API_USER}/trash`);
  return res.data; // Backend trả về mảng users
};

// 3. Khôi phục (MỚI)
export const restoreCustomer = async (userId) => {
  return await axiosClient.patch(`${API_USER}/${userId}/restore`);
};

// 4. Cập nhật trạng thái (Khóa/Mở khóa)
export const updateCustomerStatus = async (userId, statusValue) => {
  // statusValue: 1 (Active) hoặc 0 (Inactive)
  // Backend cần body là JSON object { isActive: number }
  const res = await axiosClient.patch(`${API_USER}/${userId}/status`, {
    isActive: statusValue,
  });
  return res.data;
};

// 5. Xóa mềm
export const deleteCustomer = async (userId) => {
  const res = await axiosClient.delete(`${API_USER}/${userId}`);
  return res.data;
};
