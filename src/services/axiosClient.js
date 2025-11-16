import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ KHÔNG ghi đè config.params ở interceptor
axiosClient.interceptors.request.use((config) => {
  // Có thể thêm token, nhưng KHÔNG xoá config.params
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
