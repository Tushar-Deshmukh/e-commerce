import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "../../axios";
import { ApiConfig } from "../../config/ApiConfig";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search)?.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(ApiConfig.resetPassword, {
        token,
        password: data.password,
      });

      if (res.data.status === "success") {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <h3 className="text-xl">Reset Password</h3>
      <hr className="my-4 text-gray-400" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col mt-2">
          <label htmlFor="password" className="font-light mb-2">
            New Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your new password"
            className="input focus:outline-0 rounded-none w-full lg:w-1/2 py-6"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col mt-2">
          <label htmlFor="confirm_password" className="font-light mb-2">
            Confirm New Password
          </label>
          <input
            id="confirm_password"
            type="password"
            placeholder="Confirm your new password"
            className="input focus:outline-0 rounded-none w-full lg:w-1/2 py-6"
            {...register("confirm_password")}
          />
          {errors.confirm_password && (
            <span className="text-sm text-red-500">
              {errors.confirm_password.message}
            </span>
          )}
        </div>

        <hr className="my-4 text-gray-400" />

        <div className="flex justify-between items-center">
          <button
            className="btn btn-outline btn-primary py-4 px-8 font-normal"
            type="submit"
          >
            Reset Password
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

export default ResetPassword;
