import { useEffect, useState } from "react";
import { getCartApi } from "../services/cart";

const useGetListCartItem = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getList = async () => {
    try {
      setIsLoading(true);
      const res = await getCartApi();
      setData(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getList();
  }, []);
  return { data, handleGetList: getList, isLoading };
};

export default useGetListCartItem;
