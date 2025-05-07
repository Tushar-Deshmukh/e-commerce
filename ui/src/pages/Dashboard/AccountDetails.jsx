import React from "react";
import { roles } from "../../constants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "../../axios";
import { ApiConfig } from "../../config/ApiConfig";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { getAuthUser } from "../../store/slices/authSlice";

const accountDetailsSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
});

const AccountDetails = () => {
  const authUser = useSelector(getAuthUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(accountDetailsSchema),
    defaultValues: {
      first_name: authUser?.first_name ?? "",
      last_name: authUser?.last_name ?? "",
      phone_number: authUser?.phone_number ?? "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.put(`${ApiConfig.updateUser}/${authUser.id}`, {
        first_name: data?.first_name,
        last_name: data?.last_name,
        phone_number: data?.phone_number,
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
      <h3 className="text-xl font-medium">Account Details</h3>

      <hr className="my-4 text-gray-400" />

      <div className="flex items-center gap-4">
        <h6>{authUser?.email}</h6>
        <button className="btn btn-outline border border-gray-400 font-normal">
          {authUser?.role === roles.CUSTOMER ? "Member" : "Admin"}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-2 w-full flex items-center gap-4">
          <div className="w-full flex flex-col">
            <label htmlFor="first_name" className="font-light mb-2">
              First Name
            </label>
            <input
              id="first_name"
              type="text"
              placeholder="Please Enter Your Email"
              className="input focus:outline-0 rounded-none w-full py-6"
              {...register("first_name")}
            />
            {errors.first_name && (
              <span className="text-sm text-red-500">
                {errors.first_name.message}
              </span>
            )}
          </div>

          <div className="w-full flex flex-col">
            <label htmlFor="last_name" className="font-light mb-2">
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              placeholder="Please Enter Your Email"
              className="input focus:outline-0 rounded-none w-full py-6"
              {...register("last_name")}
            />
            {errors.last_name && (
              <span className="text-sm text-red-500">
                {errors.last_name.message}
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 w-full flex flex-col">
          <label htmlFor="phone_number" className="font-light mb-2">
            Phone Number
          </label>
          <input
            id="phone_number"
            type="text"
            placeholder="Please Enter Your Phone Number"
            className="input focus:outline-0 rounded-none w-full py-6"
            {...register("phone_number")}
          />
          {errors.phone_number && (
            <span className="text-sm text-red-500">
              {errors.phone_number.message}
            </span>
          )}
        </div>

        <hr className="my-4 text-gray-400" />

        <button type="submit" className="btn font-normal px-8 bg-white">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AccountDetails;
