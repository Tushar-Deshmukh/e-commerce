import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "../../axios";
import { ApiConfig } from "../../config/ApiConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

const ForgotPassword = () => {
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
      const res = await axios.post(ApiConfig.forgotPassword, data);
      if (res.data.status === "success") {
        toast.success(res?.data?.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h3 className="text-xl">Forgot Password</h3>
      <hr className="my-4 text-gray-400" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label htmlFor="email" className="font-light mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Please Enter Your Email"
            className="input focus:outline-0 rounded-none w-full lg:w-1/2 py-6"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
        </div>

        <hr className="my-4 text-gray-400" />

        <div className="flex items-center justify-between">
          <button
            className="btn btn-outline btn-primary py-4 px-8 font-normal"
            type="submit"
          >
            Send Email
          </button>

          <button
            type="button"
            className="btn btn-link font-normal"
            onClick={() => navigate("/login")}
          >
            Back To Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
