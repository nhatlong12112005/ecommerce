// hooks/useGetListProduct.js
import { useEffect, useState, useCallback } from "react";
import { getProducts } from "../services/product-management";

// 👇 SỬA 1: Thêm minPrice và maxPrice vào props
const useGetListProduct = ({
  page,
  limit,
  search,
  brandId,
  categoryId,
  minPrice, // 👈 THÊM
  maxPrice, // 👈 THÊM
}) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getList = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search: search || undefined,
        brandId: brandId || undefined,
        categoryId: categoryId || undefined,
        // 👇 SỬA 2: Thêm minPrice và maxPrice vào params
        minPrice: Number(minPrice) || undefined, // 👈 THÊM
        maxPrice: Number(maxPrice) || undefined, // 👈 THÊM
      };

      const res = await getProducts(params);
      const payload = res.data?.data || res.data || [];
      setData(payload);

      setTotal(res.data.totalItems || 0);
    } catch (error) {
      console.log("lỗi ", error);
      setData([]), setTotal(0);
    } finally {
      setIsLoading(false);
    }
    // 👇 SỬA 3: Thêm minPrice và maxPrice vào dependencies
  }, [page, limit, search, brandId, categoryId, minPrice, maxPrice]); // 👈 THÊM

  useEffect(() => {
    getList();
  }, [getList]);

  return { data: data, total, isLoading, handleGetList: getList };
};

export default useGetListProduct;
