import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ReviewForm from "./ReviewForm"; // Import component form
import { toast } from "react-toastify";

// (Bạn có thể copy hàm này từ PurchaseHistory.jsx)
const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

const OrderReview = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [reviewingItem, setReviewingItem] = useState(null); // ID của item đang được review

  const BACKEND_URL = "http://localhost:3000"; // Hoặc lấy từ config

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order);
    } else {
      // Xử lý trường hợp người dùng F5 trang hoặc truy cập trực tiếp
      toast.warn("Không tìm thấy dữ liệu đơn hàng. Vui lòng thử lại.");

      // === SỬA 1: Gửi state khi điều hướng ===
      navigate("/purchase-history", { state: { defaultTab: "COMPLETED" } });
    }
  }, [location.state, orderId, navigate]);

  const handleShowReviewForm = (item) => {
    setReviewingItem(item.id === reviewingItem ? null : item.id); // Toggle
  };

  // Hàm này được gọi sau khi submit review thành công
  const handleReviewSubmitted = (itemId) => {
    setReviewingItem(null); // Đóng form
    // Bạn có thể cập nhật trạng thái "đã đánh giá" cho item ở đây
    toast.success("Cảm ơn bạn đã đánh giá sản phẩm!");
  };

  if (!order) {
    return (
      <div className="text-center py-20">Đang tải chi tiết đơn hàng...</div>
    );
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm container">
      <div className="mb-4">
        <button
          // === SỬA 2: Gửi state khi nhấn nút "Quay lại" ===
          onClick={() =>
            navigate("/purchase-history", {
              state: { defaultTab: "COMPLETED" },
            })
          }
          className="text-red-600 hover:underline"
        >
          &larr; Quay lại lịch sử mua hàng
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-4">
        Đánh giá sản phẩm cho đơn hàng #{order.id}
      </h2>

      <div className="space-y-4">
        {order.details.map((item) => {
          // Sao chép logic lấy thông tin sản phẩm từ PurchaseHistory
          const variant = item.productVariant;
          const color = variant?.productColor;
          const product = color?.product;

          // Lấy ID sản phẩm để truyền cho API
          const productId = product?.id;
          const productName = product?.name || "Sản phẩm không xác định";
          const imageUrl = color?.imageUrls?.[0] || "/placeholder.jpg";
          const productStorage = variant?.storage || "";
          const productColor = color?.color || "";

          return (
            <div key={item.id} className="border rounded-lg p-4">
              {/* Thông tin sản phẩm */}
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={`${BACKEND_URL}${imageUrl}`}
                  alt={productName}
                  className="w-20 h-20 object-cover rounded-md border"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{productName}</h3>
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

              {/* Nút và Form Đánh giá */}
              <div className="text-right border-t pt-3">
                <button
                  onClick={() => handleShowReviewForm(item)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                >
                  {reviewingItem === item.id ? "Đóng" : "Viết đánh giá"}
                </button>
              </div>

              {/* Form đánh giá (hiển thị có điều kiện) */}
              {reviewingItem === item.id &&
                (productId ? (
                  <ReviewForm
                    orderId={order.id}
                    // Truyền productId cho form
                    productId={productId}
                    onSubmitted={() => handleReviewSubmitted(item.id)}
                  />
                ) : (
                  <p className="text-red-500 text-center mt-4">
                    Không thể đánh giá sản phẩm này (Lỗi: Thiếu ID sản phẩm).
                  </p>
                ))}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OrderReview;
