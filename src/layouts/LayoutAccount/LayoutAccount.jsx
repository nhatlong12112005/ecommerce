import React from "react";
import { Navbar } from "../../components/Navbar";

export const LayoutAccount = ({ children }) => {
  return (
    <div className="wrap">
      <header className=" py-5 lg:py-20 sticky top-0 z-10 bg-white shadow-lg ">
        <Navbar />
      </header>
      <main>{children}</main>
      <footer className="bg-gray-100 py-12">
        <div className="container">
          <div className="mt-12">
            <p className="text-sm text-gray-600 text-center">
              © 2025 PhoneShop. Bản quyền thuộc về Công ty TNHH Điện Thoại
              DCT123C1
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
