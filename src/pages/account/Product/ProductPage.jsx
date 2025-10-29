// src/pages/ProductPage.js

import React, { useState, useMemo, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { database } from "../../../constant/api"; // Import cấu trúc dữ liệu

// Import assets (đảm bảo đường dẫn đúng)
import ico_chevron_right from "../../../assets/ico_chevron_right.png";
import ico_chevron_left from "../../../assets/ico_chevron_left.png";

const PRODUCTS_PER_PAGE = 8;

const ProductPage = () => {
  const { categoryId } = useParams();

  const categoryData = database[categoryId];

  const [selectedBrand, setSelectedBrand] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("1"); // 1: low-high, 2: high-low
  const [currentPage, setCurrentPage] = useState(1);

  // Reset bộ lọc và quay về trang 1 mỗi khi người dùng chuyển category
  useEffect(() => {
    setSelectedBrand("All");
    setSearchTerm("");
    setSortOrder("1");
    setCurrentPage(1);
  }, [categoryId]);

  // Logic lọc và sắp xếp sản phẩm, chỉ tính toán lại khi cần thiết
  const filteredAndSortedProducts = useMemo(() => {
    if (!categoryData) return []; // Trả về mảng rỗng nếu không có dữ liệu

    let products = [...categoryData.products];
    if (selectedBrand !== "All") {
      products = products.filter((product) => product.brand === selectedBrand);
    }
    if (searchTerm) {
      products = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    products.sort((a, b) =>
      sortOrder === "1" ? a.price - b.price : b.price - a.price
    );
    return products;
  }, [selectedBrand, searchTerm, sortOrder, categoryData]);

  // Nếu URL không hợp lệ (không có category trong database), chuyển hướng về trang chủ
  if (!categoryData) {
    return <Navigate to="/" replace />;
  }

  // Logic phân trang
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / PRODUCTS_PER_PAGE
  );
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu trang
  };

  const handleAddToCart = (e, productName) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Đã thêm "${productName}" vào giỏ hàng!`);
  };

  const { categoryName, filters } = categoryData;
  const brands = filters.brands;

  return (
    <section className="pt-12 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>
        <div className="lg:grid grid-cols-5 gap-8">
          {/* --- Cột Filter --- */}
          <aside className="col-span-1 p-4 bg-gray-50 rounded-lg self-start">
            <div>
              <h2 className="text-lg font-semibold">Lọc theo thương hiệu</h2>
              <ul className="mt-4 space-y-3">
                {brands.map((brand) => (
                  <li key={brand}>
                    <button
                      onClick={() => setSelectedBrand(brand)}
                      className={`font-medium text-sm transition-all text-left w-full p-1 rounded ${
                        selectedBrand === brand
                          ? "text-blue-600 font-bold bg-blue-100"
                          : "text-black hover:text-gray-600"
                      }`}
                    >
                      {brand}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Tìm kiếm theo tên</h2>
              <input
                type="text"
                placeholder="Nhập tên sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-4 w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </aside>

          {/* --- Cột sản phẩm --- */}
          <div className="col-span-4 mt-6 lg:mt-0">
            <div className="py-2 px-4 border rounded-full cursor-pointer w-max mb-9">
              <select
                name="sort"
                id="sort"
                className="w-full text-sm bg-transparent focus:outline-none"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="1">Giá: Thấp đến cao</option>
                <option value="2">Giá: Cao đến thấp</option>
              </select>
            </div>

            {/* --- Danh sách sản phẩm --- */}
            {currentProducts.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {currentProducts.map((product) => (
                  <li
                    key={product.id}
                    className="text-center group flex flex-col justify-between"
                  >
                    <div>
                      <Link
                        to={`/product-detail/${product.id}`}
                        className="block"
                      >
                        <div className="rounded-lg overflow-hidden bg-gray-100 h-[280px] lg:h-[300px] relative">
                          <img
                            className="block size-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                            src={product.image}
                            alt={product.name}
                          />
                        </div>
                        <h3 className="text-sm font-semibold mt-3 text-gray-800 h-10 px-2">
                          {product.name}
                        </h3>
                        <div className="mt-2 flex items-center justify-center font-bold text-base text-red-600 mb-2">
                          <span>
                            {product.price.toLocaleString("vi-VN")} VND
                          </span>
                        </div>
                      </Link>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product.name)}
                      className="uppercase text-xs font-medium tracking-tighter text-center bg-gray-200 hover:bg-black p-2 rounded-full hover:text-white transition-all duration-300 w-4/5 mx-auto mt-2"
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-10 text-center text-gray-500">
                <p>Không tìm thấy sản phẩm phù hợp.</p>
              </div>
            )}

            {/* --- Phân trang: Luôn hiển thị nếu có sản phẩm --- */}
            {totalPages > 0 && (
              <div className="mt-10">
                <ul className="flex items-center justify-center gap-2">
                  <li>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="grid place-items-center size-10 rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <img
                        className="size-4"
                        src={ico_chevron_left}
                        alt="Previous Page"
                      />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <li key={page}>
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`grid place-items-center size-10 rounded-full border border-gray-300 transition-colors ${
                            currentPage === page
                              ? "bg-black text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      </li>
                    )
                  )}
                  <li>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="grid place-items-center size-10 rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <img
                        className="size-4"
                        src={ico_chevron_right}
                        alt="Next Page"
                      />
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
