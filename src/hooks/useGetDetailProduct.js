import { useEffect, useState, useCallback } from "react";
import { getProductById } from "../services/product-management";

// 1. Hook phải nhận `id` làm tham số
const useGetDetailProduct = (id) => {
  // 2. Khởi tạo data là `null` (vì nó là object)
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // 3. Thêm state `error`
  const [error, setError] = useState(null);

  // 4. Dùng useCallback để ổn định hàm getDetail, phụ thuộc vào `id`
  const getDetail = useCallback(async () => {
    // 1. Kiểm tra xem ID có vào được đây không?
    console.log("Gọi getDetail với ID:", id);

    if (!id) {
      console.log("ID rỗng, dừng lại.");
      setData(null);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const res = await getProductById(id);

      setData(res.data || null);
    } catch (err) {
      // 4. Kiểm tra nếu có lỗi
      console.error("Lỗi khi fetch:", err);
      setError(err);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Bỏ console.log(data) ở đây đi

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  return { data, isLoading, error, handleDetail: getDetail };
};
export default useGetDetailProduct;
