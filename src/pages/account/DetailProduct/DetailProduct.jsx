import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { database } from "../../../constant/api";

const DetailProduct = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let foundProduct = null;
    let allProducts = [];

    for (const categoryKey in database) {
      const category = database[categoryKey];
      allProducts.push(...category.products);

      const product = category.products.find((p) => p.id === productId);
      if (product) {
        foundProduct = product;
        break;
      }
    }

    if (foundProduct) {
      const images = foundProduct.images || [foundProduct.image];
      const options = foundProduct.options || {
        colors: ["Default"],
        storage: ["N/A"],
      };

      setProduct({ ...foundProduct, images, options });
      setActiveImage(images[0]);
      setSelectedColor(options.colors[0]);
      setSelectedStorage(options.storage[0]);

      const related = allProducts
        .filter(
          (p) =>
            p.brand === foundProduct.brand &&
            p.id !== foundProduct.id &&
            p.images
        )
        .slice(0, 4);

      setRelatedProducts(related);
    } else {
      setProduct(null);
    }
  }, [productId]);

  // ===== Xử lý số lượng =====
  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (!product) {
    return (
      <div className="container text-center py-20 mx-auto px-4">
        <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm.</h1>
        <p className="text-gray-600 mt-2">
          Vui lòng đảm bảo ID sản phẩm ({productId}) là hợp lệ.
        </p>
        <Link
          to="/"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Quay về Trang Chủ
        </Link>
      </div>
    );
  }

  const productCategory = product.category || "Unknown";

  return (
    <div className="container py-6 mx-auto px-4">
      {/* Breadcrumbs */}
      <ul className="flex gap-2 items-center text-sm text-gray-500">
        <li>
          <Link to="/" className="hover:text-black">
            Trang chủ
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link
            to={`/products/${productCategory.toLowerCase()}`}
            className="hover:text-black"
          >
            {productCategory}
          </Link>
        </li>
        <li>/</li>
        <li className="font-medium text-black">{product.name}</li>
      </ul>

      {/* --- Chi tiết sản phẩm --- */}
      <div className="lg:grid grid-cols-5 gap-10 mt-8">
        {/* --- Cột hình ảnh --- */}
        <div className="col-span-3 flex gap-4">
          <ul className="flex flex-col gap-4">
            {product.images.map((img, index) => (
              <li
                key={index}
                className={`w-[82px] h-[82px] cursor-pointer p-2 rounded-md border transition-all ${
                  activeImage === img ? "border-black" : "border-gray-200"
                }`}
                onClick={() => setActiveImage(img)}
              >
                <img
                  className="w-full h-full object-contain"
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                />
              </li>
            ))}
          </ul>
          <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 p-3">
            <img
              className="w-full h-[320px] object-contain mx-auto"
              src={activeImage}
              alt={product.name}
            />
          </div>
        </div>

        {/* --- Cột thông tin --- */}
        <div className="col-span-2 mt-6 lg:mt-0">
          <h2 className="text-xl lg:text-3xl font-bold">{product.name}</h2>
          <p className="mt-3 text-2xl font-semibold text-red-600">
            {product.price.toLocaleString("vi-VN")} VND
          </p>

          {/* Màu sắc */}
          {product.options.colors.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">
                Màu sắc: <span className="font-bold">{selectedColor}</span>
              </h3>
              <div className="flex gap-3">
                {product.options.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`p-2 text-xs rounded-md border-2 ${
                      selectedColor === color
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dung lượng */}
          {product.options.storage.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">
                Dung lượng: <span className="font-bold">{selectedStorage}</span>
              </h3>
              <div className="flex gap-3">
                {product.options.storage.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    className={`py-2 px-4 text-sm rounded-md border ${
                      selectedStorage === storage
                        ? "bg-black text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Số lượng */}
          <div className="mt-8 flex items-center gap-4">
            <h3 className="text-sm font-medium">Số lượng:</h3>
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={handleDecrease}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="mt-8 flex flex-col gap-3">
            <button className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
              Thêm vào giỏ hàng
            </button>
            <button className="border border-black py-3 rounded-lg hover:bg-gray-100 transition">
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* --- Mô tả sản phẩm --- */}
      <div className="mt-16 border-t pt-8">
        <h3 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {product.description ||
            "Hiện chưa có mô tả chi tiết cho sản phẩm này. Vui lòng quay lại sau."}
        </p>
      </div>

      {/* --- Sản phẩm liên quan --- */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t pt-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Sản phẩm liên quan
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <div
                key={related.id}
                className="text-center group border rounded-lg p-4 hover:shadow-xl transition-shadow"
              >
                <Link to={`/product-detail/${related.id}`} className="block">
                  <div className="h-48 flex items-center justify-center">
                    <img
                      src={related.images[0]}
                      alt={related.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="mt-4 font-semibold text-sm h-10">
                    {related.name}
                  </h4>
                  <p className="mt-2 font-bold text-red-600">
                    {related.price.toLocaleString("vi-VN")} VND
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailProduct;
