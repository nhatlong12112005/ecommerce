import { useState, useEffect } from "react";

/**
 * Hook để "trì hoãn" một giá trị (debounce)
 * @param {any} value - Giá trị cần trì hoãn
 * @param {number} delay - Thời gian trì hoãn (ms)
 * @returns {any} Giá trị đã được trì hoãn
 */
export default function useDebounce(value, delay) {
  // State để lưu giá trị đã trì hoãn
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Thiết lập một timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Đây là phần quan trọng:
    // Hủy timer trước đó nếu `value` thay đổi (nghĩa là user vẫn đang gõ)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Chỉ chạy lại effect nếu value hoặc delay thay đổi

  return debouncedValue;
}
