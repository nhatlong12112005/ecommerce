import axiosClient from "./axiosClient"; // Import file axiosClient của bạn

// =============================================
// 📦 QUẢN LÝ SẢN PHẨM (ProductsController)
// =============================================

export const getProducts = (params) => {
  return axiosClient.get("/products", { params });
};

export const getProductById = (id) => {
  return axiosClient.get(`/products/${id}`);
};

export const createProduct = (productData) => {
  return axiosClient.post("/products", productData);
};

export const updateProduct = (id, updateData) => {
  return axiosClient.patch(`/products/${id}`, updateData);
};

export const deleteProduct = (id) => {
  return axiosClient.delete(`/products/${id}`);
};

// =============================================
// 🎨 QUẢN LÝ NHÓM MÀU (ProductColorController)
// =============================================

/**

 */
export const createColor = (data) => {
  return axiosClient.post("/product-color", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Upload hình ảnh MỚI cho nhóm màu
 * @param {string} colorGroupId - ID của nhóm màu
 * @param {FormData} formData - FormData chứa các file ảnh (key 'files')
 */
export const uploadColorImages = (colorGroupId, formData) => {
  return axiosClient.post(
    `/product-color/${colorGroupId}/upload-images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const updateColorGroup = (id, updateData) => {
  return axiosClient.patch(`/product-color/${id}`, updateData);
};

export const deleteColorGroup = (id) => {
  return axiosClient.delete(`/product-color/${id}`);
};

// =============================================
// 📱 QUẢN LÝ BIẾN THỂ (ProductVariantsController)
// =============================================

/**
 * Lấy danh sách các NHÓM MÀU (kèm variant) theo ID sản phẩm
 */
export const getColorGroupsByProductId = (productId) => {
  return axiosClient.get(`/product-color/by-product/${productId}`);
};

export const createVariant = (variantData) => {
  return axiosClient.post("/product-variants", variantData);
};

/**
 * Cập nhật MỘT BIẾN THỂ đơn lẻ
 * @param {string} variantId - ID của biến thể (512GB)
 * @param {object} updateData - { storage, price, stock }
 */
export const updateVariant = (variantId, updateData) => {
  return axiosClient.patch(`/product-variants/${variantId}`, updateData);
};

/**
 * Xóa MỘT BIẾN THỂ đơn lẻ
 * @param {string} variantId - ID của biến thể
 */
export const deleteVariant = (variantId) => {
  return axiosClient.delete(`/product-variants/${variantId}`);
};
