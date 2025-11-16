import React from "react";

// --- URL Backend (Để hiển thị ảnh) ---
const BACKEND_URL = "http://localhost:3000";

// --- Hàm tiện ích (Copy từ PurchaseHistory) ---
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// --- Map trạng thái (Để hiển thị tiếng Việt) ---
const statusMap = {
  PENDING: { label: "Đang chờ xử lý", color: "text-yellow-500" },
  SHIPPED: { label: "Đang giao hàng", color: "text-blue-500" },
  COMPLETED: { label: "Hoàn thành", color: "text-green-500" },
  CANCELLED: { label: "Đã huỷ", color: "text-red-500" },
};
// ------------------------------------------

const OrderDetail = ({ order, onBack }) => {
  if (!order) return null;

  // Lấy thông tin trạng thái từ Map
  const statusInfo = statusMap[order.status] || {
    label: order.status,
    color: "text-gray-500",
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm container">
      <button
        onClick={onBack}
        className="text-sm text-gray-600 hover:text-red-500 mb-4"
      >
        ← Quay lại lịch sử mua hàng
      </button>

      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Chi tiết đơn hàng #{order.id}
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* SỬA 1: Thông tin khách hàng (Dùng 'order.user') */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-2">
            Thông tin khách hàng
          </h3>
          {/* LƯU Ý: 'order.user' chỉ tồn tại nếu API của bạn (findMyOrder)
            có trả về 'user'. Nếu không, bạn cần xóa phần này.
            (Hiện tại, hàm findMyOrder của bạn CHƯA có 'user') 
          */}
          {order.user ? (
            <>
              <p>
                <strong>Họ tên:</strong> {order.user.name}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {order.user.phone}
              </p>
              <p>
                <strong>Địa chỉ nhận hàng:</strong> {order.user.address}
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-sm">
              Không có thông tin người dùng (API chưa trả về).
            </p>
          )}
        </div>

        {/* SỬA 2: Giao hàng + Thanh toán (Sửa 'order.date' và bỏ 'paymentMethod') */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-2">
            Thông tin đơn hàng
          </h3>
          <p>
            <strong>Ngày đặt:</strong> {formatDate(order.orderDate)}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <span className={`font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </p>
          {/* <p>
            <strong>Phương thức thanh toán:</strong> COD (Hiện chưa có data)
          </p> */}
        </div>
      </div>

      {/* SỬA 3: Danh sách sản phẩm (Sửa toàn bộ logic map) */}
      <div className="mt-6 border rounded-lg p-4">
        <h3 className="font-semibold text-gray-700 mb-3">Sản phẩm</h3>

        {/* Dùng 'order.details' thay vì 'order.items' */}
        {order.details.map((item) => {
          // Bóc tách data lồng nhau
          const variant = item.productVariant;
          const color = variant?.productColor;
          const product = color?.product;

          const productName = product?.name || "Sản phẩm không xác định";
          const imageUrl = color?.imageUrls?.[0] || "/placeholder.jpg";
          const productStorage = variant?.storage || "";
          const productColor = color?.color || "";

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 py-3 border-b last:border-b-0"
            >
              <img
                src={`${BACKEND_URL}${imageUrl}`}
                alt={productName}
                className="w-20 h-20 object-cover rounded-md border"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{productName}</p>
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

        {/* SỬA 4: Tổng cộng (Dùng 'order.totalAmount') */}
        <div className="text-right mt-4 pt-3 border-t">
          <div className="text-lg font-bold text-gray-800">
            Tổng cộng:{" "}
            <span className="text-red-600">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetail;
