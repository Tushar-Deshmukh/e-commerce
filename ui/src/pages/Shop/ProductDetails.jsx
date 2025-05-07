import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productService from "../../services/product.service";
import ratingService from "../../services/rating.service";
import { BagIcon } from "../../assets/icons";
import AddProductRating from "./AddProductRating";
import RatingList from "./RatingList";
import RatingSummary from "./RatingSummary";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import cartService from "../../services/cart.service";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [product, setProduct] = useState({});
  const [summary, setSummary] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isProductRatingAdded, setIsProductRatingAdded] = useState(false);

  const getProductDetails = async () => {
    try {
      const res = await productService.getProductById(id);
      if (res?.status === "success") {
        setProduct(res?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProductRatingSummary = async () => {
    try {
      const res = await ratingService.getProductRating(id);
      if (res?.status === "success") {
        setSummary(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToBag = async () => {
    try {
      if (!isAuthenticated) {
        toast.error("Please login to add product to the bag");
        return;
      }

      const data = {
        productId: Number(id),
        quantity: Number(quantity),
        price: Number(product?.price * quantity),
      };

      const res = await cartService.addToCart(data);
      console.log("res", res);
      if(res.status === 'success'){
        toast.success(res.message);
        dispatch(addToCart(data))
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductDetails();
    getProductRatingSummary();
  }, [id, isProductRatingAdded]);

  return (
    <div className="p-4 space-y-6">
      {/* Product Image and Info */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <img
            src={product?.thumbnail}
            alt={product?.name}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>

        <div className="w-full md:w-1/2 p-4 bg-white rounded-md shadow-md space-y-4">
          <div>
            <h3 className="text-2xl text-primary font-semibold">
              {product?.name}
            </h3>
            <p className="text-sm italic text-secondary">
              {product?.category?.name}
            </p>
          </div>

          <hr className="text-gray-200" />

          <div>
            <p className="text-sm font-light text-gray-600">
              {product?.description}
            </p>
            <h6 className="text-2xl mt-2 font-bold">
              ₹{parseFloat(product?.price)}
            </h6>
          </div>

          <div>
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              value={quantity}
              type="number"
              className="mt-2 input w-full rounded-none focus:outline-0"
              onChange={(e) => setQuantity(e.target.value)}
              min={1}
            />
          </div>

          <hr className="text-gray-200" />

          <button
            className="btn w-full lg:w-1/2 bg-transparent rounded-none font-normal"
            onClick={handleAddToBag}
          >
            <BagIcon /> Add To Bag
          </button>
        </div>
      </div>

      {/* Ratings Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2">
          <RatingSummary productRatingSummary={summary?.summary} />
        </div>

        <div className="w-full lg:w-1/2 space-y-4">

          {summary?.ratings && summary?.ratings.length > 0 && (
            <RatingList ratings={summary?.ratings} />
          )}

          <AddProductRating
            productId={id}
            setIsProductRatingAdded={setIsProductRatingAdded}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
