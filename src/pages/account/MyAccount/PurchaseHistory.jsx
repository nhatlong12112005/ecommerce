import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import OrderDetail from "./OrderDetail ";
import useGetListMyOrder from "../../../hooks/useGetListMyOrder";
import { updateStatus } from "../../../services/order";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const BACKEND_URL = "http://localhost:3000";

const LoadingComponent = () => (
  <div className="text-center py-20">Đang tải lịch sử mua hàng...</div>
);

const EmptyOrderHistory = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <img
      src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/404page/empty-order.1f6fd397.png"
      alt="Empty Orders"
      className="w-40 h-40 mb-4"
    />
    <p className="text-gray-500">
      Bạn chưa có đơn hàng nào.{" "}
      <Link to={"/"} className="text-red-600 hover:underline">
        Mua sắm ngay!
      </Link>
    </p>
  </div>
);

const PurchaseHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(
    location.state?.defaultTab || "PENDING"
  );
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const { data, isLoading, handleGetList } = useGetListMyOrder();

  const socketRef = useRef(null);

  const tabs = [
    { id: "PENDING", label: "Đang chờ xử lý" },
    { id: "SHIPPED", label: "Đang giao hàng" },
    { id: "COMPLETED", label: "Hoàn thành" },
    { id: "CANCELLED", label: "Đã huỷ" },
  ];

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  // --- Socket.IO real-time update ---
  useEffect(() => {
    socketRef.current = io(BACKEND_URL);

    socketRef.current.on("order-status-updated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === updatedOrder.id ? { ...o, status: updatedOrder.status } : o
        )
      );
    });

    return () => socketRef.current.disconnect();
  }, []);

  // --- Sync orders from hook ---
  useEffect(() => {
    if (data) setOrders(data);
  }, [data]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?"))
      return;
    try {
      await updateStatus(orderId, "CANCELLED");
      toast.success("Đã hủy đơn hàng thành công.");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "CANCELLED" } : o))
      );
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      toast.error("Hủy đơn hàng thất bại. Vui lòng thử lại.");
    }
  };

  const handleReview = (order) => {
    navigate(`/review/${order.id}`, { state: { order } });
  };

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => order.status === activeTab);
  }, [orders, activeTab]);

  if (isLoading) {
    return (
      <section className="bg-white p-6 rounded-lg shadow-sm container">
        <LoadingComponent />
      </section>
    );
  }

  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <section className="bg-white p-6 rounded-lg shadow-sm container">
        <EmptyOrderHistory />
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm container">
      {/* Tabs */}
      <div className="flex border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-500 hover:text-red-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4 mb-6 flex items-center gap-3">
        <h2 className="font-semibold text-gray-700">Lịch sử mua hàng</h2>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Bạn không có đơn hàng nào ở trạng thái này.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span>Ngày đặt: {formatDate(order.orderDate)}</span>
                <span>
                  Trạng thái:{" "}
                  <span className="font-semibold text-red-500">
                    {tabs.find((t) => t.id === order.status)?.label}
                  </span>
                </span>
              </div>

              {/* Products */}
              {order.details.map((item) => {
                const variant = item.productVariant;
                const color = variant?.productColor;
                const product = color?.product;
                const productName = product?.name || "Sản phẩm không xác định";
                const imageUrl = color?.imageUrls?.[0] || "/placeholder.jpg";
                const productStorage = variant?.storage || "";
                const productColor = color?.color || "";
                return (
                  <div key={item.id} className="flex items-center gap-4 mb-3">
                    <img
                      src={`${BACKEND_URL}${imageUrl}`}
                      alt={productName}
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {productName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Phân loại: {productColor}, {productStorage}
                      </p>
                      <p className="text-sm text-gray-500">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <div className="font-semibold text-gray-800">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                );
              })}

              {/* Footer: tổng tiền + nút */}
              <div className="flex justify-between items-center border-t pt-3">
                <div className="text-gray-700 font-semibold">
                  Tổng tiền: {formatPrice(order.totalAmount)}
                </div>

                <div className="flex items-center gap-3">
                  {order.status === "PENDING" && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      Hủy đơn hàng
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                  >
                    Xem chi tiết
                  </button>

                  {order.status === "COMPLETED" && (
                    <button
                      onClick={() => handleReview(order)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                    >
                      Đánh giá sản phẩm
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default PurchaseHistory;
