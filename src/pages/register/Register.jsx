import React, { useState } from "react";
// import axios from "axios";
import { API_REGISTER } from "../../constant/api";
import axiosClient from "../../services/axiosClient";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  const [formRegister, setFormRegister] = useState({
    email: "",
    name: "",
    password: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormRegister({
      ...formRegister,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post(API_REGISTER, formRegister);
      console.log(res);

      if (res.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" flex items-center justify-center min-h-screen ">
      <div className=" w-full max-w-md bg-white p-8 shadow rounded ">
        <h2 className=" text-2xl font-bold mb-6 text-center ">Register</h2>

        {/* Thêm autoComplete="off" vào form để giảm bớt tự động điền */}
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            className=" mb-4 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px] "
            type="text"
            name="name"
            placeholder="userName"
            onChange={handleChange}
            value={formRegister.name}
            autoComplete="off"
          />
          <input
            className=" mb-4 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px] "
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            value={formRegister.phone}
            autoComplete="off"
          />
          <input
            className=" mb-4 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px] "
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formRegister.email}
            autoComplete="off"
          />
          <input
            className=" mb-4 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px] "
            type="text"
            name="address"
            placeholder="Address"
            onChange={handleChange}
            value={formRegister.address}
            autoComplete="off"
          />
          <input
            className=" mb-4 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px] "
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formRegister.password}
            autoComplete="new-password"
          />
          <button className="w-full uppercase h-[50px] bg-black text-white font-semibold text-sm px-4 flex-1 rounded-lg hover:bg hover:bg-white border hover:border-black hover:text-black transition-all">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};
