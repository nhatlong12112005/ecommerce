import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useGetDetailProduct from "../../../hooks/useGetDetailProduct";
import useGetListProduct from "../../../hooks/useGetListProduct";
import { useDispatch, useSelector } from "react-redux";
import { addToCartApi } from "../../../services/cart";
import {
  setCart,
  setSelectedForOrder,
} from "../../../store/features/cart/cartSlice";
import { toast } from "react-toastify";

import useGetListFeedBack from "../../../hooks/useGetListFeedBack";

// Helper để hiển thị ngày tháng
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// Helper để hiển thị sao
const StarRatingDisplay = ({ rating }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-4 h-4 ${
          star <= rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.959a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.364 1.118l1.287 3.959c.3.921-.755 1.688-1.54 1.118l-3.368-2.446a1 1 0 00-1.175 0l-3.368 2.446c-.784.57-1.838-.197-1.54-1.118l1.287-3.959a1 1 0 00-.364-1.118L2.062 9.386c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
      </svg>
    ))}
  </div>
);

// --- Component chính ---
const DetailProduct = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const { access_token, user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:3000";

  // 1. Lấy dữ liệu GỐC
  const {
    data: rawProduct,
    isLoading: isDetailLoading,
    error: detailError,
  } = useGetDetailProduct(productId);

  // 2. Làm phẳng dữ liệu (cho logic chọn variant)
  const product = useMemo(() => {
    if (!rawProduct) return null;
    const flatVariants = [];
    (rawProduct.productColors || []).forEach((color) => {
      const imageUrl = color.imageUrls?.[0] || null;
      (color.variants || []).forEach((variant) => {
        flatVariants.push({
          ...variant,
          color: color.color,
          productColorId: color.id,
          imageUrl: imageUrl,
        });
      });
    });
    return {
      ...rawProduct,
      variants: flatVariants,
    };
  }, [rawProduct]);

  // --- Quản lý State ---
  const [currentColor, setCurrentColor] = useState(null);
  const [currentStorage, setCurrentStorage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // State MỚI: Ảnh đang được chọn để hiển thị to
  const [activeImage, setActiveImage] = useState(null);

  // --- Tính toán Options ---
  const availableOptions = useMemo(() => {
    if (!product || !product.variants) {
      return { colors: [], storages: [] };
    }
    const colors = [...new Set(product.variants.map((v) => v.color))];
    const storages = [...new Set(product.variants.map((v) => v.storage))];
    return { colors, storages };
  }, [product]);

  // --- Gán mặc định khi mới vào ---
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedVariant(firstVariant);
      setCurrentColor(firstVariant.color);
      setCurrentStorage(firstVariant.storage);
    } else {
      setSelectedVariant(null);
      setCurrentColor(null);
      setCurrentStorage(null);
    }
  }, [product]);

  // --- Cập nhật variant khi người dùng chọn màu/dung lượng ---
  useEffect(() => {
    if (product && product.variants) {
      const newVariant = product.variants.find(
        (v) => v.color === currentColor && v.storage === currentStorage
      );
      setSelectedVariant(newVariant || null);
      setQuantity(1);
    }
  }, [currentColor, currentStorage, product]);

  // --- LOGIC MỚI: Cập nhật danh sách ảnh khi đổi Màu ---
  // Tìm nhóm màu hiện tại trong rawProduct để lấy danh sách imageUrls đầy đủ
  const currentColorGroup = useMemo(() => {
    if (!rawProduct || !currentColor) return null;
    return rawProduct.productColors.find((c) => c.color === currentColor);
  }, [rawProduct, currentColor]);

  // Khi nhóm màu đổi, set ảnh active là ảnh đầu tiên của nhóm đó
  useEffect(() => {
    if (currentColorGroup && currentColorGroup.imageUrls?.length > 0) {
      setActiveImage(currentColorGroup.imageUrls[0]);
    } else {
      setActiveImage(null);
    }
  }, [currentColorGroup]);

  // --- LẤY DATA KHÁC ---
  const categoryId = product?.category?.id;
  const { data: relatedProductsData, isLoading: isRelatedLoading } =
    useGetListProduct({
      categoryId: categoryId,
      limit: 5,
    });

  const { data: feedbacks, isLoading: isFeedbackLoading } =
    useGetListFeedBack(productId);

  const relatedProducts =
    relatedProductsData?.filter((p) => p.id != rawProduct?.id) || [];

  // --- Helpers ---
  const handleIncrease = () => {
    if (selectedVariant && quantity >= selectedVariant.stock) {
      toast.warning(`Chỉ còn ${selectedVariant.stock} sản phẩm trong kho!`);
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  // --- Check Loading/Error ---
  if (isDetailLoading)
    return <div className="container py-6 text-center">Đang tải...</div>;
  if (detailError)
    return (
      <div className="container py-6 text-center text-red-500">
        Lỗi tải sản phẩm
      </div>
    );
  if (!product)
    return (
      <div className="container py-6 text-center">Không tìm thấy sản phẩm</div>
    );

  // --- Render Vars ---
  const productCategoryName = product.category?.name || "Sản phẩm";
  const productCategorySlug = product.category?.slug || "products";
  const isVariantValid = selectedVariant && selectedVariant.stock > 0;
  const isOutOfStock = selectedVariant && selectedVariant.stock <= 0;
  const totalPrice = (selectedVariant?.price || 0) * quantity;

  // --- Cart Actions ---
  const addItemToCart = async () => {
    if (!access_token) {
      toast.warn("Bạn phải đăng nhập để mua hàng!");
      navigate("/login");
      return null;
    }
    if (!isVariantValid) {
      toast.error("Sản phẩm không hợp lệ hoặc đã hết hàng.");
      return null;
    }
    if (quantity > selectedVariant.stock) {
      toast.error(`Chỉ còn ${selectedVariant.stock} sản phẩm trong kho!`);
      return null;
    }

    try {
      const res = await addToCartApi(selectedVariant.id, quantity);
      dispatch(setCart(res.data));
      return res.data;
    } catch (error) {
      console.error("Lỗi giỏ hàng:", error);
      toast.error("Thao tác thất bại.");
      return null;
    }
  };

  const handleAddToCart = async () => {
    if (user?.isActive === 0) {
      toast.error("Tài khoản của bạn đã bị khóa.");
      return;
    }
    const newCartData = await addItemToCart();
    if (newCartData) toast.success("Đã thêm vào giỏ hàng!");
  };

  const handleBuyNow = async () => {
    if (user?.isActive === 0) {
      toast.error("Tài khoản của bạn đã bị khóa.");
      return;
    }
    const newCartData = await addItemToCart();
    if (newCartData && newCartData.items) {
      const itemForCheckout = newCartData.items.find(
        (item) => item.productVariant?.id === selectedVariant.id
      );
      if (itemForCheckout) {
        dispatch(setSelectedForOrder([itemForCheckout]));
        navigate("/order");
      } else {
        toast.error("Lỗi xử lý mua ngay.");
        navigate("/cart");
      }
    }
  };

  return (
    <div className="container py-6 mx-auto px-4">
      {/* Breadcrumbs */}
      <ul className="flex flex-wrap gap-2 items-center text-sm text-gray-500">
        <li>
          <Link to="/" className="hover:text-black">
            Trang chủ
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link
            to={`/products/${productCategorySlug}`}
            className="hover:text-black"
          >
            {productCategoryName}
          </Link>
        </li>
        <li>/</li>
        <li className="font-medium text-black">{product.name}</li>
      </ul>

      {/* --- Chi tiết sản phẩm --- */}
      <div className="lg:grid grid-cols-5 gap-10 mt-8">
        {/* --- CỘT HÌNH ẢNH (ĐÃ CẬP NHẬT) --- */}
        <div className="col-span-3 flex flex-col-reverse sm:flex-row gap-4">
          {/* Danh sách Thumbnails (Gallery của màu hiện tại) */}
          <ul className="flex sm:flex-col gap-4 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 sm:h-[400px] sm:overflow-y-auto scrollbar-hide">
            {currentColorGroup &&
            currentColorGroup.imageUrls &&
            currentColorGroup.imageUrls.length > 0 ? (
              currentColorGroup.imageUrls.map((imgUrl, index) => (
                <li
                  key={index}
                  className={`flex-shrink-0 w-[82px] h-[82px] cursor-pointer p-1 rounded-md border transition-all ${
                    activeImage === imgUrl
                      ? "border-blue-500 ring-1 ring-blue-500"
                      : "border-gray-200"
                  }`}
                  onClick={() => setActiveImage(imgUrl)}
                >
                  <img
                    className="w-full h-full object-contain rounded-md"
                    src={`${BACKEND_URL}${imgUrl}`}
                    alt={`Thumbnail ${index}`}
                  />
                </li>
              ))
            ) : (
              // Fallback nếu không có ảnh nào
              <li className="w-[82px] h-[82px] border border-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400">
                No Image
              </li>
            )}
          </ul>

          {/* Ảnh lớn (Main Image) */}
          <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 p-3 relative bg-white">
            <img
              className="w-full h-[320px] lg:h-[400px] object-contain mx-auto transition-all duration-300"
              src={
                activeImage
                  ? `${BACKEND_URL}${activeImage}`
                  : "/placeholder.jpg"
              }
              alt={product.name}
            />
          </div>
        </div>

        {/* --- CỘT THÔNG TIN --- */}
        <div className="col-span-2 mt-6 lg:mt-0">
          <h2 className="text-xl lg:text-3xl font-bold">{product.name}</h2>
          <p className="mt-3 text-2xl font-semibold text-red-600">
            {formatPrice(totalPrice)}
          </p>

          {/* Chọn Màu sắc */}
          {availableOptions.colors.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">
                Màu sắc: <span className="font-bold">{currentColor}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {availableOptions.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setCurrentColor(color)}
                    className={`px-4 py-2 text-sm rounded-md border transition-all ${
                      currentColor === color
                        ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chọn Dung lượng */}
          {availableOptions.storages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">
                Dung lượng: <span className="font-bold">{currentStorage}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {availableOptions.storages.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => setCurrentStorage(storage)}
                    className={`py-2 px-4 text-sm rounded-md border transition-all ${
                      currentStorage === storage
                        ? "bg-black text-white border-black"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chọn Số lượng */}
          <div className="mt-8 flex items-center gap-4">
            <h3 className="text-sm font-medium">Số lượng:</h3>
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={handleDecrease}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
              >
                -
              </button>
              <span className="px-4 w-12 text-center font-medium">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {selectedVariant ? `(Còn ${selectedVariant.stock} sản phẩm)` : ""}
            </span>
          </div>

          {/* Thông báo lỗi variant */}
          {!selectedVariant && (
            <p className="text-red-500 text-sm mt-4 bg-red-50 p-2 rounded">
              ⚠️ Phiên bản màu {currentColor} - {currentStorage} hiện không khả
              dụng.
            </p>
          )}
          {isOutOfStock && (
            <p className="text-red-500 text-sm mt-4 bg-red-50 p-2 rounded">
              ⚠️ Phiên bản này đã hết hàng.
            </p>
          )}

          {/* Nút Mua hàng */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!isVariantValid}
              className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!isVariantValid}
              className="border-2 border-black py-3 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* --- Mô tả --- */}
      <div className="mt-16 border-t pt-8">
        <h3 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h3>
        <div
          className="text-gray-700 leading-relaxed whitespace-pre-line prose max-w-none bg-gray-50 p-6 rounded-xl"
          dangerouslySetInnerHTML={{
            __html: product.description || "Đang cập nhật mô tả...",
          }}
        />
      </div>

      {/* --- Đánh giá --- */}
      <div className="mt-16 border-t pt-8">
        <h3 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h3>
        {isFeedbackLoading ? (
          <p className="text-center text-gray-500">Đang tải đánh giá...</p>
        ) : !feedbacks || feedbacks.length === 0 ? (
          <p className="text-center text-gray-500 bg-gray-50 p-4 rounded-lg">
            Chưa có đánh giá nào.
          </p>
        ) : (
          <div className="space-y-6 max-w-4xl">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="flex gap-4 border-b border-gray-100 pb-6 last:border-0"
              >
                <img
                  src={
                    feedback.user?.avatar
                      ? `${BACKEND_URL}${feedback.user.avatar}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          feedback.user?.name || "User"
                        )}&background=random&color=fff`
                  }
                  alt={feedback.user?.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow-sm"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {feedback.user?.name || "Ẩn danh"}
                    </h4>
                    <span className="text-xs text-gray-400">
                      {formatDate(feedback.createdAt)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <StarRatingDisplay rating={feedback.rating} />
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg inline-block min-w-[50%]">
                    {feedback.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Sản phẩm liên quan --- */}
      {!isRelatedLoading && relatedProducts.length > 0 && (
        <div className="mt-16 border-t pt-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Sản phẩm liên quan
          </h3>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((relatedProduct) => {
              const firstColor = relatedProduct.productColors?.[0];
              const firstVariant = firstColor?.variants?.[0];
              const imageUrl = firstColor?.imageUrls?.[0];
              if (!firstVariant) return null;

              return (
                <li
                  key={relatedProduct.id}
                  className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <Link
                    to={`/product/${relatedProduct.id}`}
                    className="block h-full flex flex-col"
                  >
                    <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={
                          imageUrl
                            ? `${BACKEND_URL}${imageUrl}`
                            : "/placeholder.jpg"
                        }
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 mix-blend-multiply"
                      />
                    </div>
                    <div className="p-4 text-center flex-1 flex flex-col justify-between">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-red-600 font-bold text-lg">
                        {formatPrice(firstVariant.price)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DetailProduct;
