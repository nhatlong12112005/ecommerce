// --- Import ---
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../../services/axiosClient";
import { addOrder } from "../../../services/order";
import { removeItemApi } from "../../../services/cart";
import {
  removeSelectedItems,
  clearSelectedForOrder,
} from "../../../store/features/cart/cartSlice";
import { toast } from "react-toastify";
import { API_USER } from "../../../constant/api";

// --- Format tiền ---
const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price || 0);

const Order = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedForOrder, isLoaded } = useSelector((state) => state.cart);
  const BACKEND_URL = "http://localhost:3000";

  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(0); // 🆕 THÊM PHƯƠNG THỨC THANH TOÁN

  // Chỉ chạy kiểm tra 1 lần
  const hasCheckedOnMount = useRef(false);

  // --- Lấy user ---
  const fetchUserData = async () => {
    setIsUserLoading(true);
    try {
      const res = await axiosClient.get(`${API_USER}/me`);
      setUser(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải thông tin người dùng");
    } finally {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // --- Kiểm tra giỏ hàng ---
  useEffect(() => {
    if (isLoaded && !isUserLoading && !hasCheckedOnMount.current) {
      if (!selectedForOrder || selectedForOrder.length === 0) {
        toast.info("Không có sản phẩm nào để đặt hàng.");
        navigate("/cart");
      }
      hasCheckedOnMount.current = true;
    }
  }, [selectedForOrder, isLoaded, isUserLoading, navigate]);

  // --- Tổng tiền ---
  const totalAmount = useMemo(() => {
    if (!selectedForOrder) return 0;
    return selectedForOrder.reduce((total, item) => {
      const price = parseFloat(item.productVariant?.price) || 0;
      return total + price * item.quantity;
    }, 0);
  }, [selectedForOrder]);

  // --- Xác nhận đặt hàng ---
  const handleConfirm = async () => {
    if (!selectedForOrder || selectedForOrder.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    try {
      const orderItemsDto = selectedForOrder.map((item) => ({
        productVariantId: item.productVariant.id,
        quantity: item.quantity,
      }));

      await addOrder({
        items: orderItemsDto,
        paymentMethod: paymentMethod, // 🆕 GỬI PHƯƠNG THỨC THANH TOÁN CHO BACKEND
      });

      const selectedCartItemIds = selectedForOrder.map((item) => item.id);

      // Xóa backend
      await Promise.all(
        selectedCartItemIds.map((itemId) => removeItemApi(itemId))
      );

      // Xóa Redux
      dispatch(removeSelectedItems(selectedCartItemIds));

      toast.success("Đặt hàng thành công! ❤️");

      dispatch(clearSelectedForOrder());
      navigate("/purchase-history");
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      toast.error("Đặt hàng thất bại");
    }
  };

  if (isUserLoading || !isLoaded) return <p>Đang tải...</p>;

  return (
    <section className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          🧾 Chi tiết đơn hàng
        </h2>

        {/* THÔNG TIN KHÁCH HÀNG */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">
            👤 Thông tin khách hàng
          </h3>
          <p>Họ tên: {user?.name}</p>
          <p>Số điện thoại: {user?.phone}</p>
          <p>Địa chỉ: {user?.address}</p>
        </div>

        {/* PHƯƠNG THỨC THANH TOÁN */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">
            💳 Phương thức thanh toán
          </h3>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border p-2 rounded-md w-full"
          >
            <option value={0}>Thanh toán khi nhận hàng (COD)</option>
            <option value={1}>Thanh toán bằng VNPay</option>
          </select>
        </div>

        {/* SẢN PHẨM */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">🛍️ Sản phẩm đã đặt</h3>

          {selectedForOrder.map((item) => {
            const variant = item.productVariant;

            const name = variant?.productColor?.product?.name || "Sản phẩm";
            const color = variant?.productColor?.color || "";
            const imageUrl = variant?.productColor?.imageUrls?.[0] || "";
            const price = parseFloat(variant?.price || 0);
            const itemSubtotal = price * item.quantity;

            return (
              <div key={item.id} className="flex justify-between border-b py-3">
                <div className="flex gap-4 items-center">
                  <img
                    src={`${BACKEND_URL}${imageUrl}`}
                    alt={name}
                    className="w-20 h-20 rounded-lg object-cover border"
                  />
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-gray-500">
                      {color} | {variant?.storage}
                    </p>
                    <p className="text-sm text-gray-500">
                      SL: {item.quantity} × {formatPrice(price)}
                    </p>
                  </div>
                </div>

                <p className="font-semibold text-gray-700">
                  {formatPrice(itemSubtotal)}
                </p>
              </div>
            );
          })}
        </div>

        {/* TỔNG TIỀN */}
        <div className="bg-white mt-8 p-6 rounded-2xl shadow-md text-right">
          <p className="text-lg font-semibold">
            Tổng cộng:{" "}
            <span className="text-red-600">{formatPrice(totalAmount)}</span>
          </p>
        </div>

        {/* NÚT XÁC NHẬN */}
        <div className="text-center mt-8">
          <button
            onClick={handleConfirm}
            className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-white hover:text-black hover:border hover:border-black transition-all"
          >
            Xác nhận đặt hàng
          </button>
        </div>
      </div>
    </section>
  );
};

export default Order;
