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

// --- SỬA 1: Import hook feedback ---
import useGetListFeedBack from "../../../hooks/useGetListFeedBack";

// --- SỬA 2: Thêm các hàm/component helper ---

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
  const { access_token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:3000";

  // 1. Lấy dữ liệu GỐC (nested) từ hook
  const {
    data: rawProduct,
    isLoading: isDetailLoading,
    error: detailError,
  } = useGetDetailProduct(productId);

  // 2. "LÀM PHẲNG" (Flatten) DỮ LIỆU JSON
  // ... (giữ nguyên logic useMemo của bạn)
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
  // ... (giữ nguyên state)
  const [currentColor, setCurrentColor] = useState(null);
  const [currentStorage, setCurrentStorage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // --- Tính toán ---
  // ... (giữ nguyên useMemo)
  const availableOptions = useMemo(() => {
    if (!product || !product.variants) {
      return { colors: [], storages: [] };
    }
    const colors = [...new Set(product.variants.map((v) => v.color))];
    const storages = [...new Set(product.variants.map((v) => v.storage))];
    return { colors, storages };
  }, [product]);

  // --- Gán mặc định ---
  // ... (giữ nguyên useEffect)
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

  // --- Cập nhật variant ---
  // ... (giữ nguyên useEffect)
  useEffect(() => {
    if (product && product.variants) {
      const newVariant = product.variants.find(
        (v) => v.color === currentColor && v.storage === currentStorage
      );
      setSelectedVariant(newVariant || null);
      setQuantity(1);
    }
  }, [currentColor, currentStorage, product]);

  // --- LẤY SẢN PHẨM LIÊN QUAN ---
  // ... (giữ nguyên logic)
  const categoryId = product?.category?.id;
  const { data: relatedProductsData, isLoading: isRelatedLoading } =
    useGetListProduct({
      categoryId: categoryId,
      limit: 5,
    });

  // --- SỬA 3: GỌI HOOK LẤY FEEDBACK ---
  const { data: feedbacks, isLoading: isFeedbackLoading } =
    useGetListFeedBack(productId);

  // --- LỌC SẢN PHẨM LIÊN QUAN ---
  // ... (giữ nguyên logic)
  const relatedProducts =
    relatedProductsData?.filter((p) => p.id != rawProduct?.id) || [];

  // --- Các hàm helpers ---
  // ... (giữ nguyên logic)
  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  // --- Xử lý trạng thái tải & lỗi ---
  // ... (giữ nguyên logic)
  if (isDetailLoading) {
    return (
      <div className="container py-6 mx-auto px-4 text-center">
        <p>Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }
  if (detailError) {
    return (
      <div className="container py-6 mx-auto px-4 text-center">
        <p className="text-red-500">Đã xảy ra lỗi khi tải sản phẩm.</p>
        <Link
          to="/"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Quay về trang chủ
        </Link>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="container py-6 mx-auto px-4 text-center">
        <p>Không tìm thấy sản phẩm.</p>
        <Link
          to="/"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  // --- Các biến cho render ---
  // ... (giữ nguyên logic)
  const productCategoryName = product.category?.name || "Sản phẩm";
  const productCategorySlug = product.category?.slug || "products";
  const isVariantValid = selectedVariant && selectedVariant.stock > 0;
  const isOutOfStock = selectedVariant && selectedVariant.stock <= 0;
  const totalPrice = (selectedVariant?.price || 0) * quantity;

  // --- Các hàm xử lý giỏ hàng & mua ngay ---
  // ... (giữ nguyên logic)
  const addItemToCart = async () => {
    // 1. Kiểm tra đăng nhập
    if (!access_token) {
      toast.warn("Bạn phải đăng nhập để mua hàng!");
      navigate("/login");
      return null; // Thất bại
    }
    // 2. Kiểm tra biến thể
    if (!isVariantValid) {
      toast.error("Sản phẩm không hợp lệ hoặc đã hết hàng.");
      return null; // Thất bại
    }
    // 3. Gọi API
    try {
      const res = await addToCartApi(selectedVariant.id, quantity);
      dispatch(setCart(res.data)); // Cập nhật Redux
      return res.data; // Thành công - Trả về data giỏ hàng mới
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Thao tác thất bại. Vui lòng thử lại.");
      return null; // Thất bại
    }
  };

  const handleAddToCart = async () => {
    const newCartData = await addItemToCart(); // Cập nhật
    if (newCartData) {
      // Cập nhật
      toast.success("Đã thêm vào giỏ hàng!");
    }
  };

  const handleBuyNow = async () => {
    // 1. Gọi hàm để thêm item vào giỏ hàng
    const newCartData = await addItemToCart();
    // 2. Kiểm tra xem newCartData (giỏ hàng mới) có hợp lệ không
    if (newCartData && newCartData.items) {
      // 3. Tìm cartItem chúng ta vừa thêm vào
      const itemForCheckout = newCartData.items.find(
        (item) => item.productVariant?.id === selectedVariant.id
      );
      if (itemForCheckout) {
        // 4. ĐỒNG BỘ LOGIC: Dispatch item này vào 'selectedForOrder'
        dispatch(setSelectedForOrder([itemForCheckout]));
        // 5. Nếu thành công, chuyển hướng đến trang đặt hàng
        navigate("/order");
      } else {
        // Trường hợp hiếm gặp: đã thêm nhưng không tìm thấy
        toast.error("Không thể tìm thấy sản phẩm để mua. Vui lòng thử lại.");
        navigate("/cart"); // Chuyển về giỏ hàng
      }
    }
    // Nếu newCartData là null, hàm addItemToCart đã tự thông báo lỗi
  };

  // --- PHẦN RENDER ---
  return (
    <div className="container py-6 mx-auto px-4">
      {/* Breadcrumbs */}
      {/* ... (giữ nguyên) ... */}
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
        {/* --- Cột hình ảnh --- */}
        {/* ... (giữ nguyên) ... */}
        <div className="col-span-3 flex flex-col-reverse sm:flex-row gap-4">
          <ul className="flex sm:flex-col gap-4 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
            {(rawProduct.productColors || []).map((colorGroup) => {
              const colorImageUrl = colorGroup.imageUrls?.[0];
              return (
                <li
                  key={colorGroup.id}
                  className={`flex-shrink-0 w-[82px] h-[82px] cursor-pointer p-2 rounded-md border transition-all ${
                    currentColor === colorGroup.color
                      ? "border-black"
                      : "border-gray-200"
                  }`}
                  onClick={() => {
                    setCurrentColor(colorGroup.color);
                  }}
                >
                  <img
                    className="w-full h-full object-contain"
                    src={
                      colorImageUrl
                        ? `${BACKEND_URL}${colorImageUrl}`
                        : "/placeholder.jpg"
                    }
                    alt={colorGroup.color}
                  />
                </li>
              );
            })}
          </ul>
          <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 p-3">
            <img
              className="w-full h-[320px] lg:h-[400px] object-contain mx-auto"
              src={
                selectedVariant?.imageUrl
                  ? `${BACKEND_URL}${selectedVariant.imageUrl}`
                  : "/placeholder.jpg"
              }
              alt={product.name}
            />
          </div>
        </div>

        {/* --- Cột thông tin --- */}
        {/* ... (giữ nguyên) ... */}
        <div className="col-span-2 mt-6 lg:mt-0">
          <h2 className="text-xl lg:text-3xl font-bold">{product.name}</h2>
          <p className="mt-3 text-2xl font-semibold text-red-600">
            {formatPrice(totalPrice)}
          </p>

          {/* Màu sắc */}
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
                    className={`p-2 text-xs rounded-md border-2 ${
                      currentColor === color
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
                    className={`py-2 px-4 text-sm rounded-md border ${
                      currentStorage === storage
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
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 transition"
              >
                -
              </button>
              <span className="px-4 w-12 text-center">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Thông báo lỗi (nếu có) */}
          {!selectedVariant && (
            <p className="text-red-500 text-sm mt-4">
              Phiên bản này không tồn tại. Vui lòng chọn tổ hợp khác.
            </p>
          )}
          {isOutOfStock && (
            <p className="text-red-500 text-sm mt-4">
              Phiên bản này đã hết hàng.
            </p>
          )}

          {/* Nút hành động (ĐÃ CẬP NHẬT) */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!isVariantValid}
              className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!isVariantValid}
              className="border border-black py-3 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* --- Mô tả sản phẩm --- */}
      <div className="mt-16 border-t pt-8">
        <h3 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h3>
        <div
          className="text-gray-700 leading-relaxed whitespace-pre-line prose max-w-none"
          dangerouslySetInnerHTML={{
            __html:
              product.description ||
              "Hiện chưa có mô tả chi tiết cho sản phẩm này. Vui lòng quay lại sau.",
          }}
        />
      </div>

      {/* --- SỬA 4: HIỂN THỊ ĐÁNH GIÁ (FEEDBACK) --- */}
      <div className="mt-16 border-t pt-8">
        <h3 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h3>
        {isFeedbackLoading ? (
          <p className="text-center text-gray-500">Đang tải đánh giá...</p>
        ) : !feedbacks || feedbacks.length === 0 ? (
          <p className="text-center text-gray-500">
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="flex gap-4 border-b border-gray-200 pb-6"
              >
                {/* Avatar */}
                <img
                  src={
                    feedback.user?.avatar
                      ? `${BACKEND_URL}${feedback.user.avatar}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          feedback.user?.name || "User"
                        )}&background=random&color=fff`
                  }
                  alt={feedback.user?.name || "Avatar"}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0 mt-1"
                />
                {/* Nội dung feedback */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-900">
                      {feedback.user?.name || "Người dùng ẩn danh"}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDate(feedback.createdAt)}
                    </span>
                  </div>
                  <div className="my-1">
                    <StarRatingDisplay rating={feedback.rating} />
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-line">
                    {feedback.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- SẢN PHẨM LIÊN QUAN --- */}
      {/* ... (giữ nguyên) ... */}
      {!isRelatedLoading && (
        <div className="mt-16 border-t pt-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Sản phẩm liên quan
          </h3>
          {relatedProducts.length > 0 ? (
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => {
                const firstColor = relatedProduct.productColors?.[0];
                const firstVariant = firstColor?.variants?.[0];
                const imageUrl = firstColor?.imageUrls?.[0];

                if (!firstVariant) {
                  return null;
                }

                const productName = relatedProduct.name;
                const productLink = `/product/${relatedProduct.id}`;
                const price = firstVariant.price;

                return (
                  <li
                    key={relatedProduct.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <Link to={productLink} className="block">
                      <div className="relative w-full aspect-square overflow-hidden">
                        <img
                          src={
                            imageUrl
                              ? `${BACKEND_URL}${imageUrl}`
                              : "/placeholder.jpg"
                          }
                          alt={productName}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4 text-center ">
                        <h3 className="text-base font-semibold text-gray-900 h-10 overflow-hidden">
                          {productName}
                        </h3>
                        <p className="text-red-600 text-lg font-bold ">
                          {formatPrice(price)}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              Chưa có sản phẩm liên quan.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailProduct;
