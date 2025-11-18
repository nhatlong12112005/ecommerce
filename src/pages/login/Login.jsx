import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doLogin } from "../../store/features/auth/authenSlice";
import axiosClient from "../../services/axiosClient";
import { API_LOGIN } from "../../constant/api";
import { toast } from "react-toastify";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormLogin({
      ...formLogin,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post(API_LOGIN, formLogin);
      dispatch(doLogin(res.data));

      // ✅ Reset lại form sau khi đăng nhập
      setFormLogin({ email: "", password: "" });

      toast.success("Đăng nhập thành công", {
        autoClose: 1000,
        position: "top-right",
      });
      navigate("/");
    } catch (error) {
      toast.error("Đăng nhập thất bại", {
        autoClose: 1000,
        position: "top-right",
      });
      console.log(error);
    }
  };

  return (
    <>
      <section>
        <div className="pt-20">
          <h2 className="text-3xl font-semibold text-center">Account</h2>
          <div className="container">
            <div className="max-w-xl mx-auto">
              <h2 className="font-semibold text-2xl">Sign in</h2>

              {/* ✅ Tắt autofill */}
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="mt-5">
                  <input
                    className="mt-2 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px]"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formLogin.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mt-3">
                  <input
                    className="mt-2 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px]"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formLogin.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="flex justify-between mt-5 mb-5 text-xs">
                  <Link to="/register" className="hover:underline">
                    Register
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full uppercase h-[50px] bg-black text-white font-semibold text-sm px-4 rounded-lg hover:bg-white border hover:border-black hover:text-black transition-all"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-12 pb-12"></section>
    </>
  );
};
