import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { USER } = useSelector((state) => state.auth);
  const isAdmin = USER?.role === "ADMIN";
  return USER && isAdmin ? <Outlet /> : <Navigate to="/" />;
};
export default AdminRoute;
