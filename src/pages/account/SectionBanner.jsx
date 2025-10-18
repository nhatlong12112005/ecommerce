import React from "react";
import banner from "../../assets/banner.png";
export const SectionBanner = () => {
  return (
    <section className=" w-full overflow-hidden">
      <img
        className="animate-zoomIn w-full h-auto object-cover"
        src={banner}
        alt=""
      />
    </section>
  );
};
