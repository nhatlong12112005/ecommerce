import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useGetListProduct from "../../../hooks/useGetListProduct";
import useDebounce from "../../../hooks/useDebounce"; // 👈 THÊM: Cần cho lọc giá

// --- Import assets ---
import ico_chevron_right from "../../../assets/ico_chevron_right.png";
import ico_chevron_left from "../../../assets/ico_chevron_left.png";

// (Component Loading)
const LoadingComponent = () => (
  <div className="text-center col-span-4 py-20">Đang tải...</div>
);

// (Component Không tìm thấy)
const NoResults = ({ searchTerm }) => (
  <div className="mt-10 text-center text-gray-500 col-span-4 py-20">
    <p>
      Không tìm thấy sản phẩm phù hợp với từ khóa:{" "}
      <span className="font-bold text-black">"{searchTerm}"</span>
    </p>
  </div>
);

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:3000";

  // --- 1. ĐỌC DỮ LIỆU TỪ URL ---
  const urlParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const searchTerm = urlParams.get("q") || "";
  const [page, setPage] = useState(() => Number(urlParams.get("page") || 1));

  // --- 2. THAY THẾ STATE (Bỏ sort, thêm min/max) ---
  const [minPrice, setMinPrice] = useState(() =>
    Number(urlParams.get("min") || 0)
  );
  const [maxPrice, setMaxPrice] = useState(() =>
    Number(urlParams.get("max") || 50000000)
  );

  // --- 3. DEBOUNCE GIÁ ---
  const debouncedMin = useDebounce(minPrice, 500);
  const debouncedMax = useDebounce(maxPrice, 500);

  // --- 4. GỌI API (Đã SỬA) ---
  const {
    data: products = [],
    total,
    isLoading,
  } = useGetListProduct({
    page,
    limit: 8,
    search: searchTerm,
    minPrice: debouncedMin, // 👈 Sửa: Dùng giá đã debounce
    maxPrice: debouncedMax, // 👈 Sửa: Dùng giá đã debounce
  });

  const totalPages = Math.ceil(total / 8);

  // --- 5. EFFECT ĐỒNG BỘ URL (Đã SỬA) ---
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (page > 1) params.set("page", page.toString());

    // Sửa: Đồng bộ min/max thay vì sort
    if (debouncedMin > 0) params.set("min", debouncedMin.toString());
    if (debouncedMax < 50000000) params.set("max", debouncedMax.toString());

    navigate({ search: params.toString() }, { replace: true });
  }, [page, searchTerm, debouncedMin, debouncedMax, navigate]); // 👈 Sửa dependencies

  // Effect reset trang khi lọc
  useEffect(() => {
    if (page !== 1) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, debouncedMin, debouncedMax]);

  // --- 6. HANDLERS (Bỏ handleSortChange) ---
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Các nút giá gợi ý
  const pricePresets = [
    { label: "Dưới 5tr", min: 0, max: 5000000 },
    { label: "5tr - 15tr", min: 5000000, max: 15000000 },
    { label: "Trên 15tr", min: 15000000, max: 50000000 },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      {/* --- Breadcrumbs (Giữ nguyên) --- */}
      <div className="flex items-center text-gray-500 text-sm mb-5">
        <span className="mr-2">🏠</span>
        <Link to="/" className="hover:underline">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium">
          Kết quả tìm kiếm cho:{" "}
          <span className="text-black">'{searchTerm}'</span>
        </span>
      </div>

      {/* --- Tiêu đề + Tổng số (Giữ nguyên) --- */}
      {!isLoading && total > 0 && (
        <h2 className="text-center text-gray-700 text-lg mb-8">
          Tìm thấy <b>{total}</b> sản phẩm cho từ khóa{" "}
          <span className="text-black">'{searchTerm}'</span>
        </h2>
      )}

      {/* --- 7. THANH LỌC GIÁ HÀNG NGANG (MỚI) --- */}
      <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-bold text-gray-800 shrink-0">
          Lọc theo giá
        </h3>

        {/* Inputs */}
        <div className="flex items-center gap-2">
          <label htmlFor="min" className="text-sm font-medium">
            Từ:
          </label>
          <input
            id="min"
            type="number"
            step="100000"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
            className="w-32 px-2 py-1.5 text-sm border rounded-md focus:outline-blue-500"
            placeholder="0"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="max" className="text-sm font-medium">
            Đến:
          </label>
          <input
            id="max"
            type="number"
            step="100000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value) || 50000000)}
            className="w-32 px-2 py-1.5 text-sm border rounded-md focus:outline-blue-500"
            placeholder="50,000,000"
          />
        </div>

        {/* Nút Gợi ý (Nằm bên phải) */}
        <div className="flex items-center gap-2 ml-auto">
          {pricePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setMinPrice(preset.min);
                setMaxPrice(preset.max);
              }}
              className="px-3 py-1.5 text-xs font-medium bg-white border rounded-full hover:bg-gray-100 transition"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- DANH SÁCH SẢN PHẨM (Giữ nguyên) --- */}
      {isLoading ? (
        <LoadingComponent />
      ) : products.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const firstColor = product.productColors?.[0];
            const firstVariant = firstColor?.variants?.[0];
            const imageUrl = firstColor?.imageUrls?.[0];

            if (!firstVariant) return null;

            return (
              <li
                key={product.id}
                className="text-center group flex flex-col justify-between border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div>
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="rounded-t-lg overflow-hidden bg-gray-100 h-[280px] lg:h-[300px] relative">
                      <img
                        src={
                          imageUrl
                            ? `${BACKEND_URL}${imageUrl}`
                            : "/placeholder.jpg"
                        }
                        alt={product.name}
                        className="block size-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-sm font-semibold mt-3 text-gray-800 h-10 px-2 overflow-hidden">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-center font-bold text-base text-red-600 mb-2">
                      <span>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(firstVariant.price)}
                      </span>
                    </div>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <NoResults searchTerm={searchTerm} />
      )}

      {/* --- Phân trang (Giữ nguyên) --- */}
      {!isLoading && totalPages > 0 && (
        <div className="mt-10">
          <ul className="flex items-center justify-center gap-2">
            <li>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="grid place-items-center cursor-pointer size-10 rounded-full border border-gray-300 disabled:opacity-50"
              >
                <img className="size-4" src={ico_chevron_left} alt="Previous" />
              </button>
            </li>
            <li className="text-sm font-medium px-4">
              Trang {page} / {totalPages}
            </li>
            <li>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="grid place-items-center cursor-pointer size-10 rounded-full border border-gray-300 disabled:opacity-50"
              >
                <img className="size-4" src={ico_chevron_right} alt="Next" />
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
