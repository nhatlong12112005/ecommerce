import axiosClient from "./axiosClient";

const API_GOODS_RECEIPT = "/goods-receipt";

// --- Tạo phiếu nhập ---
export const createGoodsReceipt = (data) => {
  return axiosClient.post(API_GOODS_RECEIPT, data);
};

// --- Lấy danh sách phiếu nhập ---
export const getGoodsReceiptList = (params) => {
  return axiosClient.get(`${API_GOODS_RECEIPT}/list`, { params });
};

// --- Xem chi tiết phiếu nhập ---
export const getGoodsReceiptDetail = (id) => {
  return axiosClient.get(`${API_GOODS_RECEIPT}/${id}`);
};
