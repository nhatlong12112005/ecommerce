import axios from "axios";

const API_BASE = "http://localhost:3000";

const rawAxios = axios.create({
  baseURL: API_BASE,
  //   withCredentials: true,
});

const axiosClient = axios.create({
  baseURL: API_BASE,
  //   withCredentials: true,
});

// Gắn accessToken vào mọi request
axiosClient.interceptors.request.use((config) => {
  //   const state = store.getState();
  //   const accessToken = state.auth.accessToken;

  //   if (accessToken) {
  //     config.headers = {
  //       ...config.headers,
  //       Authorization: `Bearer ${accessToken}`,
  //     };
  //   }

  // Nếu có config.pathParams thì thay thế vào URL
  if (config.pathParams) {
    Object.entries(config.pathParams).forEach(([key, value]) => {
      config.url = config.url.replace(`:${key}`, value);
    });
  }

  return config;
});

// Tự động refresh token khi lỗi 401
// axiosClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes("/auth/refresh")
//     ) {
//       originalRequest._retry = true;
//       try {
//         // 🛠 Dùng raw axios không có interceptor để gọi refresh
//         const res = await rawAxios.post("/auth/refresh");
//         const { accessToken, user } = res.data;

//         store.dispatch(doLogin({ user, accessToken }));

//         originalRequest.headers = {
//           ...originalRequest.headers,
//           Authorization: `Bearer ${accessToken}`,
//         };

//         return axiosClient(originalRequest);
//       } catch (refreshError) {
//         store.dispatch(logout());
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosClient;
