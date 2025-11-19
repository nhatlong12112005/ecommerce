import {
  Link,
  useParams,
  useLocation, // MỚI: Import useLocation
  useNavigate, // MỚI: Import useNavigate
} from "react-router-dom";
import { useState, useMemo, useEffect } from "react"; // MỚI: Import useEffect
import useDebounce from "../../../hooks/useDebounce";
import useGetListProduct from "../../../hooks/useGetListProduct";
import useGetCategoryById from "../../../hooks/useGetCategoryById";

// --- Import assets ---
import ico_chevron_right from "../../../assets/ico_chevron_right.png";
import ico_chevron_left from "../../../assets/ico_chevron_left.png";

// (Component Loading)
const LoadingComponent = () => (
  <div className="text-center col-span-4 py-20">Đang tải...</div>
);

const ProductPage = () => {
  const { id: categoryId } = useParams();

  // MỚI: Khởi tạo các hook để đọc và ghi URL
  const location = useLocation();
  const navigate = useNavigate();

  // MỚI: Đọc các tham số (params) từ URL
  // 'URLSearchParams' là một API của trình duyệt giúp làm việc với query string
  const urlParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  // THAY ĐỔI: Các state giờ sẽ đọc giá trị ban đầu từ URL
  const [page, setPage] = useState(() => {
    return Number(urlParams.get("page") || 1);
  });
  const [search, setSearch] = useState(() => {
    return urlParams.get("q") || ""; // Dùng 'q' cho search
  });
  const [brand, setBrand] = useState(() => {
    return urlParams.get("brand") || "";
  });

  // --- Lọc giá: Double Range Slider ---
  const [minPriceInput, setMinPriceInput] = useState(() => {
    return Number(urlParams.get("min") || 0);
  });
  const [maxPriceInput, setMaxPriceInput] = useState(() => {
    return Number(urlParams.get("max") || 50000000);
  });

  const debouncedSearch = useDebounce(search, 500);
  const debouncedMinPrice = useDebounce(minPriceInput, 500);
  const debouncedMaxPrice = useDebounce(maxPriceInput, 500);

  // MỚI: useEffect để CẬP NHẬT URL khi state thay đổi
  useEffect(() => {
    const params = new URLSearchParams();

    // Chỉ thêm vào URL nếu giá trị khác mặc định
    if (page > 1) {
      params.set("page", page.toString());
    }
    if (debouncedSearch) {
      params.set("q", debouncedSearch);
    }
    if (brand) {
      params.set("brand", brand);
    }
    if (debouncedMinPrice > 0) {
      params.set("min", debouncedMinPrice.toString());
    }
    if (debouncedMaxPrice < 50000000) {
      params.set("max", debouncedMaxPrice.toString());
    }

    // Cập nhật URL mà không reload trang
    // 'replace: true' giúp nút Back của trình duyệt hoạt động đúng
    navigate({ search: params.toString() }, { replace: true });
  }, [
    page,
    brand,
    debouncedSearch,
    debouncedMinPrice,
    debouncedMaxPrice,
    navigate,
  ]);

  // Lấy tên danh mục
  const { data: categoryInfo, isLoading: isCategoryLoading } =
    useGetCategoryById(categoryId);
  console.log(categoryInfo);
  const BACKEND_URL = "http://localhost:3000";

  // Lấy sản phẩm (Logic này không cần thay đổi)
  const {
    data: products = [],
    total,
    isLoading,
  } = useGetListProduct({
    page,
    limit: 8,
    search: debouncedSearch,
    brandId: brand,
    categoryId,
    minPrice: debouncedMinPrice,
    maxPrice: debouncedMaxPrice,
  });

  const totalPages = Math.ceil(total / 8);

  const filteredBrands = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      if (p.brand) {
        map.set(p.brand.id, p.brand);
      }
    });
    return Array.from(map.values());
  }, [products]);

  const handleBrandClick = (clickedBrandId) => {
    setBrand((prevBrand) =>
      prevBrand === clickedBrandId ? "" : clickedBrandId
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  // Preset giá
  const handlePricePreset = (min, max) => {
    setMinPriceInput(Number(min));
    setMaxPriceInput(max === "" ? 50000000 : Number(max));
  };

  // THAY ĐỔI: Chuyển 'useMemo' thành 'useEffect' để reset trang
  // Đây là logic cũ của bạn, chuyển sang useEffect cho đúng chuẩn
  useEffect(() => {
    // Khi filter thay đổi, nếu trang hiện tại không phải là 1, set về 1
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, brand, debouncedMinPrice, debouncedMaxPrice]);

  const pricePresets = [
    { label: "Dưới 1 triệu", min: 0, max: 1000000 },
    { label: "1 - 5 triệu", min: 1000000, max: 5000000 },
    { label: "5 - 10 triệu", min: 5000000, max: 10000000 },
    { label: "Trên 10 triệu", min: 10000000, max: 50000000 },
  ];

  // --- PHẦN JSX GIỮ NGUYÊN ---
  // (Không cần thay đổi gì ở phần return)
  return (
    <>
      <section className="pt-12 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">
            {isCategoryLoading
              ? "Đang tải..."
              : categoryInfo?.name || "Sản phẩm"}
          </h1>

          <div className="lg:grid grid-cols-5 gap-8">
            {/* --- Cột Filter --- */}
            <aside className="col-span-1 p-4 bg-gray-50 rounded-lg self-start">
              {/* Lọc thương hiệu */}

              {/* Tìm kiếm */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold">Tìm kiếm theo tên</h2>
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm..."
                  value={search} // Vẫn bind với state 'search'
                  onChange={(e) => setSearch(e.target.value)}
                  className="mt-4 w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* --- Lọc theo giá: DOUBLE RANGE SLIDER --- */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold">Lọc theo giá (VND)</h2>

                <div className="mt-4">
                  <div className="relative h-10">
                    {/* Track */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 rounded"></div>

                    {/* Đoạn chọn */}
                    <div
                      className="absolute top-1/2 h-1 bg-blue-500 rounded"
                      style={{
                        left: `${(minPriceInput / 50000000) * 100}%`,
                        right: `${100 - (maxPriceInput / 50000000) * 100}%`,
                      }}
                    ></div>

                    {/* Slider MIN */}
                    <input
                      type="range"
                      min="0"
                      max="50000000"
                      value={minPriceInput} // Vẫn bind với state 'minPriceInput'
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v < maxPriceInput) setMinPriceInput(v);
                      }}
                      className="absolute top-0 w-full pointer-events-none
                                  appearance-none bg-transparent
                                  [&::-webkit-slider-thumb]:pointer-events-auto
                                  [&::-webkit-slider-thumb]:appearance-none
                                  [&::-webkit-slider-thumb]:h-4
                                  [&::-webkit-slider-thumb]:w-4
                                  [&::-webkit-slider-thumb]:rounded-full
                                  [&::-webkit-slider-thumb]:bg-blue-600"
                    />

                    {/* Slider MAX */}
                    <input
                      type="range"
                      min="0"
                      max="50000000"
                      value={maxPriceInput} // Vẫn bind với state 'maxPriceInput'
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v > minPriceInput) setMaxPriceInput(v);
                      }}
                      className="absolute top-0 w-full pointer-events-none
                                  appearance-none bg-transparent
                                  [&::-webkit-slider-thumb]:pointer-events-auto
                                  [&::-webkit-slider-thumb]:appearance-none
                                  [&::-webkit-slider-thumb]:h-4
                                  [&::-webkit-slider-thumb]:w-4
                                  [&::-webkit-slider-thumb]:rounded-full
                                  [&::-webkit-slider-thumb]:bg-blue-600"
                    />
                  </div>

                  {/* Hiển thị giá */}
                  <div className="flex justify-between mt-2 text-sm font-medium">
                    <span>
                      {new Intl.NumberFormat("vi-VN").format(minPriceInput)} đ
                    </span>
                    <span>
                      {new Intl.NumberFormat("vi-VN").format(maxPriceInput)} đ
                    </span>
                  </div>
                </div>

                {/* Nút presets */}
                <div className="mt-3 space-y-2">
                  {pricePresets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handlePricePreset(preset.min, preset.max)}
                      className="w-full text-center text-sm px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* --- Cột sản phẩm --- */}
            <div className="col-span-4 mt-6 lg:mt-0">
              <div className="py-2 px-4 w-max mb-9">
                <ul className="mt-4 flex justify-center items-start space-x-6 ">
                  <li>
                    <button
                      onClick={() => setBrand("")}
                      className={`font-medium text-sm p-2 rounded hover:bg-gray-200 ${
                        brand === ""
                          ? "font-bold text-blue-600"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      Tất cả
                    </button>
                  </li>

                  {filteredBrands.map((br) => (
                    <li key={br.id}>
                      <button
                        onClick={() => handleBrandClick(br.id)}
                        className={`font-medium text-sm p-2 rounded hover:bg-gray-200 ${
                          brand === br.id ? "font-bold text-blue-600" : ""
                        }`}
                      >
                        {br.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Danh sách sản phẩm */}
              {isLoading ? (
                <LoadingComponent />
              ) : products.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                <div className="mt-10 text-center text-gray-500 col-span-4 py-20">
                  <p>Không tìm thấy sản phẩm phù hợp.</p>
                </div>
              )}

              {/* Phân trang */}
              {!isLoading && totalPages > 0 && (
                <div className="mt-10">
                  <ul className="flex items-center justify-center gap-2">
                    <li>
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="grid place-items-center size-10 rounded-full border border-gray-300 disabled:opacity-50"
                      >
                        <img className="size-4" src={ico_chevron_left} />
                      </button>
                    </li>

                    <li className="text-sm font-medium px-4">
                      Trang {page} / {totalPages}
                    </li>

                    <li>
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="grid place-items-center size-10 rounded-full border border-gray-300 disabled:opacity-50"
                      >
                        <img className="size-4" src={ico_chevron_right} />
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductPage;
