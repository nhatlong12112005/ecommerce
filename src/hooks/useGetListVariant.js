// src/hooks/useGetListVariant.js
import { useEffect, useState, useCallback } from "react"; // <-- 1. Thêm useCallback
import { fetchDataProductVariantsByProductId } from "../services/product-variant-management";

/**
 * @param {string} productId - ID của sản phẩm (Cha)
 */
const useGetListVariant = (productId) => {
  // <-- 2. Nhận productId làm tham số
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Dùng useCallback để "nhớ" hàm getList
  // Hàm này sẽ chỉ được tạo MỘT LẦN, trừ khi `productId` thay đổi
  const getList = useCallback(async () => {
    // 4. Nếu không có productId (ví dụ: đang tải trang), thì không làm gì cả
    if (!productId) {
      setData([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // 5. Dùng productId được truyền vào
      const res = await fetchDataProductVariantsByProductId(productId);
      setData(res || []); // <-- 6. Sửa: res.data thành res
    } catch (error) {
      console.log("lỗi gọi dduocj api", error);
      setData([]); // Đặt lại data về mảng rỗng nếu lỗi
    } finally {
      setIsLoading(false);
    }
  }, [productId]); // <-- 7. Dependency: Hàm này phụ thuộc vào `productId`

  useEffect(() => {
    getList();
  }, [getList]); // <-- 8. Dependency: Chạy lại effect khi hàm `getList` thay đổi

  return { data, handleGetList: getList, isLoading };
};

export default useGetListVariant;
