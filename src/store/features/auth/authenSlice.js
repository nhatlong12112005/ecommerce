import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  access_token: localStorage.getItem("access_token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    doLogin: (state, action) => {
      const { access_token } = action.payload;

      // Giải mã token để lấy thông tin user
      const decoded = jwtDecode(access_token);

      // Lưu thông tin user đã decode
      state.user = decoded;
      state.access_token = access_token;

      // Lưu vào localStorage
      localStorage.setItem("user", JSON.stringify(decoded));
      localStorage.setItem("access_token", access_token);
    },

    logout: (state) => {
      state.user = null;
      state.access_token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
    },
  },
});

export const { doLogin, logout } = authSlice.actions;
export default authSlice.reducer;
