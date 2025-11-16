import axiosClient from "./axiosClient";

// Sửa thành '/feedback' để khớp với controller
const API_FEEDBACK = "/feedback";

/**
 * Gửi 1 đánh giá
 */
export const submitReviewApi = (data) => {
  // data = { rating: 5, comment: "Tốt", productId: "uuid-..." }
  // Sửa thành API_FEEDBACK
  return axiosClient.post(API_FEEDBACK, data);
};

/**
 * Lấy tất cả đánh giá của 1 sản phẩm
 */
export const getReviewsForProduct = (productId) => {
  // Sửa thành API_FEEDBACK
  return axiosClient.get(`${API_FEEDBACK}/product/${productId}`);
};
