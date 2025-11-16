import { useCallback, useEffect, useState } from "react";
import { getOrder } from "../services/order";

const useGetListOrder = ({ page, limit, status }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getList = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        status: status || undefined,
      };
      const res = await getOrder(params);
      setData(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, status]);
  useEffect(() => {
    getList();
  }, [getList]);
  return { data, handleGetList: getList, isLoading };
};
export default useGetListOrder;
