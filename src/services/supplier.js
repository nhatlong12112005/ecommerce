// Giả sử file này là: src/services/supplier.js
import axiosClient from "./axiosClient";

const API_SUPPLIER = "/suppliers";

export const getAllSuppliers = () => {
  return axiosClient.get(API_SUPPLIER);
};

export const getSupplierById = (supplierId) => {
  return axiosClient.get(`${API_SUPPLIER}/${supplierId}`);
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
