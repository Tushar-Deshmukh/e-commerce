import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import axios from "../../../axios";
import { ApiConfig } from "../../../config/ApiConfig";
import toast from "react-hot-toast";
import categoryService from "../../../services/category.service";

const categorySchema = yup.object().shape({
  name: yup
    .string()
    .required("Category name is required")
    .min(2, "Name must be at least 2 characters"),
  slug: yup
    .string()
    .required("Slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL friendly")
    .optional(),
  description: yup.string().nullable(),
  isActive: yup.boolean().optional(),
});

const AddCateory = ({
  setIsAddingCategory,
  isEditingCategory,
  categoryId,
  setIsEditingCategory,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(categorySchema),
  });

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const onSubmit = async (data) => {
    try {
      const slug = generateSlug(data.name);

      if (isEditingCategory) {
        const dataToUpdate = {
          name: data.name,
          slug: slug,
          description: data.description,
        };
        const res = await categoryService.updateCategory(
          categoryId,
          dataToUpdate
        );

        if (res?.status === "success") {
          toast.success(res?.message);
          setIsEditingCategory(false);
          setIsAddingCategory(false);
          return;
        }
      }

      const res = await axios.post(ApiConfig.createCategory, {
        name: data?.name,
        slug: slug,
        description: data?.description,
      });

      if (res?.data?.status === "success") {
        toast.success(res?.data?.message);
        reset({
          name: "",
          description: "",
        });
        setIsAddingCategory(false);
      }
    } catch (error) {
      if (error.status === 422) {
        toast.error(error.response?.data?.message);
      }

      if (error.status === 409) {
        toast.error(error.response?.data?.message);
      }
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const res = await categoryService.deleteCategory(categoryId);

      if (res.status === "success") {
        toast.success(res?.message);
        setIsEditingCategory(false);
        setIsAddingCategory(false);
      }
    } catch (error) {}
  };

  const getCategoryById = async (categoryId) => {
    try {
      const res = await axios.get(`${ApiConfig.getCategoryById}/${categoryId}`);
      if (res.data.status === "success") {
        reset({
          name: res?.data?.data.name || "",
          description: res?.data?.data?.description || "",
          isActive: res?.data?.data?.isActive || false,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isEditingCategory && categoryId) {
      getCategoryById(categoryId);
    }
  }, [categoryId]);

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
            placeholder="Please Enter Category Name"
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
            placeholder="Please Enter Category Description"
            className="textarea focus:outline-0 rounded-none w-full py-6"
            {...register("description")}
          />
          {errors.description && (
            <span className="text-sm text-red-500">
              {errors.description.message}
            </span>
          )}
        </div>

        {isEditingCategory && (
          <div className="my-4 flex items-center gap-2">
            <span>Active?</span>
            <input
              type="checkbox"
              defaultChecked
              className="toggle toggle-primary"
              {...register("isActive")}
            />
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <button className="btn btn-outline btn-success" type="submit">
            Save
          </button>

          {isEditingCategory && (
            <button
              className="btn btn-outline btn-error"
              type="button"
              onClick={handleDeleteCategory}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddCateory;
