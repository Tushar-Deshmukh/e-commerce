import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "../../axios";
import { ApiConfig } from "../../config/ApiConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const signupSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  first_name: yup
    .string()
    .min(2, "First Name must be at least 2 characters")
    .required("First Name is required"),
  last_name: yup
    .string()
    .min(2, "Last Name must be at least 2 characters")
    .required("Last Name is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Signup = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(ApiConfig.signup, data)
      if(res?.data.status === 'success'){
        toast.success(res?.data?.message)
        navigate(`/verify-otp?email=${data.email}`)
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h3 className="text-xl">Signup</h3>
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

        <div className="flex flex-col mt-2">
          <label htmlFor="first_name" className="font-light mb-2">
            First Name
          </label>
          <input
            id="first_name"
            type="text"
            placeholder="Please Enter Your First Name"
            className="input focus:outline-0 rounded-none w-full lg:w-1/2 py-6"
            {...register("first_name")}
          />
          {errors.first_name && (
            <span className="text-sm text-red-500">
              {errors.first_name.message}
            </span>
          )}
        </div>

        <div className="flex flex-col mt-2">
          <label htmlFor="last_name" className="font-light mb-2">
            Last Name
          </label>
          <input
            id="last_name"
            type="text"
            placeholder="Please Enter Your Last Name"
            className="input focus:outline-0 rounded-none w-full lg:w-1/2 py-6"
            {...register("last_name")}
          />
          {errors.last_name && (
            <span className="text-sm text-red-500">
              {errors.last_name.message}
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
            className="input focus:outline-0 rounded-none w-full lg:w-1/2 py-6"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>

        <hr className="my-4 text-gray-400" />

        <div className="flex justify-between items-center">
          <button
            className="btn btn-outline btn-primary py-4 px-8 font-normal"
            type="submit"
          >
            Sign Up
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

export default Signup;
