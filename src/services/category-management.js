import { API_CATEGORY } from "../constant/api";
import axiosClient from "./axiosClient";

export const fetchCategories = async () => {
  const res = await axiosClient.get(API_CATEGORY);
  return res.data;
};

// --- THÊM MỚI ---
export const fetchTrashCategories = async () => {
  // Gọi API lấy thùng rác
  const res = await axiosClient.get(`${API_CATEGORY}/trash`);
  return res.data;
};

export const restoreCategory = async (id) => {
  // Gọi API khôi phục
  return await axiosClient.patch(`${API_CATEGORY}/${id}/restore`);
};
// ----------------

export const addCategory = async (data) => {
  return await axiosClient.post(API_CATEGORY, data);
};

export const removeCategories = async (id) => {
  return await axiosClient.delete(`/categories/${id}`);
};

export const updateCategories = async (id, data) => {
  return await axiosClient.patch(`/categories/${id}`, data);
};

export const getCategoryById = async (id) => {
  const res = await axiosClient.get(`/categories/${id}`);
  return res.data;
};
