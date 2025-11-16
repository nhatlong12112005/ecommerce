import React from "react";
import { BoxProduct } from "../../components/BoxProduct";

export const SectionNewArrivals = () => {
  return (
    <section className="mt-9 lg:mt-24 pt-16 pb-8 bg-gray  ">
      <div className=" container ">
        <div className=" lg:flex justify-between items-end ">
          <div>
            <h2 className=" text-3xl font-bold ">Sản phẩm mới</h2>
            <p className=" mt-2 text-lightGray ">
              Đây là những sản phẩm tốt nhất của cửa hàng!
            </p>
          </div>
        </div>
        <ul className=" mt-8 lg:grid grid-cols-4 gap-7 ">
          <BoxProduct />
        </ul>
      </div>
    </section>
  );
};
