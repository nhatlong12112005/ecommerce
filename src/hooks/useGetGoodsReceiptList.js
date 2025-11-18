// src/hooks/useGetGoodsReceiptList.js
import { useEffect, useState, useCallback } from "react";
import { getGoodsReceiptList } from "../services/goodsReceip";

const useGetListGoodsReceipt = ({
  page,
  limit,
  supplierId,
  fromDate,
  toDate,
} = {}) => {
  const [data, setData] = useState({ receipts: [] }); // mặc định object với receipts
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        supplierId: supplierId || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      };

      const res = await getGoodsReceiptList(params);

      const payload = res.data || { receipts: [], total: 0 };
      console.log("API payload:", payload);

      setData({ receipts: payload.receipts || [] }); // chỉ lấy mảng receipts
      setTotal(payload.total || payload.receipts?.length || 0);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách phiếu nhập:", err);
      setError(err);
      setData({ receipts: [] });
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, supplierId, fromDate, toDate]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    data,
    total,
    isLoading,
    error,
    handleGetList: fetchList,
  };
};
export default useGetListGoodsReceipt;
