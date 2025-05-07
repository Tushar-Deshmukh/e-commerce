import React, { useEffect, useState } from "react";
import wishlistservice from "../../services/wishlist.service";
import { FaHeartBroken } from "react-icons/fa";
import toast from "react-hot-toast";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  const getWishlistItems = async () => {
    try {
      const data = await wishlistservice.mywishlist();

      if (data.status === "success") {
        setWishlist(data?.data);
      }
    } catch (error) {
      setWishlist([]);
    }
  };

  const handleRemoveFromWishlist = async (id) => {
    try {
       const res = await wishlistservice.removefromwishlist(id);
       if(res?.status === 'success'){
        toast.success(res?.message);
        getWishlistItems();
       }
    
    } catch (error) {
        console.log('error',error)
    }
  }

  useEffect(() => {
    getWishlistItems();
  }, []);

  if (wishlist.length === 0) {
    return (
      <div className="text-center text-lg">No products in the wishlist.</div>
    );
  }

  return (
    <div>
      {wishlist &&
        wishlist.length > 0 &&
        wishlist.map((item) => {
          return (
            <div
              key={item?.id}
              className="relative flex items-center bg-white hover:bg-gray-100 hover:cursor-pointer border border-gray-200 my-4"
              role="button"
            >
              <FaHeartBroken
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-lg z-10 cursor-pointer"
                onClick={() => handleRemoveFromWishlist(item?.product?.id)}
              />

              <div className="h-28 w-28">
                <img
                  src={item?.product?.thumbnail}
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>

              <div className="flex-1 p-4 rounded-sm">
                <h4 className="text-lg mb-3">{item?.product?.name}</h4>
                <p className="font-light text-sm">
                  {item?.product?.description}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Wishlist;
