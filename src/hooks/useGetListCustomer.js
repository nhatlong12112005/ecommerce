// useGetListCustomer.js
import { useEffect, useState } from "react";
import { fetchDataCustomer } from "../services/customer-managment";

const useGetListCustomer = ({
  page,
  limit,
  search,
  status, // status là SỐ (-1, 0, 1)
  refetchTrigger,
}) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getList = async () => {
      try {
        setIsLoading(true);

        // === LOGIC ĐÚNG NẰM Ở ĐÂY ===

        // 1. Xây dựng params
        const params = {
          page: Number(page) || 1,
          limit: Number(limit) || 10,
          search: search || undefined,
          // Logic mới:
          // Nếu status KHÁC -1 (tức là 0 hoặc 1),
          // thì thêm { isActive: status } (chính là SỐ 0 hoặc 1) vào params.
          // Nếu status là -1, không thêm gì cả.
          ...(status !== -1 ? { isActive: status } : {}),
        };

        // 2. Gọi API với params đã sửa (sẽ gửi ?isActive=0 hoặc ?isActive=1)
        const res = await fetchDataCustomer(params);

        // 3. Set data (API đã lọc, không cần lọc lại ở client)
        setData(res.data || []);
        setTotal(res.totalItems || 0);

        // === KẾT THÚC SỬA LỖI ===
      } catch (err) {
        // Lỗi 400 (Bad Request) sẽ không còn ở đây nữa
        console.error("Error fetching customer list", err);
        setData([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    getList();
  }, [page, limit, search, status, refetchTrigger]);

  return { data, total, isLoading };
};

export default useGetListCustomer;
