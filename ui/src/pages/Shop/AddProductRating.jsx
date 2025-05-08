import { yupResolver } from "@hookform/resolvers/yup";
import React, { memo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import * as yup from "yup";
import ratingService from "../../services/rating.service";

export const reviewSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title should be at least 3 characters"),
  comment: yup
    .string()
    .required("Comment is required")
    .min(5, "Comment should be at least 5 characters"),
  rating: yup
    .number()
    .required("Rating is required")
    .min(1, "Minimum rating is 1 star")
    .max(5, "Maximum rating is 5 stars"),
  recommended: yup
    .string()
    .oneOf(["true", "false"], "Recommendation is required")
    .required("Recommendation is required"),
});

const AddProductRating = memo(({ productId, setIsProductRatingAdded }) => {
  
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reviewSchema),
  });

  const onSubmit = async (data) => {
    try {
      if (!isAuthenticated) {
        toast.error("Please Login to publish a review!");
        return;
      }

      const formdata = {
        ...data,
        recommended: Boolean(data.recommended),
        product_id: Number(productId),
      };

      const res = await ratingService.addProductRating(formdata);

      if (res?.status === "success") {
        toast.success(res?.message);
        reset();
        setIsProductRatingAdded(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-sm rounded-md w-full">
      <h4 className="text-xl mb-4 font-semibold text-gray-800">Add Review</h4>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div className="flex flex-col">
          <label
            htmlFor="title"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter Review Title"
            className="input input-bordered rounded-md w-full focus:outline-0"
            {...register("title")}
          />
          {errors.title && (
            <span className="text-sm text-red-500">{errors.title.message}</span>
          )}
        </div>

        {/* Comment */}
        <div className="flex flex-col">
          <label
            htmlFor="comment"
            className="text-sm font-medium text-gray-600 mb-1 "
          >
            Comment
          </label>
          <textarea
            id="comment"
            placeholder="Write your review..."
            className="textarea textarea-bordered rounded-md w-full min-h-[100px] focus:outline-0"
            {...register("comment")}
          />
          {errors.comment && (
            <span className="text-sm text-red-500">
              {errors.comment.message}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Rating
          </label>
          <div className="rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <input
                key={value}
                type="radio"
                value={value}
                className="mask mask-star bg-orange-500"
                aria-label={`${value} star`}
                {...register("rating")}
              />
            ))}
          </div>
          {errors.rating && (
            <span className="text-sm text-red-500">
              {errors.rating.message}
            </span>
          )}
        </div>

        {/* Recommendation */}
        <div className="flex flex-col">
          <label
            htmlFor="recommended"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Will you recommend this product?
          </label>
          <select
            defaultValue=""
            className="select select-bordered rounded-md w-full focus:outline-0"
            {...register("recommended")}
          >
            <option value="" disabled>
              -- Select an option --
            </option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          {errors.recommended && (
            <span className="text-sm text-red-500">
              {errors.recommended.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="btn btn-primary w-full sm:w-1/2 md:w-1/3 rounded-md text-white"
          >
            Publish Review
          </button>
        </div>
      </form>
    </div>
  );
});

export default AddProductRating;
