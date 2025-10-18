import React from "react";
import { Link } from "react-router-dom";
import pro1 from "../assets/iphone-17-pro.png";
import pro2 from "../assets/iphone-17-pro-black.png";
export const BoxProduct = () => {
  return (
    <>
      <li className="mt-6 md:mt-0 text-center group">
        <Link
          to="/"
          className="block rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative w-full h-[350px]">
            {/* Ảnh mặc định */}
            <img
              src={pro1}
              alt="iPhone 17 Pro - Cam"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0"
            />
            {/* Ảnh khi hover */}
            <img
              src={pro2}
              alt="iPhone 17 Pro - Xanh"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            />
          </div>
        </Link>
        <div className="mt-3">
          <h3 className="text-xl font-medium text-gray-800">iPhone 17 Pro</h3>
          <span className="text-red-500 font-semibold text-lg">$999</span>
        </div>
      </li>
      <li className="mt-6 md:mt-0 text-center group">
        <Link
          to="/"
          className="block rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative w-full h-[350px]">
            {/* Ảnh mặc định */}
            <img
              src={pro1}
              alt="iPhone 17 Pro - Cam"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0"
            />
            {/* Ảnh khi hover */}
            <img
              src={pro2}
              alt="iPhone 17 Pro - Xanh"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            />
          </div>
        </Link>
        <div className="mt-3">
          <h3 className="text-xl font-medium text-gray-800">iPhone 17 Pro</h3>
          <span className="text-red-500 font-semibold text-lg">$999</span>
        </div>
      </li>
      <li className="mt-6 md:mt-0 text-center group">
        <Link
          to="/"
          className="block rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative w-full h-[350px]">
            {/* Ảnh mặc định */}
            <img
              src={pro1}
              alt="iPhone 17 Pro - Cam"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0"
            />
            {/* Ảnh khi hover */}
            <img
              src={pro2}
              alt="iPhone 17 Pro - Xanh"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            />
          </div>
        </Link>
        <div className="mt-3">
          <h3 className="text-xl font-medium text-gray-800">iPhone 17 Pro</h3>
          <span className="text-red-500 font-semibold text-lg">$999</span>
        </div>
      </li>
      <li className="mt-6 md:mt-0 text-center group">
        <Link
          to="/"
          className="block rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative w-full h-[350px]">
            {/* Ảnh mặc định */}
            <img
              src={pro1}
              alt="iPhone 17 Pro - Cam"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0"
            />
            {/* Ảnh khi hover */}
            <img
              src={pro2}
              alt="iPhone 17 Pro - Xanh"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            />
          </div>
        </Link>
        <div className="mt-3">
          <h3 className="text-xl font-medium text-gray-800">iPhone 17 Pro</h3>
          <span className="text-red-500 font-semibold text-lg">$999</span>
        </div>
      </li>
    </>
  );
};
