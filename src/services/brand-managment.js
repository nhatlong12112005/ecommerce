import { API_BRAND } from "../constant/api";
import axiosClient from "./axiosClient";

// SỬA LẠI Ở ĐÂY: Thêm async/await và trả về res.data
export const fetchBrand = async () => {
  const res = await axiosClient.get(API_BRAND);
  return res.data; // Trả về data trực tiếp
};

export const addBrand = async (data) => {
  return await axiosClient.post(API_BRAND, data);
};
export const removeBrand = async (id) => {
  return await axiosClient.delete(`${API_BRAND}/${id}`);
};

export const updateBrand = async (id, data) => {
  return await axiosClient.patch(`${API_BRAND}/${id}`, data);
};
