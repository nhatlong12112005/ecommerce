// Dán nội dung này vào file cartSlice.js của bạn

import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    isLoaded: false,
    selectedForOrder: [],
    selectedInCart: [], // <-- THÊM STATE MỚI ĐỂ LƯU CÁC MỤC ĐÃ TICK
  },
  reducers: {
    setCart(state, action) {
      if (action.payload && action.payload.items) {
        state.items = action.payload.items;
      } else {
        state.items = action.payload || [];
      }
      state.isLoaded = true;
    },

    clearCart(state) {
      state.items = [];
      state.isLoaded = false;
      state.selectedForOrder = [];
      state.selectedInCart = []; // <-- Dọn dẹp khi clear cart
    },

    removeSelectedItems(state, action) {
      const selectedIds = action.payload; // Mảng ID của các item ĐÃ MUA

      // Xóa các item đã mua khỏi danh sách 'items'
      state.items = state.items.filter(
        (item) => !selectedIds.includes(item.id)
      );

      // SỬA LỖI: Đồng thời xóa các item đã mua khỏi danh sách 'đã tick'
      state.selectedInCart = state.selectedInCart.filter(
        (id) => !selectedIds.includes(id)
      );
    },

    setSelectedForOrder(state, action) {
      state.selectedForOrder = action.payload || [];
    },

    clearSelectedForOrder(state) {
      state.selectedForOrder = [];
    },

    // --- CÁC REDUCER MỚI ĐỂ QUẢN LÝ VIỆC TICK CHỌN ---

    toggleSelectItemInCart(state, action) {
      const itemId = action.payload;
      const index = state.selectedInCart.indexOf(itemId);
      if (index > -1) {
        state.selectedInCart.splice(index, 1); // Bỏ tick
      } else {
        state.selectedInCart.push(itemId); // Tick
      }
    },

    setSelectAllInCart(state, action) {
      state.selectedInCart = action.payload; // payload là mảng (hoặc rỗng)
    },

    // Dùng khi xóa 1 item (bấm nút Xóa)
    removeItemFromSelection(state, action) {
      const itemId = action.payload;
      state.selectedInCart = state.selectedInCart.filter((id) => id !== itemId);
    },
  },
});

export const {
  setCart,
  clearCart,
  removeSelectedItems,
  setSelectedForOrder,
  clearSelectedForOrder,
  // --- EXPORT CÁC ACTION MỚI ---
  toggleSelectItemInCart,
  setSelectAllInCart,
  removeItemFromSelection,
} = cartSlice.actions;

export default cartSlice.reducer;
