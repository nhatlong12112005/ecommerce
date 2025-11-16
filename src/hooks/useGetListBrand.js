import { useEffect, useState } from "react";

import { fetchBrand } from "../services/brand-managment";

const useGetListBrand = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getList = async () => {
    try {
      setIsLoading(true);
      const res = await fetchBrand(); // 'res' bây giờ là data (mảng brand)
      console.log(res);

      // SỬA LẠI Ở ĐÂY: Dùng 'res' trực tiếp
      setData(res || []);
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

export default useGetListBrand;
