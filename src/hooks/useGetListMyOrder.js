import { useCallback, useEffect, useState } from "react";
import { getMyOrder } from "../services/order"; // Import API

const useGetListMyOrder = () => {
  const [data, setData] = useState(null); // Sửa: Mặc định là null
  const [isLoading, setIsLoading] = useState(true);

  const getList = useCallback(async () => {
    // 👈 Bọc trong useCallback
    try {
      setIsLoading(true);
      const res = await getMyOrder();
      setData(res.data || []); // Đảm bảo trả về mảng nếu res.data null
    } catch (error) {
      console.log(error);
      setData([]); // Trả về mảng rỗng nếu lỗi
    } finally {
      setIsLoading(false);
    }
  }, []); // Rỗng vì nó không phụ thuộc gì

  useEffect(() => {
    getList();
  }, [getList]);

  // 👈 SỬA: Trả về 'getList'
  return { data, handleGetList: getList, isLoading };
};

export default useGetListMyOrder;
