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
import CategoryManagement from "./pages/admin/Category/CategoryManagement";
import ProductManagement from "./pages/admin/ProductManagement/ProductManagement";

import OrderManagement from "./pages/admin/OrderManagement/OrderMangement";
import DetailOrder from "./pages/admin/OrderManagement/DetailOrder";
import CustomerManagement from "./pages/admin/CustomerMangement/CustomerMangement";
import BrandManagement from "./pages/admin/BrandManagement/BrandManagement";
// import FeedbackManagement from "./pages/admin/Feedback/FeedbackManagement";

import ProductPage from "./pages/account/Product/ProductPage";
import DetailProduct from "./pages/account/DetailProduct/DetailProduct";
import Cart from "./pages/account/Cart/Cart";
import ForgotPassword from "./pages/login/ForgotPassWord";
import MyAccount from "./pages/account/MyAccount/MyAccount";
import PurchaseHistory from "./pages/account/MyAccount/PurchaseHistory";
import OrderDetail from "./pages/account/MyAccount/OrderDetail ";

import SearchPage from "./pages/account/Search/SearchPage";
import PhieuNhap from "./pages/admin/PhieuNhap/PhieuNhap";
import PrivateRoute from "./components/PrivateRoute ";
import Order from "./pages/account/Cart/Order";
import OrderReview from "./pages/account/MyAccount/OrderReview";
import SupplierManagement from "./pages/admin/SupplierManagent/SupplierManagement";

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
        <Route
          path="/account"
          element={
            <LayoutAccount>
              <PrivateRoute>
                <MyAccount />
              </PrivateRoute>
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/purchase-history"
          element={
            <LayoutAccount>
              <PrivateRoute>
                <PurchaseHistory />
              </PrivateRoute>
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/order/:id"
          element={
            <LayoutAccount>
              <OrderDetail />
            </LayoutAccount>
          }
        ></Route>

        <Route
          path="/search"
          element={
            <LayoutAccount>
              <SearchPage />
            </LayoutAccount>
          }
        ></Route>
        <Route
          path="/forgot"
          element={
            <LayoutAccount>
              <ForgotPassword />
            </LayoutAccount>
          }
        ></Route>

        <Route
          path="categories/:id"
          element={
            <LayoutAccount>
              <ProductPage />
            </LayoutAccount>
          }
        />
        <Route
          path="/product/:id"
          element={
            <LayoutAccount>
              <DetailProduct />
            </LayoutAccount>
          }
        />
        <Route
          path="/cart"
          element={
            <LayoutAccount>
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            </LayoutAccount>
          }
        />
        <Route
          path="/order"
          element={
            <LayoutAccount>
              <Order />
            </LayoutAccount>
          }
        />
        <Route
          path="/review/:orderId"
          element={
            <LayoutAccount>
              <OrderReview />
            </LayoutAccount>
          }
        />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<LayoutAdmin />}>
            {/* Dashboard */}
            <Route index element={<Dashboard />} />

            {/* Category */}
            <Route
              path="Category-Management"
              element={<CategoryManagement />}
            />
            <Route path="import-management" element={<PhieuNhap />} />

            {/* Product */}
            <Route path="product" element={<ProductManagement />} />
            {/* <Route path="product/add" element={<CreateProduct />} />
            <Route path="product/edit/:id" element={<CreateProduct />} /> */}

            {/* Order */}
            <Route path="order" element={<OrderManagement />} />
            <Route path="/admin/order/:id" element={<DetailOrder />} />

            {/* Customer */}
            <Route path="customer" element={<CustomerManagement />} />

            <Route path="brand" element={<BrandManagement />} />
            <Route path="supplier" element={<SupplierManagement />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
