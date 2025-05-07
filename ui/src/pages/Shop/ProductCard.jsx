import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../../store/slices/wishlistSlice";
import { GoHeart, GoHeartFill } from "react-icons/go";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const ProductCard = ({ product }) => {
  const heartRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.productIds);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const isWishlisted = wishlist.includes(product.id);

  const fireConfetti = () => {
    const heartEl = heartRef.current;
    if (!heartEl) return;

    const rect = heartEl.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    confetti({
      particleCount: 80,
      spread: 60,
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      },
    });
  };

  const handleHeartClick = (e, productId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please Login to add product in your wishlist");
      return;
    }

    dispatch(toggleWishlist(productId));

    if (!isWishlisted) {
      fireConfetti();
    }
  };

  return (
    <div
      className="flex flex-col cursor-pointer shadow-sm rounded-md border border-[#8080804d] bg-white"
      role="button"
      onClick={() => navigate(`/shop/${product?.id}`)}
    >
      <div className="relative h-44 flex-none bg-gray-200">
        <img
          src={product?.thumbnail}
          className="h-full w-full object-contain"
        />

        {/* heart icon */}
        <div className="absolute top-1 right-1">
          <button
            type="button"
            className="cursor-pointer"
            ref={heartRef}
            onClick={(e) => handleHeartClick(e, product?.id)}
          >
            {isWishlisted ? (
              <GoHeartFill size={25} className="text-red-500" />
            ) : (
              <GoHeart size={25} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="h-full flex flex-col justify-between gap-2 p-4">
        <div>
          <h6 className="text-lg font-normal hover:text-primary hover:underline">
            {product?.name}
          </h6>

          <span className="italic text-xs text-secondary">
            {product?.category?.name}
          </span>
        </div>

        <p className="font-light text-sm">
          {product?.description && product.description.length > 50
            ? product.description.slice(0, 50) + "..."
            : product?.description}
        </p>

        <div className="flex items-center justify-between text-lg">
          <span>₹{parseFloat(product?.price)}</span>

          <div className="flex items-center gap-2">
            <div className="mask mask-star-2 bg-orange-500 w-5 h-5" />
            <span>{parseFloat(product?.averageRating).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
