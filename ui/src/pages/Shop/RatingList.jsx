import React, { memo } from "react";
import { format } from "date-fns";

const RatingList = memo(({ ratings }) => {
  const getRandomColor = () => {
    const colors = [
      "bg-primary",
      "bg-secondary",
      "bg-accent",
      "bg-info",
      "bg-success",
      "bg-warning",
      "bg-error",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="flex flex-col gap-4">
      {ratings.map((rating) => (
        <div
          key={rating?.id}
          className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center bg-white p-4 shadow-sm rounded-md"
        >
          <div className="flex gap-4 items-start sm:items-center">
            {/* Avatar */}
            <div
              className={`w-12 h-12 flex-none rounded-full font-semibold flex items-center justify-center text-white text-lg ${getRandomColor()}`}
            >
              {rating?.user?.firstName.charAt(0)}
            </div>

            {/* Rating content */}
            <div>
              <p className="text-base font-medium">{rating?.title}</p>
              <span className="text-sm italic font-light block mb-2 text-gray-500">
                {format(new Date(rating?.createdAt), "EEEE, MMMM d, yyyy")}
              </span>
              <p className="text-sm text-gray-700">{rating?.comment}</p>
            </div>
          </div>

          {/* Star rating */}
          <div className="rating px-1 sm:px-4 mt-2 sm:mt-0 self-start sm:self-auto">
            {[1, 2, 3, 4, 5].map((star) => (
              <input
                key={star}
                type="radio"
                readOnly
                className="mask mask-star bg-orange-500"
                checked={star <= Math.round(rating?.rating)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

export default RatingList;
