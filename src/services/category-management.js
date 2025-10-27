import axiosClient from "./axiosClient";
import {
  API_CREATE_CATEGORY,
  API_GET_LIST_CATEGORY,
  API_REMOVE_CATEGORY,
} from "../constant/apis";

// ✅ Lấy danh sách category
export const fetchCategories = async () => {
  try {
    const response = await axiosClient.get(API_GET_LIST_CATEGORY);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// ✅ Tạo category mới
export const createCategory = async (data) => {
  try {
    const response = await axiosClient.post(API_CREATE_CATEGORY, data);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// ✅ Xóa category theo id
export const removeCategories = async (id) => {
  try {
    const endpoint = API_REMOVE_CATEGORY.replace(":id", id);
    const response = await axiosClient.delete(endpoint);
    return response;
  } catch (error) {
    console.error("Error removing category:", error);
    throw error;
  }
};

// // ✅ Lấy chi tiết category theo id
// export const getDetailCategories = async (id) => {
//   try {
//     const endpoint = API_DETAIL_CATEGORY.replace(":id", id);
//     const response = await axiosClient.get(endpoint);
//     return response;
//   } catch (error) {
//     console.error("Error getting category detail:", error);
//     throw error;
//   }
// };
