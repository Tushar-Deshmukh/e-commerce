import React, { memo } from "react";

const RatingSummary = memo(({ productRatingSummary }) => {
  const summary = productRatingSummary;

  const average = parseFloat(summary?.average_rating || 0);
  const total = summary?.total_ratings || 0;
  const percentages = summary?.percentages || {};

  const starTextMap = {
    5: "five_star",
    4: "four_star",
    3: "three_star",
    2: "two_star",
    1: "one_star",
  };

  return (
    <div className="p-4 bg-white shadow-sm rounded-sm">
      <h3 className="text-xl mb-2">Rating</h3>

      <div className="flex items-center flex-wrap md:flex-nowrap justify-between md:justify-start gap-3 mb-2">
        <div className="rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <input
              key={star}
              type="checkbox"
              className={`mask mask-star-2 bg-orange-400`}
              checked={star <= Math.round(average)}
              readOnly
            />
          ))}
        </div>

        <span className="text-sm text-gray-600 font-semibold">
          {average.toFixed(1)} / 5 ( Based on {total} reviews)
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const key = starTextMap[star];
          const value = percentages?.[key] || 0;

          return (
            <div key={star} className="flex items-center gap-4">
              <span className="text-sm font-medium ">{star} star</span>

              <progress
                className={`progress ${
                  star === 5
                    ? "progress-primary"
                    : star === 4
                    ? "progress-success"
                    : star === 3
                    ? "progress-info"
                    : star === 2
                    ? "progress-warning"
                    : "progress-error"
                } rounded-none h-4 flex-1`}
                value={value}
                max="100"
              ></progress>

              <span className="w-12 text-right text-sm text-gray-500 font-semibold">
                {parseFloat(value)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default RatingSummary;
