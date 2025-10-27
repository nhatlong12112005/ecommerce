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
          <li className="relative group">
            <span className="cursor-pointer flex items-center gap-1 relative after:absolute after:h-[1.5px] after:bg-black after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 group-hover:after:scale-x-100">
              Điện thoại
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4 transition-transform duration-300 group-hover:rotate-180"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            {/* Dropdown Menu - Đã sửa lỗi pointer-events-none */}
            <ul className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <li>
                <Link
                  to={"/iphone"} // Sửa link cho phù hợp
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Iphone
                </Link>
              </li>
              <li>
                <Link
                  to={"/samsung"} // Sửa link cho phù hợp
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Samsung
                </Link>
              </li>
            </ul>
          </li>
          <li className="relative after:absolute after:h-[1.5px] after:bg-black after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100">
            <Link to={"/laptop"}>Lap top</Link>
          </li>
          <li className="relative after:absolute after:h-[1.5px] after:bg-black after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100">
            <Link to={"/phu-kien"}>Phụ kiện</Link>
          </li>
        </ul>
      </nav>
      <div className=" flex items-center gap-6 ml-auto lg:ml-0 shrink-0 ">
        <a href="" className=" lg:hidden">
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
          {" "}
          {/* Sửa link cho phù hợp */}
          <span className=" absolute -top-[8px] -right-[10px] size-[18px] bg-black text-white rounded-full text-xs grid place-items-center ">
            5
          </span>
          <img className="size-5" src={ico_bag} alt="" />
        </Link>
      </div>
    </div>
  );
};
