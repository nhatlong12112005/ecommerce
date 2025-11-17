import { API_USER } from "../constant/api";
import axiosClient from "./axiosClient";

export const fetchDataCustomer = async (params) => {
  const res = await axiosClient.get(API_USER, {
    params,
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  return res.data;
};

export const updateCustomerStatus = async (userId, isActive) => {
  const res = await axiosClient.patch(`${API_USER}/${userId}/status`, isActive);

  return res.data;
};

export const deleteCustomer = async (userId) => {
  const res = await axiosClient.delete(`${API_USER}/${userId}`);
  return res.data;
};
