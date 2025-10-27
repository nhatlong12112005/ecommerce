import { useEffect, useState } from "react";
import { fetchCategories } from "../services/category-management";

const useGetListCategory = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getList = async () => {
    try {
      setIsLoading(true);
      const res = await fetchCategories();
      setData(res.data || []); // backend trả về data hoặc danh sách
    } catch (err) {
      console.error("Error fetching category list", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  return { data, handleGetList: getList, isLoading };
};

export default useGetListCategory;
