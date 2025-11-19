import axiosClient from "./axiosClient";

const API_SUPPLIER = "/suppliers";

// 1. Lấy danh sách hiện có
export const getAllSuppliers = async () => {
  const res = await axiosClient.get(API_SUPPLIER);
  return res.data;
};

// 2. Lấy danh sách thùng rác (MỚI)
export const getTrashSuppliers = async () => {
  const res = await axiosClient.get(`${API_SUPPLIER}/trash`);
  return res.data;
};

// 3. Khôi phục (MỚI)
export const restoreSupplier = async (supplierId) => {
  return axiosClient.patch(`${API_SUPPLIER}/${supplierId}/restore`);
};

export const createSupplier = (data) => {
  return axiosClient.post(API_SUPPLIER, data);
};

export const updateSupplier = (supplierId, data) => {
  return axiosClient.patch(`${API_SUPPLIER}/${supplierId}`, data);
};

export const deleteSupplier = (supplierId) => {
  return axiosClient.delete(`${API_SUPPLIER}/${supplierId}`);
};

export const getSupplierById = (supplierId) => {
  return axiosClient.get(`${API_SUPPLIER}/${supplierId}`);
};
