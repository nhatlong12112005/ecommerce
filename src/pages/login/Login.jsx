import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { API_LOGIN } from "../../constant/api";

export const Login = () => {
  const navigate = useNavigate();
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
  const handleSubmit = async () => {
    try {
      const payload = {
        ...formLogin,
        role: "USER",
      };
      const res = await axiosClient.post(API_LOGIN, payload);
      console.log(res);
      if (res.status === 200) {
        navigate("/");
      }
    } catch (error) {
      alert("that bai");
      console.log(error);
    }
  };
  return (
    <>
      <section>
        <div className="pt-20">
          <h2 className=" text-3xl font-semibold text-center ">Account</h2>
          <div className=" container ">
            <div className=" max-w-xl mx-auto ">
              <h2 className=" font-semibold text-2xl ">Sign in</h2>
              <div>
                <div className="mt-5">
                  <input
                    className=" mt-2 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px] "
                    type="email"
                    name="email"
                    placeholder=" Email "
                    onChange={handleChange}
                  />
                </div>
                <div className=" mt-3 ">
                  <input
                    className=" mt-2 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px] "
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                </div>
                <Link
                  to={"/register"}
                  className="text-xs mt-5 mb-5 block hover:underline "
                >
                  Register
                </Link>
                <button
                  onClick={handleSubmit}
                  className="w-full uppercase h-[50px] bg-black text-white font-semibold text-sm px-4 flex-1 rounded-lg hover:bg hover:bg-white border hover:border-black hover:text-black transition-all"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-12 pb-12"></section>
    </>
  );
};
