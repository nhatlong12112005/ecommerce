import React from "react";
import { Link } from "react-router-dom";
// 1. CHỈ CẦN HOOK NÀY
import useGetListProduct from "../hooks/useGetListProduct";

export const BoxProduct = () => {
  // 2. Gọi hook với object rỗng {}
  // Giả định API của bạn tự động sắp xếp mới nhất lên đầu khi không có filter
  // 'data' ở đây LÀ MẢNG SẢN PHẨM (do hook của bạn trả về)
  const { data: products, isLoading } = useGetListProduct({
    limit: 8, // Có thể bạn muốn giới hạn 8 sản phẩm mới nhất
  });

  const BACKEND_URL = "http://localhost:3000";

  if (isLoading) {
    return <p>Đang tải sản phẩm...</p>;
  }

  // 3. Kiểm tra mảng `products`
  if (!products || products.length === 0) {
    return <p>Không có sản phẩm nào.</p>;
  }

  return (
    <>
      {/* 4. Map qua mảng `products` */}
      {products.map((product) => {
        // 5. ✅ SỬA LỖI ĐỌC JSON:
        // Đi từ product -> productColors[0] -> variants[0]
        const firstColor = product.productColors?.[0];
        const firstVariant = firstColor?.variants?.[0];

        // 6. ✅ Lấy imageUrl từ 'firstColor'
        const imageUrl = firstColor?.imageUrls?.[0];

        // 7. Nếu sản phẩm (vì lý do nào đó) không có variant thì bỏ qua
        if (!firstVariant) {
          return null;
        }

        // 8. Lấy thông tin
        const productName = product.name;
        const productLink = `/product/${product.id}`;
        const price = firstVariant.price; // Giá từ variant

        return (
          <li
            key={product.id} // Key là product.id
            className="text-center bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5"
          >
            <Link to={productLink}>
              <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
                <img
                  src={
                    imageUrl ? `${BACKEND_URL}${imageUrl}` : "/placeholder.jpg"
                  }
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {productName}
            </h3>
            <p className="text-red-600 text-xl font-bold mt-2">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(price)}
            </p>
          </li>
        );
      })}
    </>
  );
};
