import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
// Bỏ 'useState' vì không cần nữa
import {
  setCart,
  setSelectedForOrder,
  // --- SỬA 1: IMPORT CÁC ACTION MỚI ---
  toggleSelectItemInCart,
  setSelectAllInCart,
  removeItemFromSelection,
} from "../../../store/features/cart/cartSlice";
import { updateQuantityApi, removeItemApi } from "../../../services/cart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  // --- SỬA 2: Đọc 'selectedItems' từ Redux thay vì useState ---
  const selectedItems = useSelector((state) => state.cart.selectedInCart);
  // Bỏ: const [selectedItems, setSelectedItems] = useState([]);

  const BACKEND_URL = "http://localhost:3000";

  const handleRemove = async (itemId) => {
    try {
      const res = await removeItemApi(itemId);
      if (res.status === 200) {
        dispatch(setCart(res.data));
        toast.success("Xóa thành công");

        // --- SỬA 3: Dispatch action để xóa item khỏi 'selectedInCart' ---
        dispatch(removeItemFromSelection(itemId));
        // Bỏ: setSelectedItems((prev) => prev.filter((id) => id !== itemId));
      }
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const handleQuantityChange = async (itemId, delta) => {
    // ... (logic hàm này không thay đổi)
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return handleRemove(itemId);

    try {
      const res = await updateQuantityApi(itemId, newQuantity);
      if (res.status === 200) dispatch(setCart(res.data));
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  // --- SỬA 4: Dispatch action 'toggle' ---
  const handleSelectItem = (itemId) => {
    dispatch(toggleSelectItemInCart(itemId));
    // Bỏ: setSelectedItems((prev) => ...);
  };

  // --- SỬA 5: Dispatch action 'set all' ---
  const handleSelectAll = (e) => {
    const allItemIds = e.target.checked ? cartItems.map((i) => i.id) : [];
    dispatch(setSelectAllInCart(allItemIds));
    // Bỏ: setSelectedItems(...);
  };

  // Logic này giờ hoàn toàn dựa vào Redux (useMemo)
  // Không cần thay đổi gì ở đây, nó sẽ tự động chạy đúng
  const { itemsForCheckout, totalPrice } = useMemo(() => {
    const selected = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    const sum = selected.reduce(
      (total, item) =>
        total + Number(item.productVariant?.price || 0) * item.quantity,
      0
    );
    return { itemsForCheckout: selected, totalPrice: sum };
  }, [cartItems, selectedItems]);

  const handleOrder = () => {
    // ... (logic hàm này không thay đổi)
    if (itemsForCheckout.length === 0)
      return toast.warn("Bạn chưa chọn sản phẩm nào để đặt hàng.");
    dispatch(setSelectedForOrder(itemsForCheckout));
    navigate("/order");
  };

  if (cartItems.length === 0)
    return (
      <p className="text-center py-20 text-gray-500 text-xl">
        Giỏ hàng trống 😢
      </p>
    );

  return (
    <section className="pt-28 pb-20 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800 tracking-tight">
          Giỏ Hàng
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
          {/* LEFT SECTION */}
          <div className="lg:col-span-4 bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className="hidden lg:grid grid-cols-4 bg-gray-100 font-semibold text-gray-700 text-center py-4 border-b border-gray-200">
              <span className="col-span-2 flex items-center gap-3 justify-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-black"
                  onChange={handleSelectAll}
                  checked={
                    cartItems.length > 0 &&
                    selectedItems.length === cartItems.length
                  }
                />
                Sản phẩm
              </span>
              <span>Số lượng</span>
              <span>Tổng cộng</span>
            </div>

            {cartItems.map((item) => {
              const variant = item.productVariant;
              const name = variant?.productColor?.product?.name || "Sản phẩm";
              const color = variant?.productColor?.color;
              const image = variant?.productColor?.imageUrls?.[0] || "";
              const price = Number(variant?.price || 0);

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-1 lg:grid-cols-4 border-b border-gray-100 p-6 items-center hover:bg-gray-50 transition-all duration-300"
                >
                  <div className="lg:col-span-2 flex items-center gap-4">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-black"
                      onChange={() => handleSelectItem(item.id)}
                      checked={selectedItems.includes(item.id)}
                    />

                    <img
                      src={`${BACKEND_URL}${image}`}
                      alt={name}
                      className="w-24 h-24 rounded-xl object-cover shadow"
                    />

                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        {name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {color} / {variant?.storage}
                      </p>
                      <p className="text-sm text-gray-600 font-medium mt-1">
                        {price.toLocaleString("vi-VN") + "₫"}
                      </p>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 text-sm mt-2 underline hover:text-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  {/* QUANTITY */}
                  <div className="flex justify-center items-center gap-3 mt-4 lg:mt-0">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 font-bold"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold w-10 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* TOTAL PRICE */}
                  <div className="text-center font-bold text-gray-800 text-lg mt-4 lg:mt-0">
                    {(price * item.quantity).toLocaleString("vi-VN") + "₫"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 sticky top-28">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Tóm Tắt Đơn Hàng
              </h3>

              <div className="flex justify-between mb-4 text-gray-600">
                <span>Tạm tính ({itemsForCheckout.length} sản phẩm)</span>
                <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
              </div>

              <div className="flex justify-between mb-4 text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="text-green-600 font-semibold">Miễn phí</span>
              </div>

              <hr className="my-5" />

              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Tổng cộng</span>
                <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
              </div>

              <button
                onClick={handleOrder}
                disabled={itemsForCheckout.length === 0}
                className="mt-8 w-full py-4 rounded-full bg-black text-white text-lg font-semibold hover:bg-white hover:text-black hover:border hover:border-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Tiến hành đặt hàng ({itemsForCheckout.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
