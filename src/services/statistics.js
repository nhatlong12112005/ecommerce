import axiosClient from "./axiosClient";

export const getDashboardStatistics = (params = {}) => {
  return axiosClient
    .get("/statistics/dashboard", { params })
    .then((res) => res.data);
};
