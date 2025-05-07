import React from "react";
import { useForm, Controller } from "react-hook-form";
import { OTPInput } from "input-otp";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import { ApiConfig } from "../../config/ApiConfig";
import toast from "react-hot-toast";

// Yup validation schema
const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be exactly 6 digits"),
});

const VerifyOtp = () => {
  const email = new URLSearchParams(window.location.search)?.get("email");

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(ApiConfig.verifyOtp, {
        email: email,
        otp: data.otp,
      });

      if(res.data.status == 'failure'){
        toast.error(res?.data?.message)
        return
      }

      if(res?.data.status == 'success'){
        toast.success(res?.data?.message)
        navigate("/login")
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  px-4">
      <h2 className="text-2xl font-semibold mb-4">Verify OTP</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <OTPInput
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
              containerClassName="flex gap-2 mb-1"
              autoFocus
              render={({ slots }) => {
                return (
                  <div className="flex gap-2">
                    {slots.map((item, i) => (
                      <Slot {...item} key={i} />
                    ))}
                  </div>
                );
              }}
            />
          )}
        />

        {errors.otp && (
          <p className="text-sm text-red-500 mb-0">{errors.otp.message}</p>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full py-3 font-medium text-white mt-6"
        >
          Verify OTP
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="btn btn-link w-full text-center"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;

function Slot(props) {
  return (
    <div
      className={`relative w-12 h-12 bg-white flex items-center justify-center text-xl border border-gray-500 ${
        props.isActive ? "outline outline-blue-500" : ""
      }`}
    >
      <div className="group-has-[input[data-input-otp-placeholder-shown]]:opacity-20">
        {props.char ?? props.placeholderChar}
      </div>

      {props.hasFakeCaret && (
        <div className="absolute inset-0 flex items-center justify-center animate-caret-blink pointer-events-none">
          <div className="w-px h-6 bg-black" />
        </div>
      )}
    </div>
  );
}
