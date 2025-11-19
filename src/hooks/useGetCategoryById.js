// hooks/useGetCategoryById.js
import { useEffect, useState, useCallback } from "react";
// Giả sử bạn có service `getCategoryById`
import { getCategoryById } from "../services/category-management";

const useGetCategoryById = (categoryId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCategory = useCallback(async () => {
    if (!categoryId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await getCategoryById(categoryId); // Gọi API

      setData(res?.data || res || null);
    } catch (error) {
      console.log("lỗi lấy thông tin category", error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    getCategory();
  }, [getCategory]);

  return { data, isLoading };
};

export default useGetCategoryById;
