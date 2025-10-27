import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  USER: JSON.parse(localStorage.getItem("user")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    doLogin: (state, action) => {
      state.USER = action.payload; // ✅ nhận trực tiếp user object
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.USER = null;
      localStorage.removeItem("user");
    },
  },
});

export const { doLogin, logout } = authSlice.actions;
export default authSlice.reducer;
