import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { doLogin } from "../../store/features/auth/authenSlice";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { USER } = useSelector((state) => state.auth); // ✅ lấy user từ redux

  const [formLogin, setFormLogin] = useState({
    name: "",
    password: "",
  });

  const users = [
    { name: "Admin", password: "123456", role: "ADMIN" },
    { name: "Long", password: "123456", role: "USER" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormLogin({
      ...formLogin,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = users.find(
      (u) => u.name === formLogin.name && u.password === formLogin.password
    );

    if (found) {
      dispatch(doLogin(found)); // ✅ cập nhật redux
    } else {
      alert("Sai tên đăng nhập hoặc mật khẩu!");
    }
  };

  // ✅ Khi USER có dữ liệu thì tự động điều hướng
  useEffect(() => {
    if (USER) {
      if (USER.role === "ADMIN") navigate("/");
      else navigate("/");
    }
  }, [USER, navigate]);

  return (
    <>
      <section>
        <div className="pt-20">
          <h2 className=" text-3xl font-semibold text-center ">Account</h2>
          <div className=" container ">
            <div className=" max-w-xl mx-auto ">
              <h2 className=" font-semibold text-2xl ">Sign in</h2>
              <form onSubmit={handleSubmit}>
                <div className="mt-5">
                  <input
                    className=" mt-2 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px] "
                    type="text"
                    name="name"
                    placeholder="userName"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className=" mt-3 ">
                  <input
                    className=" mt-2 w-full h-[50px] border border-gray p-5 rounded-lg text-[14px] "
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                  />
                </div>

                <Link
                  to={"/register"}
                  className="text-xs mt-5 mb-5 block hover:underline "
                >
                  Register
                </Link>

                <button
                  type="submit"
                  className="w-full uppercase h-[50px] bg-black text-white font-semibold text-sm px-4 flex-1 rounded-lg hover:bg-white border hover:border-black hover:text-black transition-all"
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
