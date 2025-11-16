// --- SỬA 1: Import thêm 'useRef' ---
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

  // --- SỬA 2: Thêm một cờ (flag) bằng 'useRef' ---
  // Cờ này để đảm bảo 'useEffect' kiểm tra giỏ hàng chỉ chạy 1 lần
  const hasCheckedOnMount = useRef(false);

  const fetchUserData = async () => {
    setIsUserLoading(true);
    try {
      const res = await axiosClient.get(`${API_USER}/me`);
      setUser(res.data);
    } catch (error) {
      console.error("Không thể tải thông tin user:", error);
      toast.error("Không thể tải thông tin người dùng");
    } finally {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // --- SỬA 3: Cập nhật 'useEffect' kiểm tra giỏ hàng ---
  useEffect(() => {
    // Chỉ chạy nếu: data đã tải xong VÀ chúng ta chưa kiểm tra lần nào
    if (isLoaded && !isUserLoading && !hasCheckedOnMount.current) {
      // Nếu không có sản phẩm, báo lỗi và điều hướng
      if (!selectedForOrder || selectedForOrder.length === 0) {
        toast.info("Không có sản phẩm nào để đặt hàng.");
        navigate("/cart");
      }

      // Đánh dấu là đã kiểm tra, không chạy lại logic này nữa
      hasCheckedOnMount.current = true;
    }
  }, [selectedForOrder, isLoaded, isUserLoading, navigate]); // Giữ nguyên dependencies

  const totalAmount = useMemo(() => {
    if (!selectedForOrder) return 0;
    return selectedForOrder.reduce((total, item) => {
      const price = parseFloat(item.productVariant?.price) || 0;
      return total + price * item.quantity;
    }, 0);
  }, [selectedForOrder]);

  // (Hàm handleConfirm không cần sửa, đã đúng)
  const handleConfirm = async () => {
    if (!selectedForOrder || selectedForOrder.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    try {
      // 1. Tạo DTO
      const orderItemsDto = selectedForOrder.map((item) => ({
        productVariantId: item.productVariant.id,
        quantity: item.quantity,
      }));

      // 2. GỌI API ĐẶT HÀNG
      await addOrder({ items: orderItemsDto });

      // 3. Lấy ID của các CartItems
      const selectedCartItemIds = selectedForOrder.map((item) => item.id);

      // 4. GỌI API XÓA GIỎ HÀNG (Backend)
      await Promise.all(
        selectedCartItemIds.map((itemId) => removeItemApi(itemId))
      );

      // 5. Dọn dẹp REDUX (Frontend)
      dispatch(removeSelectedItems(selectedCartItemIds));

      // 6. Thông báo và điều hướng
      toast.success("Đặt hàng thành công! Cảm ơn bạn đã mua sắm ❤️");
      dispatch(clearSelectedForOrder());
      navigate("/purchase-history");
    } catch (err) {
      console.error("Lỗi khi đặt hàng:", err);
      toast.error("Đặt hàng thất bại!");
    }
  };

  if (isUserLoading || !isLoaded) {
    // ... (render loading)
  }

  return (
    // ... (Toàn bộ phần JSX render không đổi)
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
          <select className="border p-2 rounded-md w-full">
            <option value="COD">Thanh toán khi nhận hàng (COD)</option>
          </select>
        </div>

        {/* DANH SÁCH SẢN PHẨM */}
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
