import { useState, useEffect, useCallback } from "react";
// Import API service đã tạo
import { getColorGroupsByProductId } from "../services/product-management";

export default function useGetListColorGroups(productId) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Dùng state này để trigger fetch lại dữ liệu khi gọi handleGetList
  const [refetchIndex, setRefetchIndex] = useState(0);

  /**
   * Hàm gọi để "refresh" lại danh sách
   */
  const handleGetList = useCallback(() => {
    setRefetchIndex((prev) => prev + 1); // Tăng index để trigger useEffect
  }, []);

  useEffect(() => {
    // Không fetch nếu không có productId
    if (!productId) {
      setData([]); // Xóa data cũ nếu product bị "bỏ chọn"
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Gọi API để lấy danh sách nhóm màu
        const response = await getColorGroupsByProductId(productId);
        setData(response.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhóm màu:", error);
        setData([]); // Đặt về mảng rỗng nếu lỗi
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId, refetchIndex]); // Sẽ chạy lại khi productId thay đổi, hoặc khi refetchIndex thay đổi

  return {
    data,
    isLoading,
    handleGetList, // Trả ra hàm để component cha gọi
  };
}
