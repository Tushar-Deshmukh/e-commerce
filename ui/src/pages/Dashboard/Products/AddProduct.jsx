import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchCategories } from "../../../store/slices/categorySlice";
import { getCategories } from "../../../store/slices/categorySlice";
import axios from "../../../axios";
import { ApiConfig } from "../../../config/ApiConfig";
import toast from "react-hot-toast";
import productService from "../../../services/product.service";

const productSchema = yup.object().shape({
  name: yup
    .string()
    .required("Product name is required")
    .min(2, "Name must be at least 2 characters"),

  description: yup
    .string()
    .required("Description is required")
    .min(2, "Description must be at least 2 characters")
    .max(500, "Description must not be more than 500 characters"),

  category: yup
    .string()
    .required("Category is required")
    .notOneOf([""], "Category is required"),

  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be greater than 0"),
});

const AddProduct = ({
  setIsAddingProduct,
  isEditingProduct,
  productId,
  setIsEditingProduct,
}) => {
  const dispatch = useDispatch();
  const categories = useSelector(getCategories);
  const loading = useSelector((state) => state.category.loading);
  const error = useSelector((state) => state.category.error);

  const [existingThumbnail, setExistingThumbnail] = useState(null);
  const [removeExistingThumbnail, setRemoveExistingThumbnail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(productSchema),
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category_id", data.category);
      formData.append("price", data.price);

      // handle file input manually
      if (data.thumbnail && data.thumbnail[0]) {
        formData.append("image", data.thumbnail[0]);
      }

      if (isEditingProduct) {
        const res = await productService.updateProduct(productId, formData);

        if (res.status === "success") {
          toast.success(res?.message);
          reset();
          setExistingThumbnail(null);
          setIsAddingProduct(false);
          return;
        }
      }

      // send to your API (example)
      const res = await axios.post(ApiConfig.addProduct, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.status === "success") {
        toast.success(res.data?.message);
        reset();
        setExistingThumbnail(null);
        setIsAddingProduct(false);
      }
    } catch (error) {
      console.log(error);
      if (error?.status === 422) {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const res = await productService.deleteProduct(productId);

      if (res.status === "success") {
        toast.success(res?.message);
        setIsEditingProduct(false);
        setIsAddingProduct(false);
      }
    } catch (error) {}
  };

  const getProductDetails = async () => {
    const data = await productService.getProductById(productId);
    if (data?.status === "success") {
      reset({
        name: data?.data?.name || "",
        description: data?.data?.description || "",
        price: data?.data?.price || "",
        category: data?.data?.categoryId || "",
      });

      //to show the thumbnail image at the time of editing
      setExistingThumbnail(data?.data?.thumbnail || null);
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());

    if (isEditingProduct && productId) {
      getProductDetails();
    }
  }, [dispatch, productId]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label htmlFor="name" className="font-light mb-2">
            Name
          </label>
          <input
            id="name"
            type="name"
            placeholder="Please Enter Product Name"
            className="input focus:outline-0 rounded-none w-full py-6"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div className="mt-2 flex flex-col">
          <label htmlFor="description" className="font-light mb-2">
            Description
          </label>
          <textarea
            id="description"
            type="description"
            placeholder="Please Enter Product Description"
            className="textarea focus:outline-0 rounded-none w-full py-4"
            {...register("description")}
          />
          {errors.description && (
            <span className="text-sm text-red-500">
              {errors.description.message}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-4">
          <div className="w-full flex flex-col">
            <label htmlFor="price" className="font-light mb-2">
              Price
            </label>
            <input
              id="price"
              type="number"
              placeholder="Please Enter Product Price"
              className="input focus:outline-0 rounded-none w-full py-6"
              {...register("price")}
            />
            {errors.price && (
              <span className="text-sm text-red-500">
                {errors.price.message}
              </span>
            )}
          </div>

          <div className="w-full flex flex-col">
            <label htmlFor="category" className="font-light mb-2">
              Category
            </label>

            <select
              defaultValue=""
              className="select focus:outline-0 rounded-none w-full h-[50px]"
              {...register("category")}
            >
              <option value="" disabled>
                Choose Category
              </option>
              {categories &&
                categories.length > 0 &&
                categories.map((category) => {
                  return (
                    <option key={category.id} value={category?.id}>
                      {category?.name}
                    </option>
                  );
                })}
            </select>

            {errors.category && (
              <span className="text-sm text-red-500">
                {errors.category.message}
              </span>
            )}
          </div>
        </div>

        <div className="w-full mt-2 flex flex-col">
          <label htmlFor="name" className="font-light mb-2">
            Thumbnail
          </label>

          {existingThumbnail && !removeExistingThumbnail ? (
            <div className="relative w-[150px]">
              <img
                src={existingThumbnail}
                alt="Existing Thumbnail"
                className="w-full h-auto rounded"
              />
              <button
                type="button"
                onClick={() => setRemoveExistingThumbnail(true)}
                className="cursor-pointer absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-bl-md"
              >
                ✕
              </button>
            </div>
          ) : (
            <input
              type="file"
              className="w-full file-input file-input-md rounded-none"
              {...register("thumbnail")}
            />
          )}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <button type="submit" className="btn btn-outline btn-primary">
            Submit
          </button>

          {isEditingProduct && (
            <button
              type="button"
              className="btn btn-outline btn-error"
              onClick={handleDeleteProduct}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
