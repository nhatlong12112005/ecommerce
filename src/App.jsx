import "./App.css";
import { Route, Routes } from "react-router-dom";
import { LayoutAccount } from "./layouts/LayoutAccount/LayoutAccount";
import { Home } from "./pages/account/Home";
import { Login } from "./pages/login/Login";
import { Register } from "./pages/register/Register";
import LayoutAdmin from "./layouts/LayoutAdmin/LayoutAdmin";
import { ToastContainer } from "react-toastify";
import AdminRoute from "./routers/AdminRoutes";
import Dashboard from "./pages/admin/Dashboard";
import { CategoryManagement } from "./pages/admin/Category/CategoryManagement";
import { ProductManagement } from "./pages/admin/ProductManagement/ProductManagement";
import CreateProduct from "./pages/admin/ProductManagement/AddProduct";
import OrderManagement from "./pages/admin/OrderManagement/OrderMangement";
import DetailOrder from "./pages/admin/OrderManagement/DetailOrder";

function App() {
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route
          path=""
          element={
            <LayoutAccount>
              <Home />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <LayoutAccount>
              <Login />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/register"
          element={
            <LayoutAccount>
              <Register />
            </LayoutAccount>
          }
        ></Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<LayoutAdmin />}>
            {/* Dashboard */}
            <Route index element={<Dashboard />} />

            {/* Category */}
            <Route
              path="Category-Management"
              element={<CategoryManagement />}
            />

            {/* Product */}
            <Route path="product" element={<ProductManagement />} />
            <Route path="product/add" element={<CreateProduct />} />
            <Route path="product/edit/:id" element={<CreateProduct />} />

            {/* Order */}
            <Route path="order" element={<OrderManagement />} />
            <Route path="/admin/order/:id" element={<DetailOrder />} />

            {/* Customer */}
            <Route
              path="customer"
              element={<div>Trang Quản Lý Khách Hàng</div>}
            />

            {/* Payment */}
            <Route
              path="payment"
              element={<div>Trang Quản Lý Thanh Toán</div>}
            />

            {/* Shipping */}
            <Route
              path="shipping"
              element={<div>Trang Quản Lý Giao Hàng</div>}
            />

            {/* Settings */}
            <Route
              path="settings"
              element={<div>Trang Cài Đặt Hệ Thống</div>}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
