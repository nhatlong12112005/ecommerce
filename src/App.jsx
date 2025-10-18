import "./App.css";
import { Route, Routes } from "react-router-dom";
import { LayoutAccount } from "./layouts/LayoutAccount/LayoutAccount";
import { Home } from "./pages/account/Home";
import { Login } from "./pages/login/Login";
import { Register } from "./pages/register/Register";
function App() {
  return (
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
    </Routes>
  );
}

export default App;
