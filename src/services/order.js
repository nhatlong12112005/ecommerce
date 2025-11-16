import axiosClient from "./axiosClient";

const API_ORDER = "/orders";

export const getOrder = (params) => axiosClient.get(API_ORDER, { params });
export const addOrder = (data) => axiosClient.post(API_ORDER, data); // user
export const getMyOrder = () => axiosClient.get(`${API_ORDER}/me`); // user
export const updateStatus = (id, status) =>
  axiosClient.patch(`${API_ORDER}/${id}/status`, { status }); // admin
