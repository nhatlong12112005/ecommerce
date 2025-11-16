import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import ico_search from "../assets/ico_search.png";
import ico_user from "../assets/ico_user.png";
import ico_bag from "../assets/ico_bag.png";
import { useSelector, useDispatch } from "react-redux";
import ToogleAccountMenu from "./ToogleAccountMenu";
import useGetListCategory from "../hooks/useGetListCategory";
import { getCartApi } from "../services/cart";
import { setCart } from "../store/features/cart/cartSlice";

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Hook để lấy URL hiện tại

  const { access_token } = useSelector((state) => state.auth);
  const { data } = useGetListCategory();
  const { items: cartItems, isLoaded: isCartLoaded } = useSelector(
    (state) => state.cart
  );

  const urlParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  // 2. SỬA: LOGIC MỚI ĐỂ HIỂN THỊ/ẨN SEARCH TERM
  // -----------------------------------------------------------------
  useEffect(() => {
    // Kiểm tra xem trang hiện tại có phải là '/search' không
    if (location.pathname === "/search") {
      // Nếu ĐÚNG, set searchTerm bằng từ khóa 'q' trên URL
      const currentSearch = urlParams.get("q");
      setSearchTerm(currentSearch || "");
    } else {
      // Nếu KHÔNG (ở trang chủ, danh mục...), set searchTerm về rỗng
      setSearchTerm("");
    }

    // Effect này chạy mỗi khi đường dẫn (pathname) hoặc query (urlParams) thay đổi
  }, [location.pathname, urlParams]);
  // -----------------------------------------------------------------

  const [searchTerm, setSearchTerm] = useState("");

  // 3. Logic tải giỏ hàng (Giữ nguyên)
  useEffect(() => {
    const isLoggedIn = !!access_token;
    if (isLoggedIn && !isCartLoaded) {
      const fetchCart = async () => {
        try {
          const res = await getCartApi();
          dispatch(setCart(res.data));
        } catch (error) {
          console.error("Lỗi tải giỏ hàng:", error);
        }
      };
      fetchCart();
    }
  }, [access_token, isCartLoaded, dispatch]);

  const totalItemsInCart = cartItems.length;

  // 4. Logic Submit tìm kiếm (Giữ nguyên)
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="container flex items-center">
      {/* Logo */}
      <h1 className="flex-shrink-0 mr-5">
        <Link to="/" className="block max-w-[130px]">
          <img src={logo} alt="SmartPhone" className="max-w-full" />
        </Link>
      </h1>

      {/* Ô tìm kiếm */}
      <form
        onSubmit={handleSearch}
        className="relative ml-auto lg:mr-20 max-w-[500px] w-full hidden xl:block"
      >
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm} // 👈 Giá trị value giờ được kiểm soát 100% bởi logic mới
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="absolute inset-y-0 left-0 flex items-center pl-3"
        >
          <img className="size-5" src={ico_search} alt="Search" />
        </button>
      </form>

      {/* Menu chính (Giữ nguyên) */}
      <nav className="mr-28 hidden lg:block ml-auto">
        <ul className="flex items-center gap-10">
          <li className="relative hover:font-bold transition-all">
            <Link to={"/"}>Home</Link>
          </li>
          {(data || []).map((item) => (
            <li
              key={item.id}
              className="relative hover:font-bold transition-all"
            >
              <Link to={`/categories/${item.id}`}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Icon tài khoản + giỏ hàng (Giữ nguyên) */}
      <div className="flex items-center gap-6 ml-auto lg:ml-0 shrink-0">
        <button type="button" className="lg:hidden" onClick={handleSearch}>
          <img className="size-5" src={ico_search} alt="Search" />
        </button>

        {access_token ? (
          <ToogleAccountMenu />
        ) : (
          <Link to="/login">
            <img className="size-5" src={ico_user} alt="User" />
          </Link>
        )}

        <Link to="/cart" className="relative">
          {totalItemsInCart > 0 && (
            <span className="absolute -top-[8px] -right-[10px] size-[18px] bg-black text-white rounded-full text-xs grid place-items-center">
              {totalItemsInCart}
            </span>
          )}
          <img className="size-5" src={ico_bag} alt="Cart" />
        </Link>
      </div>
    </div>
  );
};
