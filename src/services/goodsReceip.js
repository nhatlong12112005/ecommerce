// Giả sử file này là: src/services/goodsReceipt.js
import axiosClient from "./axiosClient";

const API_GOODS_RECEIPT = "/goods-receipt";

export const createGoodsReceipt = (data) => {
  return axiosClient.post(API_GOODS_RECEIPT, data);
};

export const createGoodsReceiptFromFile = (file, supplierId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("supplierId", supplierId);

  return axiosClient.post(`${API_GOODS_RECEIPT}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
