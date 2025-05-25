import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import addressService from "../../../services/address.service";
import toast from "react-hot-toast";
import { useEffect } from "react";

const addressSchema = yup.object().shape({
  street: yup.string().required("Address Line 1 is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  postal_code: yup.string().required("Postal Code is required"),
  country: yup.string().required("Country is required"),
  type: yup
    .string()
    .oneOf(["home", "work"])
    .required("Address type is required"),
});

export default function AddressForm({
  setIsAddingAddress,
  isEditing,
  setIsEditing,
  addressId,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addressSchema),
    // defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      let res;
      if (isEditing) {
        res = await addressService.updateAddress(addressId, data);
      } else {
        res = await addressService.addAddress(data);
      }

      if (res?.status === "success") {
        toast.success(res?.message);
        setIsAddingAddress(false);
        setIsEditing(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const deleteAddress = async () => {
    try {
      const res = await addressService.deleteAddressById(addressId);
      if (res?.status === "success") {
        toast.success(res?.message);
        setIsAddingAddress(false);
        setIsEditing(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getAddressById = async (addressId) => {
    try {
      const res = await addressService.getAddressById(addressId);
      console.log("res", res);
      if (res?.status === "success") {
        reset({
          city: res?.data?.city,
          country: res?.data?.country,
          postal_code: res?.data?.postalCode,
          state: res?.data?.state,
          street: res?.data?.street,
          type: res?.data?.type,
        });
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    if (addressId) {
      getAddressById(addressId);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Address Line 1</label>
        <input
          {...register("street")}
          className="input input-bordered w-full"
        />
        <p className="text-red-500 text-sm">{errors.street?.message}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            {...register("city")}
            className="input input-bordered w-full"
          />
          <p className="text-red-500 text-sm">{errors.city?.message}</p>
        </div>
        <div>
          <label className="block text-sm font-medium">State</label>
          <input
            {...register("state")}
            className="input input-bordered w-full"
          />
          <p className="text-red-500 text-sm">{errors.state?.message}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Postal Code</label>
          <input
            {...register("postal_code")}
            className="input input-bordered w-full"
          />
          <p className="text-red-500 text-sm">{errors.postal_code?.message}</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Country</label>
          <input
            {...register("country")}
            className="input input-bordered w-full"
          />
          <p className="text-red-500 text-sm">{errors.country?.message}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Address Type</label>
        <select {...register("type")} className="select select-bordered w-full">
          <option value="">Select</option>
          <option value="home">Home</option>
          <option value="work">Work</option>
        </select>
        <p className="text-red-500 text-sm">{errors.type?.message}</p>
      </div>

      <div>
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Update Address" : "Save Address"}
        </button>

        {isEditing && (
          <button
            onClick={deleteAddress}
            type="button"
            className="btn btn-error text-white mx-2"
          >
            Delete Address
          </button>
        )}
      </div>
    </form>
  );
}
