import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "../../axios.js";
import { ApiConfig } from "../../config/ApiConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setSignIn } from "../../store/slices/authSlice";
import { FcGoogle } from "react-icons/fc";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(ApiConfig.login, data);
      if (res.data.status === "success") {
        toast.success(res?.data?.message);
        dispatch(setSignIn(res?.data?.data));
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      if (error?.status === 401) {
        toast.error(error?.response?.data?.message);
      }

      if (error?.status === 422) {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3333/login/OAuth";
  };

  return (
    <div>
      <h3 className="text-xl">Login</h3>
      <hr className="my-4 text-gray-400" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="w-full flex flex-col">
              <label htmlFor="email" className="font-light mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Please Enter Your Email"
                className="input focus:outline-0 rounded-none w-full  py-6"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col mt-2">
              <label htmlFor="password" className="font-light mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Please Enter Your Password"
                className="input focus:outline-0 rounded-none w-full  py-6"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-sm text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="btn w-full md:w-1/2 border border-gray-300 bg-white hover:bg-gray-100 text-sm font-medium text-gray-700 gap-2"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>
          </div>
        </div>

        <hr className="my-4 text-gray-400" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="btn btn-outline btn-primary py-4 px-8 font-normal"
              type="submit"
            >
              Login
            </button>

            <button
              type="button"
              className="btn btn-ghost font-normal"
              onClick={() => navigate("/signup")}
            >
              Create An Account
            </button>
          </div>

          <button
            type="button"
            className="btn btn-link font-normal"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
