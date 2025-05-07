import React from "react";
import { roles } from "../../constants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "../../axios";
import { ApiConfig } from "../../config/ApiConfig";
import toast from "react-hot-toast";

const accountSecuritySchema = yup.object().shape({
  old_password: yup.string().required("Old password is required"),
  new_password: yup.string().required("New password is required"),
  new_password_confirmation: yup
    .string()
    .oneOf([yup.ref("new_password"), null], "Passwords must match")
    .required("Please confirm your new password"),
});

const AccountSecurity = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(accountSecuritySchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.put(ApiConfig.changePassword, {
        old_password: data?.old_password,
        new_password: data?.new_password,
        new_password_confirmation: data?.new_password_confirmation,
      });

      if (res?.data?.status === "success") {
        toast.success(res?.data?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-medium">Account Security</h3>

      <hr className="my-4 text-gray-400" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-2 w-full flex items-center gap-4">
          <div className="w-full flex flex-col">
            <label htmlFor="old_password" className="font-light mb-2">
              Old Password
            </label>
            <input
              id="old_password"
              type="text"
              placeholder="Please Enter Your Email"
              className="input focus:outline-0 rounded-none w-full py-6"
              {...register("old_password")}
            />
            {errors.old_password && (
              <span className="text-sm text-red-500">
                {errors.old_password.message}
              </span>
            )}
          </div>

          <div className="w-full flex flex-col">
            <label htmlFor="new_password" className="font-light mb-2">
              New Password
            </label>
            <input
              id="new_password"
              type="text"
              placeholder="Please Enter Your Email"
              className="input focus:outline-0 rounded-none w-full py-6"
              {...register("new_password")}
            />
            {errors.new_password && (
              <span className="text-sm text-red-500">
                {errors.new_password.message}
              </span>
            )}
          </div>

          <div className="w-full flex flex-col">
            <label
              htmlFor="new_password_confirmation"
              className="font-light mb-2"
            >
              Confirm New Password
            </label>
            <input
              id="new_password_confirmation"
              type="text"
              placeholder="Confirm New Password"
              className="input focus:outline-0 rounded-none w-full py-6"
              {...register("new_password_confirmation")}
            />
            {errors.new_password_confirmation && (
              <span className="text-sm text-red-500">
                {errors.new_password_confirmation.message}
              </span>
            )}
          </div>
        </div>

        <hr className="my-4 text-gray-400" />

        <button type="submit" className="btn font-normal px-8 bg-white">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default AccountSecurity;
