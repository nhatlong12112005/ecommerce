import React from "react";
import { BoxProduct } from "../../components/BoxProduct";
import pro1 from "../../assets/iphone-17-pro.png";
import pro2 from "../../assets/iphone-17-pro-black.png";

export const SectionBestseller = () => {
  const products = [
    {
      id: 1,
      name: "iPhone 17 Pro",
      price: "$999",
      imgDefault: pro1,
      imgHover: pro2,
      link: "/",
    },
    {
      id: 2,
      name: "iPhone 17 Pro Max",
      price: "$1099",
      imgDefault: pro1,
      imgHover: pro2,
      link: "/",
    },
    {
      id: 3,
      name: "iPhone 17",
      price: "$899",
      imgDefault: pro1,
      imgHover: pro2,
      link: "/",
    },
    {
      id: 4,
      name: "iPhone 17 Mini",
      price: "$799",
      imgDefault: pro1,
      imgHover: pro2,
      link: "/",
    },
  ];

  return (
    <section className="mt-9 lg:mt-24 pt-16 pb-8 bg-gray">
      <div className="container">
        <div className="lg:flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold">Bestseller</h2>
            <p className="mt-2 text-lightGray">
              Experience the best products at our store!
            </p>
          </div>
          <a
            href="#none"
            className="mt-6 lg:mt-0 h-9 border border-black px-7 inline-flex items-center font-semibold text-black rounded-full text-[15px] hover:bg-black hover:text-white transition-all duration-300"
          >
            View All
          </a>
        </div>

        <ul className="mt-8 lg:grid grid-cols-4 gap-7">
          <BoxProduct products={products} />
        </ul>
      </div>
    </section>
  );
};
