// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import ico_search from "../assets/ico_search.png";
import ico_user from "../assets/ico_user.png";
import ico_bag from "../assets/ico_bag.png";
import { useSelector } from "react-redux";
import ToogleAccountMenu from "./ToogleAccountMenu";

export const Navbar = () => {
  const { USER } = useSelector((state) => state.auth);
  return (
    <div className="container flex items-center">
      <h1 className="flex-shrink-0 mr-5">
        <Link to="/" className="block max-w-[130px]">
          <img src={logo} alt="SmartPhone" className=" max-w-full" />
        </Link>
      </h1>
      <div className=" relative ml-auto lg:mr-20 max-w-[500px] w-full hidden xl:block ">
        <input
          type="text"
          placeholder="Search..."
          className=" w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 "
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span>
            <img className="size-5" src={ico_search} alt="" />
          </span>
        </div>
      </div>
      <nav className=" mr-28 hidden lg:block ml-auto ">
        <ul className=" flex items-center gap-10 ">
          <li className="relative after:absolute after:h-[1.5px] after:bg-black after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100">
            <Link to={"/"}>Home</Link>
          </li>

          {/* ✅ SỬA ĐỔI: Bỏ dropdown, biến thành Link trực tiếp */}
          <li className="relative after:absolute after:h-[1.5px] after:bg-black after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100">
            <Link to={"/products/phones"}>Điện thoại</Link>
          </li>

          <li className="relative after:absolute after:h-[1.5px] after:bg-black after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100">
            <Link to={"/products/laptops"}>Laptop</Link> {/* Sửa lại chữ */}
          </li>
        </ul>
      </nav>
      <div className=" flex items-center gap-6 ml-auto lg:ml-0 shrink-0 ">
        <a href="#" className=" lg:hidden">
          {" "}
          {/* Dùng # hoặc bỏ href nếu không cần link */}
          <img className="size-5" src={ico_search} alt="" />
        </a>
        {USER ? (
          <ToogleAccountMenu />
        ) : (
          <Link to="/login">
            <img className=" size-5 " src={ico_user} alt="" />
          </Link>
        )}
        <Link to="/cart" className=" relative ">
          <span className=" absolute -top-[8px] -right-[10px] size-[18px] bg-black text-white rounded-full text-xs grid place-items-center ">
            5 {/* Số lượng sản phẩm trong giỏ */}
          </span>
          <img className="size-5" src={ico_bag} alt="" />
        </Link>
      </div>
    </div>
  );
};
