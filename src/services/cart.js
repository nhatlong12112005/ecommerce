import axiosClient from "./axiosClient";

const API_PATH = "/cart";

export const getCartApi = () => axiosClient.get(API_PATH);

export const addToCartApi = (productVariantId, quantity) => {
  return axiosClient.post(`${API_PATH}/item`, {
    productVariantId, // ⚠ thay đổi từ variantId
    quantity,
  });
};

export const updateQuantityApi = (cartItemId, quantity) =>
  axiosClient.patch(`${API_PATH}/item/${cartItemId}`, { quantity });

export const removeItemApi = (cartItemId) =>
  axiosClient.delete(`${API_PATH}/item/${cartItemId}`);
