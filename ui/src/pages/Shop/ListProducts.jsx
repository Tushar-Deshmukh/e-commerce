import React, { useState, useEffect } from "react";
import productService from "../../services/product.service";
import ProductCard from "./ProductCard";
import { useDebounce } from "../../custome-hooks/useDebounce";
import { fetchWishlistedIds } from "../../store/slices/wishlistSlice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const ListProducts = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(1);
  const [value, setValue] = useState(5000);
  const [sortBy, setSortBy] = useState("newest_first");
  const [page, setPage] = useState(1);
  const [paginationData, setPaginationData] = useState({
    totalPages: 1,
    totalCount: 0,
    perPage: 10,
  });
  const debouncedPrice = useDebounce(value);
  const debouncedRating = useDebounce(rating);
  const min = 100;
  const max = 5000;

  const location = useLocation();
  const categorySlug =
    new URLSearchParams(location.search).get("categorySlug") || "";

  const getProducts = async () => {
    try {
      setLoading(true);

      const queryParams = {
        page,
        perPage: 10,
        sortBy,
        minPrice: 100,
        maxPrice: debouncedPrice,
        averageRating: debouncedRating,
        categorySlug: categorySlug || "",
      };

      const data = await productService.getAllProducts(queryParams);

      if (data.status === "success") {
        setProducts(data?.data?.records);
        setPaginationData(data?.data?.pagination);
      }
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [debouncedPrice, debouncedRating, sortBy, page, categorySlug]);

  useEffect(() => {
    dispatch(fetchWishlistedIds());
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-1/4 flex flex-col gap-4">
        {/* price range picker */}
        <div className="w-full px-4 py-6 bg-white rounded-none shadow-sm">
          <label className="block mb-4 font-medium">
            Price Range: ₹{value}
          </label>

          <div className="relative w-full flex items-center">
            {/* Range Input */}
            <input
              type="range"
              min={min}
              max={max}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="range range-primary range-xs w-full transition-all duration-300"
            />
          </div>

          {/* Min/Max Labels */}
          <div className="flex justify-between text-sm mt-2 text-gray-500">
            <span>₹{min}</span>
            <span>₹{max}</span>
          </div>
        </div>

        {/* rating range picker */}
        <div className="w-full px-4 py-6 bg-white rounded-none shadow-sm">
          <label className="block text-sm mb-2 font-medium">
            Select Rating: {rating} ⭐
          </label>

          {/* Range Slider with Tooltip */}
          <div className="relative">
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="range range-warning w-full"
            />
          </div>

          {/* Tick Marks */}
          <div className="flex justify-between px-2.5 mt-2 text-xs">
            {[...Array(5)].map((_, i) => (
              <span key={i}>|</span>
            ))}
          </div>

          {/* Number Labels */}
          <div className="flex justify-between px-2.5 mt-2 text-xs text-gray-500">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="py-2 px-6 bg-white rounded-sm shadow-sm w-full mb-4 flex justify-between items-center">
          <div>
            Showing :{" "}
            <span className="text-sm text-gray-400">
              1-{paginationData?.perPage} of {paginationData?.totalCount}{" "}
              products
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-nowrap">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select focus:outline-0"
            >
              <option value="newest_first">Newest First</option>
              <option value="price_high_to_low">Price High To Low</option>
              <option value="price_low_to_high">Price Low to High</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gray-200 animate-pulse rounded-md"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products?.length > 0 &&
              products.map((product) => (
                <ProductCard key={product?.id} product={product} />
              ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-xl text-center">No Products Found.</div>
        )}

        {/* pagination */}
        {paginationData.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="btn btn-sm btn-outline"
            >
              Prev
            </button>

            {[...Array(paginationData.totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`btn btn-sm ${
                    pageNum === page ? "btn-primary" : "btn-outline"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, paginationData.totalPages))
              }
              disabled={page === paginationData.totalPages}
              className="btn btn-sm btn-outline"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListProducts;
