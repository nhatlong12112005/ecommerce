// useGetListCustomer.js
import { useEffect, useState } from "react";
import { fetchDataCustomer } from "../services/customer-managment";

// 1. Cập nhật để nhận refetchTrigger
const useGetListCustomer = ({
  page,
  limit,
  search,
  status,
  refetchTrigger,
}) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getList = async () => {
      try {
        setIsLoading(true);

        let isActiveParam;
        if (status === "active") {
          isActiveParam = true;
        } else if (status === "locked") {
          isActiveParam = false;
        }

        const params = {
          page: Number(page) || 1,
          limit: Number(limit) || 10,
          search: search || undefined,
          ...(typeof isActiveParam === "boolean"
            ? { isActive: isActiveParam }
            : {}),
        };

        const res = await fetchDataCustomer(params);
        let filteredData = res.data || [];

        // Nếu API đang trả về tất cả, ta lọc thủ công theo isActiveParam
        if (typeof isActiveParam === "boolean") {
          filteredData = filteredData.filter(
            (user) => user.isActive === isActiveParam
          );
        }

        setData(filteredData); // Sửa từ res.data thành filteredData
        setTotal(res.totalItems || 0);
      } catch (err) {
        console.error("Error fetching customer list", err);
        setData([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    getList();
    // 2. Thêm refetchTrigger vào mảng dependencies
  }, [page, limit, search, status, refetchTrigger]);

  return { data, total, isLoading };
};

export default useGetListCustomer;
