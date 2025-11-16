import { useState, useEffect, useCallback } from "react";
import { getReviewsForProduct } from "../services/feedback"; // Đảm bảo đường dẫn này đúng
import { toast } from "react-toastify"; // (Nên thêm để báo lỗi)

const useGetListFeedBack = (id) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sử dụng useCallback để hàm `getList` ổn định
  const getList = useCallback(async () => {
    // Chỉ gọi API nếu có `id`
    if (!id) {
      setData([]); // Reset data nếu không có id
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // 1. SỬA LỖI: Truyền `id` vào hàm API
      const res = await getReviewsForProduct(id);

      // 2. HOÀN THIỆN: Set data sau khi gọi thành công
      setData(res.data || []); // Giả sử API trả về { data: [...] } hoặc chỉ [...]
    } catch (error) {
      console.error("Lỗi khi tải đánh giá:", error);
      toast.error("Không thể tải danh sách đánh giá.");
      setData([]); // Đặt lại data khi có lỗi
    } finally {
      // 3. HOÀN THIỆN: Luôn tắt loading sau khi xong
      setIsLoading(false);
    }
  }, [id]); // Phụ thuộc vào `id`

  // 4. HOÀN THIỆN: Tự động gọi `getList` khi `id` thay đổi
  useEffect(() => {
    getList();
  }, [getList]); // getList đã được bọc trong useCallback

  // 5. HOÀN THIỆN: Trả về state và hàm để component khác sử dụng
  return { data, isLoading, getList };
};

export default useGetListFeedBack;
