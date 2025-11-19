import { API_BRAND } from "../constant/api";
import axiosClient from "./axiosClient";

// 1. Lấy danh sách đang hoạt động
export const fetchBrand = async () => {
  const res = await axiosClient.get(API_BRAND);
  return res.data;
};

// 2. Lấy danh sách thùng rác (MỚI)
export const fetchTrashBrands = async () => {
  const res = await axiosClient.get(`${API_BRAND}/trash`);
  return res.data;
};

// 3. Khôi phục (MỚI)
export const restoreBrand = async (id) => {
  return await axiosClient.patch(`${API_BRAND}/${id}/restore`);
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
