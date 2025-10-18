import React from "react";
import { SectionBanner } from "./SectionBanner";
import { SectionBestseller } from "./SectionBestseller";
import { SectionNewArrivals } from "./SectionNewArrivals";
export const Home = () => {
  return (
    <>
      <SectionBanner />
      <SectionNewArrivals />
      <SectionBestseller />
    </>
  );
};
