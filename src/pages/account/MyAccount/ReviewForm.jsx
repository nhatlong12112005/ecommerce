import React, { useState } from "react";
import { toast } from "react-toastify";
// 1. IMPORT API SERVICE CỦA BẠN
// (Hãy đảm bảo đường dẫn này chính xác)
import { submitReviewApi } from "../../../services/feedback"; // <-- NHỚ KIỂM TRA LẠI ĐƯỜNG DẪN NÀY

// Component ngôi sao
const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={`text-3xl ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          &#9733; {/* Ký tự ngôi sao */}
        </button>
      ))}
    </div>
  );
};

// 2. Props giờ nhận `productId`
const ReviewForm = ({ orderId, productId, onSubmitted }) => {
  const [rating, setRating] = useState(0); // 0-5 sao
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    setIsLoading(true);
    try {
      // 3. Chuẩn bị data theo yêu cầu của API
      const reviewData = {
        rating: rating,
        comment: comment,
        productId: productId,
        // Nếu API cần cả `orderId`, bạn hãy thêm vào đây
        // orderId: orderId,
      };

      // 4. Gọi API thật
      await submitReviewApi(reviewData);

      // Gọi callback để đóng form (và hiển thị toast bên ngoài)
      onSubmitted();
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      // Hiển thị lỗi từ server nếu có
      const errorMessage =
        error.response?.data?.message ||
        "Gửi đánh giá thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chất lượng sản phẩm:
          </label>
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <div className="mb-3">
          <label
            htmlFor={`comment-${productId}`} // Dùng ID động
            className="block text-sm font-medium text-gray-700"
          >
            Nội dung đánh giá:
          </label>
          <textarea
            id={`comment-${productId}`}
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        <div className="text-right">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm disabled:bg-gray-400"
          >
            {isLoading ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
